import SongCard from "@/components/SongCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePlayer } from "@/contexts/PlayerContext";
import { useToast } from "@/hooks/use-toast";
import { useLikedSongs } from "@/hooks/useSongLikes";
import { useAuth } from "@/contexts/AuthContext";
import { CreatePlaylistDialog } from "@/components/CreatePlaylistDialog";
import { usePlaylists, usePlaylistSongs } from "@/hooks/usePlaylists";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music, Trash2 } from "lucide-react";
import { useState } from "react";

const Library = () => {
  const { playSong, setQueue } = usePlayer();
  const { toast } = useToast();
  const { user } = useAuth();
  const { data: likedSongsData = [], isLoading } = useLikedSongs();
  const { playlists, deletePlaylist, removeSongFromPlaylist } = usePlaylists();
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);
  const { data: playlistSongs = [] } = usePlaylistSongs(selectedPlaylist || "");

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

      <Tabs defaultValue="playlists" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="playlists">Playlists</TabsTrigger>
          <TabsTrigger value="recent">Recently Played</TabsTrigger>
          <TabsTrigger value="liked">Liked Songs</TabsTrigger>
        </TabsList>

        <TabsContent value="playlists">
          {!user ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg mb-2">Login to see your playlists</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Your Playlists</h2>
                <CreatePlaylistDialog />
              </div>

              {playlists.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Music className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">No playlists yet</p>
                  <p className="text-sm mb-4">Create your first playlist to organize your music</p>
                  <CreatePlaylistDialog />
                </div>
              ) : !selectedPlaylist ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {playlists.map((playlist) => (
                    <Card 
                      key={playlist.id} 
                      className="cursor-pointer hover:bg-accent transition-colors"
                      onClick={() => setSelectedPlaylist(playlist.id)}
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
                          <p className="text-sm text-muted-foreground mb-2">
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
              ) : (
                <div>
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedPlaylist(null)}
                    className="mb-4"
                  >
                    ← Back to Playlists
                  </Button>
                  <h3 className="text-xl font-semibold mb-4">
                    {playlists.find((p) => p.id === selectedPlaylist)?.name}
                  </h3>
                  {playlistSongs.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <p>No songs in this playlist yet</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {playlistSongs.map((item: any) => (
                        <div key={item.id} className="relative">
                          <SongCard
                            song={{
                              ...item.songs,
                              artist: item.songs.artist_profiles?.stage_name || "Unknown Artist",
                              image: item.songs.cover_image_url || "https://via.placeholder.com/300"
                            }}
                            onPlay={handlePlaySong}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() =>
                              removeSongFromPlaylist.mutate({
                                playlistId: selectedPlaylist,
                                songId: item.songs.id,
                              })
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
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
