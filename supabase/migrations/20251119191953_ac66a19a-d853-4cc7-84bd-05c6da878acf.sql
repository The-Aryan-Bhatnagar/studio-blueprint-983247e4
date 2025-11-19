-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  type TEXT NOT NULL, -- 'follow', 'comment', 'like', 'new_song'
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS policies for notifications
CREATE POLICY "Users can view their own notifications"
  ON public.notifications
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON public.notifications
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications"
  ON public.notifications
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create playlists table
CREATE TABLE public.playlists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.playlists ENABLE ROW LEVEL SECURITY;

-- RLS policies for playlists
CREATE POLICY "Users can view their own playlists"
  ON public.playlists
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view public playlists"
  ON public.playlists
  FOR SELECT
  USING (is_public = true);

CREATE POLICY "Users can insert their own playlists"
  ON public.playlists
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own playlists"
  ON public.playlists
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own playlists"
  ON public.playlists
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create playlist_songs junction table
CREATE TABLE public.playlist_songs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  playlist_id UUID NOT NULL REFERENCES public.playlists(id) ON DELETE CASCADE,
  song_id UUID NOT NULL REFERENCES public.songs(id) ON DELETE CASCADE,
  position INTEGER NOT NULL DEFAULT 0,
  added_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(playlist_id, song_id)
);

-- Enable RLS
ALTER TABLE public.playlist_songs ENABLE ROW LEVEL SECURITY;

-- RLS policies for playlist_songs
CREATE POLICY "Users can view songs in their playlists"
  ON public.playlist_songs
  FOR SELECT
  USING (
    playlist_id IN (
      SELECT id FROM public.playlists WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can view songs in public playlists"
  ON public.playlist_songs
  FOR SELECT
  USING (
    playlist_id IN (
      SELECT id FROM public.playlists WHERE is_public = true
    )
  );

CREATE POLICY "Users can add songs to their playlists"
  ON public.playlist_songs
  FOR INSERT
  WITH CHECK (
    playlist_id IN (
      SELECT id FROM public.playlists WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can remove songs from their playlists"
  ON public.playlist_songs
  FOR DELETE
  USING (
    playlist_id IN (
      SELECT id FROM public.playlists WHERE user_id = auth.uid()
    )
  );

-- Add trigger for updated_at on playlists
CREATE TRIGGER update_playlists_updated_at
  BEFORE UPDATE ON public.playlists
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX idx_playlists_user_id ON public.playlists(user_id);
CREATE INDEX idx_playlist_songs_playlist_id ON public.playlist_songs(playlist_id);
CREATE INDEX idx_playlist_songs_song_id ON public.playlist_songs(song_id);

-- Function to create notification for new follower
CREATE OR REPLACE FUNCTION public.notify_artist_new_follower()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  artist_user_id UUID;
  follower_name TEXT;
BEGIN
  -- Get artist's user_id
  SELECT user_id INTO artist_user_id
  FROM public.artist_profiles
  WHERE id = NEW.artist_id;
  
  -- Get follower's name
  SELECT full_name INTO follower_name
  FROM public.profiles
  WHERE user_id = NEW.user_id;
  
  -- Create notification
  INSERT INTO public.notifications (user_id, type, title, message, link, metadata)
  VALUES (
    artist_user_id,
    'follow',
    'New Follower',
    follower_name || ' started following you',
    '/artist/' || NEW.artist_id,
    jsonb_build_object('follower_id', NEW.user_id, 'artist_id', NEW.artist_id)
  );
  
  RETURN NEW;
END;
$$;

-- Trigger for new follower notification
CREATE TRIGGER on_new_follower
  AFTER INSERT ON public.user_follows
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_artist_new_follower();

-- Function to create notification for new comment
CREATE OR REPLACE FUNCTION public.notify_artist_new_comment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  artist_user_id UUID;
  commenter_name TEXT;
  song_title TEXT;
BEGIN
  -- Get artist's user_id and song title
  SELECT ap.user_id, s.title INTO artist_user_id, song_title
  FROM public.songs s
  JOIN public.artist_profiles ap ON s.artist_id = ap.id
  WHERE s.id = NEW.song_id;
  
  -- Get commenter's name
  SELECT full_name INTO commenter_name
  FROM public.profiles
  WHERE user_id = NEW.user_id;
  
  -- Only notify if commenter is not the artist
  IF artist_user_id != NEW.user_id THEN
    -- Create notification
    INSERT INTO public.notifications (user_id, type, title, message, link, metadata)
    VALUES (
      artist_user_id,
      'comment',
      'New Comment',
      commenter_name || ' commented on "' || song_title || '"',
      '/artist-dashboard',
      jsonb_build_object('commenter_id', NEW.user_id, 'song_id', NEW.song_id, 'comment_id', NEW.id)
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger for new comment notification
CREATE TRIGGER on_new_comment
  AFTER INSERT ON public.song_comments
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_artist_new_comment();