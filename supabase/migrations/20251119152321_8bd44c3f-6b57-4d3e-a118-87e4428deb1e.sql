-- Create storage buckets for songs
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('song-audio', 'song-audio', true),
  ('song-covers', 'song-covers', true);

-- Create policies for song audio uploads
CREATE POLICY "Artists can upload their own audio files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'song-audio' 
  AND auth.uid() IN (
    SELECT user_id FROM public.artist_profiles
  )
);

CREATE POLICY "Anyone can view audio files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'song-audio');

CREATE POLICY "Artists can update their own audio files" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'song-audio' 
  AND auth.uid() IN (
    SELECT user_id FROM public.artist_profiles
  )
);

CREATE POLICY "Artists can delete their own audio files" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'song-audio' 
  AND auth.uid() IN (
    SELECT user_id FROM public.artist_profiles
  )
);

-- Create policies for song cover images
CREATE POLICY "Artists can upload their own cover images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'song-covers' 
  AND auth.uid() IN (
    SELECT user_id FROM public.artist_profiles
  )
);

CREATE POLICY "Anyone can view cover images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'song-covers');

CREATE POLICY "Artists can update their own cover images" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'song-covers' 
  AND auth.uid() IN (
    SELECT user_id FROM public.artist_profiles
  )
);

CREATE POLICY "Artists can delete their own cover images" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'song-covers' 
  AND auth.uid() IN (
    SELECT user_id FROM public.artist_profiles
  )
);