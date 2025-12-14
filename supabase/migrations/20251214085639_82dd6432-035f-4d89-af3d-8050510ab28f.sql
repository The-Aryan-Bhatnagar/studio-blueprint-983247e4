-- Fix storage policies for song-audio bucket to include folder-based ownership checks
-- Drop existing policies first
DROP POLICY IF EXISTS "Artists can upload their own audio files" ON storage.objects;
DROP POLICY IF EXISTS "Artists can update their own audio files" ON storage.objects;
DROP POLICY IF EXISTS "Artists can delete their own audio files" ON storage.objects;

-- Create new policies with proper ownership verification
CREATE POLICY "Artists can upload their own audio files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'song-audio'
  AND auth.uid() IN (SELECT user_id FROM public.artist_profiles)
  AND (storage.foldername(name))[1] IN (
    SELECT id::text FROM public.artist_profiles WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Artists can update their own audio files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'song-audio'
  AND auth.uid() IN (SELECT user_id FROM public.artist_profiles)
  AND (storage.foldername(name))[1] IN (
    SELECT id::text FROM public.artist_profiles WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Artists can delete their own audio files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'song-audio'
  AND auth.uid() IN (SELECT user_id FROM public.artist_profiles)
  AND (storage.foldername(name))[1] IN (
    SELECT id::text FROM public.artist_profiles WHERE user_id = auth.uid()
  )
);

-- Fix song-covers bucket policies
DROP POLICY IF EXISTS "Artists can upload their own song covers" ON storage.objects;
DROP POLICY IF EXISTS "Artists can update their own song covers" ON storage.objects;
DROP POLICY IF EXISTS "Artists can delete their own song covers" ON storage.objects;

CREATE POLICY "Artists can upload their own song covers"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'song-covers'
  AND auth.uid() IN (SELECT user_id FROM public.artist_profiles)
  AND (storage.foldername(name))[1] IN (
    SELECT id::text FROM public.artist_profiles WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Artists can update their own song covers"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'song-covers'
  AND auth.uid() IN (SELECT user_id FROM public.artist_profiles)
  AND (storage.foldername(name))[1] IN (
    SELECT id::text FROM public.artist_profiles WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Artists can delete their own song covers"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'song-covers'
  AND auth.uid() IN (SELECT user_id FROM public.artist_profiles)
  AND (storage.foldername(name))[1] IN (
    SELECT id::text FROM public.artist_profiles WHERE user_id = auth.uid()
  )
);

-- Update notification trigger functions to sanitize input and limit text lengths
CREATE OR REPLACE FUNCTION public.notify_artist_new_follower()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  artist_user_id UUID;
  follower_name TEXT;
  safe_follower_name TEXT;
BEGIN
  -- Get artist's user_id
  SELECT user_id INTO artist_user_id
  FROM public.artist_profiles
  WHERE id = NEW.artist_id;
  
  -- Get follower's name with length limit and sanitization
  SELECT COALESCE(LEFT(REGEXP_REPLACE(full_name, '[<>"''&]', '', 'g'), 100), 'Someone') INTO follower_name
  FROM public.profiles
  WHERE user_id = NEW.user_id;
  
  safe_follower_name := COALESCE(follower_name, 'Someone');
  
  -- Create notification with sanitized data
  INSERT INTO public.notifications (user_id, type, title, message, link, metadata)
  VALUES (
    artist_user_id,
    'follow',
    'New Follower',
    safe_follower_name || ' started following you',
    '/artist/' || NEW.artist_id,
    jsonb_build_object('follower_id', NEW.user_id, 'artist_id', NEW.artist_id)
  );
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.notify_artist_new_comment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  artist_user_id UUID;
  commenter_name TEXT;
  song_title TEXT;
  safe_commenter_name TEXT;
  safe_song_title TEXT;
BEGIN
  -- Get artist's user_id and song title with sanitization
  SELECT ap.user_id, LEFT(REGEXP_REPLACE(s.title, '[<>"''&]', '', 'g'), 200) INTO artist_user_id, song_title
  FROM public.songs s
  JOIN public.artist_profiles ap ON s.artist_id = ap.id
  WHERE s.id = NEW.song_id;
  
  -- Get commenter's name with sanitization
  SELECT COALESCE(LEFT(REGEXP_REPLACE(full_name, '[<>"''&]', '', 'g'), 100), 'Someone') INTO commenter_name
  FROM public.profiles
  WHERE user_id = NEW.user_id;
  
  safe_commenter_name := COALESCE(commenter_name, 'Someone');
  safe_song_title := COALESCE(song_title, 'a song');
  
  -- Only notify if commenter is not the artist
  IF artist_user_id IS NOT NULL AND artist_user_id != NEW.user_id THEN
    -- Create notification with sanitized data
    INSERT INTO public.notifications (user_id, type, title, message, link, metadata)
    VALUES (
      artist_user_id,
      'comment',
      'New Comment',
      safe_commenter_name || ' commented on "' || safe_song_title || '"',
      '/artist-dashboard',
      jsonb_build_object('commenter_id', NEW.user_id, 'song_id', NEW.song_id, 'comment_id', NEW.id)
    );
  END IF;
  
  RETURN NEW;
END;
$function$;