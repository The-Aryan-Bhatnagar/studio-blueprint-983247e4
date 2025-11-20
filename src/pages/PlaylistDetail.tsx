import { useParams, useNavigate } from "react-router-dom";
import { usePlaylistSongs } from "@/hooks/usePlaylists";
import { usePlayer } from "@/contexts/PlayerContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Play, Trash2, Music } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { usePlaylists } from "@/hooks/usePlaylists";

const PlaylistDetail = () => {
  const { playlistId } = useParams<{ playlistId: string }>();
  const navigate = useNavigate();
  const { playSong, setQueue } = usePlayer();
  const { data: playlistData, isLoading } = usePlaylistSongs(playlistId);
  const { removeSongFromPlaylist } = usePlaylists();

  const handlePlaySong = (song: any) => {
    const songForPlayer = {
      id: song.id,
      title: song.title,
      artist: song.artist_profiles?.stage_name || "Unknown Artist",
      image: song.cover_image_url || "/placeholder.svg",
      audioUrl: song.audio_url,
      plays: song.song_analytics?.total_plays || 0,
      likes: song.song_analytics?.total_likes || 0,
    };

    // Set queue to all songs in playlist
    const queue = playlistData?.songs?.map((s: any) => ({
      id: s.id,
      title: s.title,
      artist: s.artist_profiles?.stage_name || "Unknown Artist",
      image: s.cover_image_url || "/placeholder.svg",
      audioUrl: s.audio_url,
      plays: s.song_analytics?.total_plays || 0,
      likes: s.song_analytics?.total_likes || 0,
    })) || [];

    setQueue(queue);
    playSong(songForPlayer);
    toast({
      title: "Now Playing",
      description: `${song.title} by ${song.artist_profiles?.stage_name || "Unknown Artist"}`,
    });
  };

  const handleRemoveSong = async (songId: string) => {
    if (!playlistId) return;
    try {
      await removeSongFromPlaylist.mutateAsync({ playlistId, songId });
    } catch (error) {
      console.error("Error removing song:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-lg">Loading playlist...</div>
      </div>
    );
  }

  if (!playlistData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Playlist not found</h2>
          <p className="text-muted-foreground mb-4">This playlist doesn't exist or you don't have access to it.</p>
          <Button onClick={() => navigate("/library")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Library
          </Button>
        </div>
      </div>
    );
  }

  const playlist = playlistData.playlist;
  const songs = playlistData.songs || [];

  return (
    <div className="min-h-screen pb-32">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/library")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Library
        </Button>

        <div className="flex items-start gap-6">
          {/* Playlist Cover */}
          <div className="w-48 h-48 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
            {playlist.cover_image_url ? (
              <img
                src={playlist.cover_image_url}
                alt={playlist.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <Music className="w-20 h-20 text-foreground/60" />
            )}
          </div>

          {/* Playlist Info */}
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-2">PLAYLIST</p>
            <h1 className="text-5xl font-bold mb-4">{playlist.name}</h1>
            {playlist.description && (
              <p className="text-muted-foreground mb-4">{playlist.description}</p>
            )}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{songs.length} songs</span>
              {playlist.is_public && (
                <>
                  <span>•</span>
                  <span>Public</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Songs List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Songs</h2>
        
        {songs.length === 0 ? (
          <Card className="p-8 text-center">
            <Music className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-2">No songs in this playlist yet</p>
            <p className="text-sm text-muted-foreground">
              Add songs by clicking "Add to Playlist" on any song
            </p>
          </Card>
        ) : (
          <div className="space-y-2">
            {songs.map((song: any, index: number) => (
              <Card
                key={song.id}
                className="p-4 hover:bg-muted/50 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <span className="text-muted-foreground w-8 text-center">
                    {index + 1}
                  </span>

                  <div className="relative cursor-pointer" onClick={() => handlePlaySong(song)}>
                    <img
                      src={song.cover_image_url || "/placeholder.svg"}
                      alt={song.title}
                      className="w-14 h-14 rounded object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded">
                      <Play className="h-6 w-6 text-white" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 cursor-pointer" onClick={() => handlePlaySong(song)}>
                    <h3 className="font-semibold truncate">{song.title}</h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {song.artist_profiles?.stage_name || "Unknown Artist"}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveSong(song.id)}
                      disabled={removeSongFromPlaylist.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistDetail;
