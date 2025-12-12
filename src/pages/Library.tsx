import SongCard from "@/components/SongCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePlayer } from "@/contexts/PlayerContext";
import { useToast } from "@/hooks/use-toast";
import { useLikedSongs } from "@/hooks/useSongLikes";
import { useAuth } from "@/contexts/AuthContext";
import { CreatePlaylistDialog } from "@/components/CreatePlaylistDialog";
import { usePlaylists } from "@/hooks/usePlaylists";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Library = () => {
  const navigate = useNavigate();
  const { playSong, setQueue } = usePlayer();
  const { toast } = useToast();
  const { user } = useAuth();
  const { data: likedSongsData = [], isLoading } = useLikedSongs();
  const { playlists, deletePlaylist } = usePlaylists();

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
    <div className="min-h-screen pb-36 md:pb-32">
      <h1 className="text-xl md:text-4xl font-bold mb-4 md:mb-8">Your Library</h1>

      <Tabs defaultValue="playlists" className="w-full">
        <TabsList className="mb-4 md:mb-8 h-9 md:h-10">
          <TabsTrigger value="playlists" className="text-xs md:text-sm px-2 md:px-3">Playlists</TabsTrigger>
          <TabsTrigger value="recent" className="text-xs md:text-sm px-2 md:px-3">Recently Played</TabsTrigger>
          <TabsTrigger value="liked" className="text-xs md:text-sm px-2 md:px-3">Liked Songs</TabsTrigger>
        </TabsList>

        <TabsContent value="playlists">
          {!user ? (
            <div className="text-center py-8 md:py-12 text-muted-foreground">
              <p className="text-sm md:text-lg mb-2">Login to see your playlists</p>
            </div>
          ) : (
            <div className="space-y-4 md:space-y-6">
              <div className="flex justify-between items-center gap-2">
                <h2 className="text-lg md:text-2xl font-semibold">Your Playlists</h2>
                <CreatePlaylistDialog />
              </div>

              {playlists.length === 0 ? (
                <div className="text-center py-8 md:py-12 text-muted-foreground">
                  <Music className="h-10 w-10 md:h-12 md:w-12 mx-auto mb-3 md:mb-4 opacity-50" />
                  <p className="text-sm md:text-lg mb-2">No playlists yet</p>
                  <p className="text-xs md:text-sm mb-4">Create your first playlist to organize your music</p>
                  <CreatePlaylistDialog />
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                  {playlists.map((playlist) => (
                    <Card 
                      key={playlist.id} 
                      className="cursor-pointer hover:bg-accent transition-colors"
                      onClick={() => navigate(`/playlist/${playlist.id}`)}
                    >
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span className="truncate">{playlist.name}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              deletePlaylist.mutate(playlist.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {playlist.description && (
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                            {playlist.description}
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground">
                          {playlist.is_public ? "Public" : "Private"}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="recent">
          <div className="text-center py-8 md:py-12 text-muted-foreground">
            <p className="text-sm md:text-lg mb-2">No recently played songs</p>
            <p className="text-xs md:text-sm">Songs you play will appear here</p>
          </div>
        </TabsContent>

        <TabsContent value="liked">
          {!user ? (
            <div className="text-center py-8 md:py-12 text-muted-foreground">
              <p className="text-sm md:text-lg mb-2">Login to see your liked songs</p>
              <p className="text-xs md:text-sm">Like songs to save them to your library</p>
            </div>
          ) : isLoading ? (
            <div className="text-center py-8 md:py-12 text-muted-foreground">
              <p className="text-sm md:text-lg">Loading your liked songs...</p>
            </div>
          ) : likedSongsData.length === 0 ? (
            <div className="text-center py-8 md:py-12 text-muted-foreground">
              <p className="text-sm md:text-lg mb-2">No liked songs yet</p>
              <p className="text-xs md:text-sm">Like songs by clicking the heart icon while playing</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-6">
              {likedSongsData.map((song: any, idx: number) => (
                <SongCard 
                  key={song.id} 
                  song={{
                    ...song,
                    artist: song.artist_profiles?.stage_name || "Unknown Artist",
                    image: song.cover_image_url || "https://via.placeholder.com/300"
                  }} 
                  onPlay={handlePlaySong}
                  index={idx + 1}
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
