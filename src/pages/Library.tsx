import SongCard from "@/components/SongCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { sampleSongs } from "@/lib/sampleSongs";
import { usePlayer } from "@/contexts/PlayerContext";
import { useToast } from "@/hooks/use-toast";

const Library = () => {
  const { playSong, setQueue } = usePlayer();
  const { toast } = useToast();

  const recentlyPlayed = sampleSongs.slice(0, 4);
  const likedSongs = sampleSongs.slice(4, 8);

  const handlePlaySong = (song: typeof sampleSongs[0]) => {
    setQueue(sampleSongs);
    playSong(song);
    toast({
      title: "Now Playing",
      description: `${song.title} by ${song.artist}`,
    });
  };

  return (
    <div className="min-h-screen pb-32">
      <h1 className="text-4xl font-bold mb-8">Your Library</h1>

      <Tabs defaultValue="playlists" className="w-full">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentlyPlayed.map((song) => (
              <SongCard key={song.id} song={song} onPlay={handlePlaySong} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="liked">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {likedSongs.map((song) => (
              <SongCard key={song.id} song={song} onPlay={handlePlaySong} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Library;
