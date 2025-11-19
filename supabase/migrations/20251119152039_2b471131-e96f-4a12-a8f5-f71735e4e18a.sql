-- Create trigger to automatically create analytics when a song is created
CREATE TRIGGER create_song_analytics_trigger
AFTER INSERT ON public.songs
FOR EACH ROW
EXECUTE FUNCTION public.create_song_analytics();