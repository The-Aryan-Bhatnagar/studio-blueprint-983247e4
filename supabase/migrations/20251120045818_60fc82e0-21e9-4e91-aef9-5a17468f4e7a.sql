-- Create event-banners storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('event-banners', 'event-banners', true);

-- RLS policies for event-banners bucket
CREATE POLICY "Anyone can view event banners"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'event-banners');

CREATE POLICY "Artists can upload event banners"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'event-banners' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Artists can update their event banners"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'event-banners' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Artists can delete their event banners"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'event-banners' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );