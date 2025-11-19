import SongCard from "@/components/SongCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePlayer } from "@/contexts/PlayerContext";
import { useToast } from "@/hooks/use-toast";
import { useLikedSongs } from "@/hooks/useSongLikes";
import { useAuth } from "@/contexts/AuthContext";

const Library = () => {
  const { playSong, setQueue } = usePlayer();
  const { toast } = useToast();
  const { user } = useAuth();
  const { data: likedSongsData = [], isLoading } = useLikedSongs();

  const recentlyPlayed: any[] = []; // Will be implemented in next phase

  const handlePlaySong = (song: any) => {
    // Map database songs to player format
    const mappedQueue = likedSongsData.map((s: any) => ({
      id: s.id,
      title: s.title,
      artist: s.artist_profiles?.stage_name || "Unknown Artist",
      image: s.cover_image_url || "https://via.placeholder.com/300",
      audioUrl: s.audio_url,
      duration: s.duration || 0,
      plays: s.song_analytics?.total_plays || 0,
    }));
    
    setQueue(mappedQueue);
    
    const mappedSong = {
      id: song.id,
      title: song.title,
      artist: song.artist_profiles?.stage_name || "Unknown Artist",
      image: song.cover_image_url || "https://via.placeholder.com/300",
      audioUrl: song.audio_url,
      duration: song.duration || 0,
      plays: song.song_analytics?.total_plays || 0,
    };
    
    playSong(mappedSong);
    toast({
      title: "Now Playing",
      description: `${song.title} by ${song.artist_profiles?.stage_name || "Unknown Artist"}`,
    });
  };

  return (
    <div className="min-h-screen pb-32">
      <h1 className="text-4xl font-bold mb-8">Your Library</h1>

      <Tabs defaultValue="liked" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="playlists">Playlists</TabsTrigger>
          <TabsTrigger value="recent">Recently Played</TabsTrigger>
          <TabsTrigger value="liked">Liked Songs</TabsTrigger>
        </TabsList>

        <TabsContent value="playlists">
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg mb-2">No playlists yet</p>
            <p className="text-sm">Create your first playlist to organize your music</p>
          </div>
        </TabsContent>

        <TabsContent value="recent">
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg mb-2">No recently played songs</p>
            <p className="text-sm">Songs you play will appear here</p>
          </div>
        </TabsContent>

        <TabsContent value="liked">
          {!user ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg mb-2">Login to see your liked songs</p>
              <p className="text-sm">Like songs to save them to your library</p>
            </div>
          ) : isLoading ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg">Loading your liked songs...</p>
            </div>
          ) : likedSongsData.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg mb-2">No liked songs yet</p>
              <p className="text-sm">Like songs by clicking the heart icon while playing</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {likedSongsData.map((song: any) => (
                <SongCard 
                  key={song.id} 
                  song={{
                    ...song,
                    artist: song.artist_profiles?.stage_name || "Unknown Artist",
                    image: song.cover_image_url || "https://via.placeholder.com/300"
                  }} 
                  onPlay={handlePlaySong} 
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Library;
