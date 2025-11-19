-- Create song_comments table
CREATE TABLE public.song_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  song_id UUID NOT NULL REFERENCES public.songs(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on song_comments
ALTER TABLE public.song_comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for song_comments
CREATE POLICY "Anyone can view comments on published songs"
  ON public.song_comments
  FOR SELECT
  USING (song_id IN (
    SELECT id FROM public.songs WHERE is_published = true
  ));

CREATE POLICY "Authenticated users can insert comments"
  ON public.song_comments
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
  ON public.song_comments
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON public.song_comments
  FOR DELETE
  USING (auth.uid() = user_id);

-- Function to update comment count
CREATE OR REPLACE FUNCTION public.update_song_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.song_analytics
    SET total_comments = total_comments + 1
    WHERE song_id = NEW.song_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.song_analytics
    SET total_comments = total_comments - 1
    WHERE song_id = OLD.song_id;
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to automatically update comments count
CREATE TRIGGER on_song_comment_change
  AFTER INSERT OR DELETE ON public.song_comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_song_comments_count();

-- Create avatars storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true);

-- Storage policies for avatars
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own avatar"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own avatar"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );