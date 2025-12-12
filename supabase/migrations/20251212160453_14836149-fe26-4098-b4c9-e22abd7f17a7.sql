-- Make storage buckets public for profile images, song covers, and event banners
UPDATE storage.buckets SET public = true WHERE id = 'avatars';
UPDATE storage.buckets SET public = true WHERE id = 'song-covers';
UPDATE storage.buckets SET public = true WHERE id = 'event-banners';
UPDATE storage.buckets SET public = true WHERE id = 'community-media';

-- Drop existing policies if they exist and recreate
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Song covers are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Event banners are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Community media is publicly accessible" ON storage.objects;

-- Avatars bucket - public read access
CREATE POLICY "Avatar images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- Song covers bucket - public read access  
CREATE POLICY "Song covers are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'song-covers');

-- Event banners bucket - public read access
CREATE POLICY "Event banners are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'event-banners');

-- Community media bucket - public read access
CREATE POLICY "Community media is publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'community-media');