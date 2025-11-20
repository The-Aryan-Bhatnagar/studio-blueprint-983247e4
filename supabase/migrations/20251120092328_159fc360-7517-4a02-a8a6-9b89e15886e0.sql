-- Make storage buckets private for better access control
UPDATE storage.buckets 
SET public = false 
WHERE name IN ('song-audio', 'song-covers', 'avatars', 'community-media', 'event-banners');