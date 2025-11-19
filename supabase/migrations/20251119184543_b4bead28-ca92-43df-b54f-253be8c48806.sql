-- Create user_song_likes table
CREATE TABLE public.user_song_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  song_id UUID NOT NULL REFERENCES public.songs(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, song_id)
);

-- Enable RLS
ALTER TABLE public.user_song_likes ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own likes"
  ON public.user_song_likes
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own likes"
  ON public.user_song_likes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes"
  ON public.user_song_likes
  FOR DELETE
  USING (auth.uid() = user_id);

-- Function to update song analytics likes count
CREATE OR REPLACE FUNCTION public.update_song_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.song_analytics
    SET total_likes = total_likes + 1
    WHERE song_id = NEW.song_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.song_analytics
    SET total_likes = total_likes - 1
    WHERE song_id = OLD.song_id;
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to automatically update likes count
CREATE TRIGGER on_song_like_change
  AFTER INSERT OR DELETE ON public.user_song_likes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_song_likes_count();