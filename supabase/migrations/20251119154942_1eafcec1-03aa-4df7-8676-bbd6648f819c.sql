-- Remove duplicate trigger that causes double inserts into song_analytics
DROP TRIGGER IF EXISTS create_song_analytics_trigger ON public.songs;