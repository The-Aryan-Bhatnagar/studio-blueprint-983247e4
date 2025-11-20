-- Create play_history table to track detailed analytics
CREATE TABLE IF NOT EXISTS public.play_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  song_id UUID NOT NULL REFERENCES public.songs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  played_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  device_type TEXT, -- 'Android', 'iOS', 'Web', 'Desktop'
  country TEXT,
  city TEXT,
  traffic_source TEXT, -- 'search', 'playlist', 'artist_profile', 'direct'
  user_age_group TEXT, -- '18-24', '25-34', '35-44', '45+'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.play_history ENABLE ROW LEVEL SECURITY;

-- Artists can view play history for their songs
CREATE POLICY "Artists can view their songs play history"
ON public.play_history
FOR SELECT
USING (
  song_id IN (
    SELECT s.id FROM public.songs s
    JOIN public.artist_profiles ap ON s.artist_id = ap.id
    WHERE ap.user_id = auth.uid()
  )
);

-- Anyone can insert play history (logged by edge function)
CREATE POLICY "Allow inserting play history"
ON public.play_history
FOR INSERT
WITH CHECK (true);

-- Add indexes for better query performance
CREATE INDEX idx_play_history_song_id ON public.play_history(song_id);
CREATE INDEX idx_play_history_played_at ON public.play_history(played_at);
CREATE INDEX idx_play_history_song_played_at ON public.play_history(song_id, played_at);

-- Function to get play counts by date range
CREATE OR REPLACE FUNCTION get_play_stats_by_date_range(
  p_song_id UUID,
  p_start_date TIMESTAMP WITH TIME ZONE,
  p_end_date TIMESTAMP WITH TIME ZONE
)
RETURNS TABLE (
  total_plays BIGINT,
  unique_listeners BIGINT
) 
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    COUNT(*) as total_plays,
    COUNT(DISTINCT user_id) as unique_listeners
  FROM public.play_history
  WHERE song_id = p_song_id
    AND played_at >= p_start_date
    AND played_at <= p_end_date;
$$;