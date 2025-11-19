import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.81.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { song_id } = await req.json();

    if (!song_id) {
      return new Response(
        JSON.stringify({ error: 'song_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client with service role key for bypassing RLS
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

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

    console.log(`Play count incremented for song: ${song_id}`);

    return new Response(
      JSON.stringify({ success: true, message: 'Play count incremented' }),
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
