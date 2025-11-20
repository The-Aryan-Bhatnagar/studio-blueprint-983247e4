-- Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create a function to call the edge function
CREATE OR REPLACE FUNCTION public.trigger_scheduled_song_publish()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result text;
BEGIN
  -- Call the edge function using pg_net
  SELECT content::text INTO result
  FROM http((
    'POST',
    current_setting('app.settings.supabase_url') || '/functions/v1/publish-scheduled-songs',
    ARRAY[http_header('Authorization', 'Bearer ' || current_setting('app.settings.service_role_key'))],
    'application/json',
    '{}'
  )::http_request);
  
  RAISE NOTICE 'Published scheduled songs: %', result;
END;
$$;

-- Schedule the function to run every 5 minutes
SELECT cron.schedule(
  'publish-scheduled-songs',
  '*/5 * * * *', -- Every 5 minutes
  $$SELECT public.trigger_scheduled_song_publish()$$
);