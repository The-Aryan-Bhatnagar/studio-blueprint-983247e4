-- Create user_follows table for follow functionality
CREATE TABLE public.user_follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  artist_id UUID NOT NULL REFERENCES public.artist_profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, artist_id)
);

-- Enable RLS
ALTER TABLE public.user_follows ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view follows"
  ON public.user_follows
  FOR SELECT
  USING (true);

CREATE POLICY "Users can follow artists"
  ON public.user_follows
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unfollow artists"
  ON public.user_follows
  FOR DELETE
  USING (auth.uid() = user_id);

-- Function to update follower count
CREATE OR REPLACE FUNCTION public.update_artist_followers_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.artist_profiles
    SET total_followers = total_followers + 1
    WHERE id = NEW.artist_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.artist_profiles
    SET total_followers = total_followers - 1
    WHERE id = OLD.artist_id;
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to automatically update follower count
CREATE TRIGGER on_artist_follow_change
  AFTER INSERT OR DELETE ON public.user_follows
  FOR EACH ROW
  EXECUTE FUNCTION public.update_artist_followers_count();