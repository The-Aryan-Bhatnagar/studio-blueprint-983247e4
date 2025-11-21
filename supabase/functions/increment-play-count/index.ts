import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.81.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { song_id, traffic_source, country, city } = await req.json();

    if (!song_id) {
      return new Response(
        JSON.stringify({ error: 'song_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    // Try to get authenticated user if token is provided
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

    // Use service role key for the actual update to bypass RLS
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get device type from user agent
    const userAgent = req.headers.get('user-agent') || '';
    const deviceType = getDeviceType(userAgent);

    // Fetch user's city and country from profile
    let userCity = city || null;
    let userCountry = country || null;
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

    // Insert into play_history table with detailed tracking
    const { error: historyError } = await supabase
      .from('play_history')
      .insert({
        song_id,
        user_id: userId,
        device_type: deviceType,
        country: userCountry,
        city: userCity,
        traffic_source: traffic_source || 'direct',
        user_age_group: ageGroup,
        played_at: new Date().toISOString(),
      });

    if (historyError) {
      console.error('Error inserting play history:', historyError);
    }

    // Get current analytics
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

    // Increment play counts
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

    console.log(`Play count incremented for song: ${song_id} by user: ${userId || 'anonymous'}, device: ${deviceType}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Play count incremented',
        device_type: deviceType 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in increment-play-count function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
