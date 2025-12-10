import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.81.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// In-memory rate limiting store (resets on function cold start)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Rate limit configuration
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10; // Max 10 plays per IP per minute

// Clean up old entries periodically
function cleanupRateLimitStore() {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

// Check rate limit for a given identifier
function checkRateLimit(identifier: string): { allowed: boolean; remaining: number } {
  cleanupRateLimitStore();
  
  const now = Date.now();
  const existing = rateLimitStore.get(identifier);
  
  if (!existing || now > existing.resetTime) {
    rateLimitStore.set(identifier, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1 };
  }
  
  if (existing.count >= RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false, remaining: 0 };
  }
  
  existing.count++;
  return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - existing.count };
}

// Helper to get client IP from request headers
function getClientIP(req: Request): string {
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  
  const realIP = req.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }
  
  const userAgent = req.headers.get('user-agent') || 'unknown';
  return `ua-${userAgent.substring(0, 50)}`;
}

// Helper to detect device type from user agent
function getDeviceType(userAgent: string): string {
  if (!userAgent) return 'Unknown';
  
  const ua = userAgent.toLowerCase();
  if (/android/.test(ua)) return 'Android';
  if (/iphone|ipad|ipod/.test(ua)) return 'iOS';
  if (/windows phone/.test(ua)) return 'Windows Phone';
  if (/mobile/.test(ua)) return 'Mobile';
  if (/windows|mac|linux/.test(ua)) return 'Desktop';
  return 'Web';
}

// Helper to calculate age group from date of birth
function getAgeGroup(dateOfBirth: string | null): string | null {
  if (!dateOfBirth) return null;
  
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  if (age < 18) return 'Under 18';
  if (age <= 24) return '18-24';
  if (age <= 34) return '25-34';
  if (age <= 44) return '35-44';
  return '45+';
}

// Validate UUID format
function isValidUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const clientIP = getClientIP(req);
    const { allowed, remaining } = checkRateLimit(clientIP);
    
    if (!allowed) {
      console.log(`Rate limit exceeded for client: ${clientIP}`);
      return new Response(
        JSON.stringify({ error: 'Too many requests. Please try again later.' }),
        { 
          status: 429, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'X-RateLimit-Remaining': '0',
            'Retry-After': '60'
          } 
        }
      );
    }

    const { song_id, traffic_source, country, city } = await req.json();

    if (!song_id) {
      return new Response(
        JSON.stringify({ error: 'song_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!isValidUUID(song_id)) {
      console.error('Invalid song_id format:', song_id);
      return new Response(
        JSON.stringify({ error: 'Invalid song_id format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const sanitizedTrafficSource = typeof traffic_source === 'string' 
      ? traffic_source.slice(0, 50).replace(/[<>"']/g, '') 
      : 'direct';
    const sanitizedCountry = typeof country === 'string' 
      ? country.slice(0, 100).replace(/[<>"']/g, '') 
      : null;
    const sanitizedCity = typeof city === 'string' 
      ? city.slice(0, 100).replace(/[<>"']/g, '') 
      : null;

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const authHeader = req.headers.get('authorization');
    let userId: string | null = null;
    
    if (authHeader) {
      const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
        global: {
          headers: {
            authorization: authHeader,
          },
        },
      });

      const { data: { user } } = await supabaseClient.auth.getUser();
      userId = user?.id || null;
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: songExists, error: songCheckError } = await supabase
      .from('songs')
      .select('id')
      .eq('id', song_id)
      .single();

    if (songCheckError || !songExists) {
      console.error('Song not found:', song_id);
      return new Response(
        JSON.stringify({ error: 'Song not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userAgent = req.headers.get('user-agent') || '';
    const deviceType = getDeviceType(userAgent);

    let userCity = sanitizedCity;
    let userCountry = sanitizedCountry;
    let ageGroup: string | null = null;
    
    if (userId) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('city, country, date_of_birth')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (profile) {
        userCity = profile.city || userCity;
        userCountry = profile.country || userCountry;
        ageGroup = getAgeGroup(profile.date_of_birth);
      }
    }

    const { error: historyError } = await supabase
      .from('play_history')
      .insert({
        song_id,
        user_id: userId,
        device_type: deviceType,
        country: userCountry,
        city: userCity,
        traffic_source: sanitizedTrafficSource,
        user_age_group: ageGroup,
        played_at: new Date().toISOString(),
      });

    if (historyError) {
      console.error('Error inserting play history:', historyError);
    }

    const { data: analytics, error: fetchError } = await supabase
      .from('song_analytics')
      .select('*')
      .eq('song_id', song_id)
      .single();

    if (fetchError) {
      console.error('Error fetching analytics:', fetchError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch analytics' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { error: updateError } = await supabase
      .from('song_analytics')
      .update({
        total_plays: (analytics.total_plays || 0) + 1,
        plays_last_7_days: (analytics.plays_last_7_days || 0) + 1,
        plays_last_30_days: (analytics.plays_last_30_days || 0) + 1,
        updated_at: new Date().toISOString(),
      })
      .eq('song_id', song_id);

    if (updateError) {
      console.error('Error updating analytics:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to update analytics' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Play count incremented for song: ${song_id} by user: ${userId || 'anonymous'}, device: ${deviceType}, IP: ${clientIP}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Play count incremented',
        device_type: deviceType,
        rate_limit_remaining: remaining
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'X-RateLimit-Remaining': String(remaining)
        } 
      }
    );
  } catch (error) {
    console.error('Error in increment-play-count function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
