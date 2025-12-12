import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.81.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Validate cron secret for scheduled job authentication
function validateCronSecret(req: Request): boolean {
  const authHeader = req.headers.get('Authorization');
  const cronSecret = Deno.env.get('CRON_SECRET');
  
  // If CRON_SECRET is set, require it for authentication
  if (cronSecret) {
    return authHeader === `Bearer ${cronSecret}`;
  }
  
  // Also allow service role key authentication (for pg_cron with anon key, upgrade to service role check)
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (serviceRoleKey && authHeader === `Bearer ${serviceRoleKey}`) {
    return true;
  }
  
  // Fallback: Check if request comes from internal Supabase infrastructure
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
  if (anonKey && authHeader === `Bearer ${anonKey}`) {
    // Allow anon key but log warning - this is for pg_cron compatibility
    console.warn('Request authenticated with anon key - consider using CRON_SECRET for better security');
    return true;
  }
  
  return false;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Validate authentication - this function should only be called by cron jobs
  if (!validateCronSecret(req)) {
    console.error('Unauthorized request to publish-scheduled-songs - missing or invalid authentication');
    return new Response(
      JSON.stringify({ error: 'Unauthorized - valid authentication required' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get all scheduled songs that are ready to be published
    const now = new Date().toISOString();
    const { data: scheduledSongs, error: fetchError } = await supabase
      .from('songs')
      .select('*, artist_profiles!inner(id, stage_name, user_id)')
      .eq('is_scheduled', true)
      .eq('is_published', false)
      .lte('scheduled_release_at', now);

    if (fetchError) {
      console.error('Error fetching scheduled songs:', fetchError);
      throw fetchError;
    }

    if (!scheduledSongs || scheduledSongs.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No songs to publish', count: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const publishedSongs = [];
    
    for (const song of scheduledSongs) {
      try {
        // Publish the song
        const { error: updateError } = await supabase
          .from('songs')
          .update({
            is_published: true,
            is_scheduled: false,
            is_draft: false,
            published_at: new Date().toISOString(),
          })
          .eq('id', song.id);

        if (updateError) {
          console.error(`Error publishing song ${song.id}:`, updateError);
          continue;
        }

        // Auto-post to artist's community
        const { error: postError } = await supabase
          .from('community_posts')
          .insert({
            artist_id: song.artist_id,
            content: `🎵 New Release Alert! "${song.title}" is now available! ${song.description || 'Check it out now!'}`,
            media_type: 'image',
            media_url: song.cover_image_url,
          });

        if (postError) {
          console.error(`Error creating community post for song ${song.id}:`, postError);
        }

        // Get all followers of this artist
        const { data: followers, error: followersError } = await supabase
          .from('user_follows')
          .select('user_id')
          .eq('artist_id', song.artist_id);

        if (followersError) {
          console.error(`Error fetching followers for artist ${song.artist_id}:`, followersError);
        } else if (followers && followers.length > 0) {
          // Notify all followers
          const notifications = followers.map(follower => ({
            user_id: follower.user_id,
            type: 'new_release',
            title: 'New Song Release',
            message: `${song.artist_profiles?.stage_name || 'An artist you follow'} just released "${song.title}"!`,
            link: `/artist/${song.artist_id}`,
            metadata: {
              song_id: song.id,
              artist_id: song.artist_id,
            },
          }));

          const { error: notifyError } = await supabase
            .from('notifications')
            .insert(notifications);

          if (notifyError) {
            console.error(`Error creating notifications for song ${song.id}:`, notifyError);
          }
        }

        publishedSongs.push(song.id);
        console.log(`Successfully published and promoted song: ${song.title}`);
      } catch (error) {
        console.error(`Error processing song ${song.id}:`, error);
      }
    }

    return new Response(
      JSON.stringify({
        message: 'Songs published successfully',
        count: publishedSongs.length,
        published: publishedSongs,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in publish-scheduled-songs function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
