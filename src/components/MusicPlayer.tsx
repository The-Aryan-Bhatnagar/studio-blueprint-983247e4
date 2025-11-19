import { Play, Pause, SkipBack, SkipForward, Volume2, Heart, Shuffle, Repeat } from "lucide-react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { usePlayer } from "@/contexts/PlayerContext";
import { useToast } from "@/hooks/use-toast";
import { useSongLikes } from "@/hooks/useSongLikes";
import { useAuth } from "@/contexts/AuthContext";

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const MusicPlayer = () => {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isRepeat,
    isShuffle,
    togglePlay,
    seekTo,
    setVolume,
    toggleMute,
    toggleRepeat,
    toggleShuffle,
    playNext,
    playPrevious,
  } = usePlayer();
  const { toast } = useToast();
  const { user } = useAuth();
  const { isLiked, toggleLike, isLoading } = useSongLikes(currentSong?.id?.toString());

  const handleLike = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to like songs",
        variant: "destructive",
      });
      return;
    }

    toggleLike();
    toast({
      title: isLiked ? "Removed from Liked Songs" : "Added to Liked Songs",
      description: `${currentSong?.title} has been ${isLiked ? "removed from" : "added to"} your library`,
    });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border backdrop-blur-lg bg-opacity-95 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-6">
          {/* Song Info */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {currentSong ? (
              <>
                <img
                  src={currentSong.image}
                  alt={currentSong.title}
                  className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="font-semibold text-foreground truncate">
                    {currentSong.title}
                  </h4>
                  <p className="text-sm text-muted-foreground truncate">
                    {currentSong.artist}
                  </p>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="flex-shrink-0 hover:text-primary"
                  onClick={handleLike}
                  disabled={isLoading}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? "fill-primary text-primary" : ""}`} />
                </Button>
              </>
            ) : (
              <>
                <div className="w-14 h-14 rounded-lg bg-gradient-primary flex-shrink-0" />
                <div className="min-w-0">
                  <h4 className="font-semibold text-foreground truncate">
                    Select a song to play
                  </h4>
                  <p className="text-sm text-muted-foreground truncate">
                    Browse the music library
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Player Controls */}
          <div className="flex-1 max-w-2xl">
            <div className="flex items-center justify-center gap-4 mb-2">
              <Button 
                size="icon" 
                variant="ghost" 
                disabled={!currentSong}
                onClick={toggleShuffle}
                className={isShuffle ? "text-primary bg-primary/20 border border-primary/30" : ""}
              >
                <Shuffle className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={playPrevious}
                disabled={!currentSong}
              >
                <SkipBack className="w-5 h-5" />
              </Button>
              <Button
                size="icon"
                className="h-10 w-10 bg-primary hover:bg-primary/90"
                onClick={togglePlay}
                disabled={!currentSong}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 fill-current" />
                ) : (
                  <Play className="w-5 h-5 fill-current" />
                )}
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={playNext}
                disabled={!currentSong}
              >
                <SkipForward className="w-5 h-5" />
              </Button>
              <Button 
                size="icon" 
                variant="ghost" 
                disabled={!currentSong}
                onClick={toggleRepeat}
                className={isRepeat ? "text-primary bg-primary/20 border border-primary/30" : ""}
              >
                <Repeat className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground w-10 text-right">
                {formatTime(currentTime)}
              </span>
              <Slider
                value={[currentTime]}
                onValueChange={([value]) => seekTo(value)}
                max={duration || 100}
                step={1}
                className="flex-1"
                disabled={!currentSong}
              />
              <span className="text-xs text-muted-foreground w-10">
                {duration ? formatTime(duration) : "0:00"}
              </span>
            </div>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-3 flex-1 justify-end">
            <Button
              size="icon"
              variant="ghost"
              onClick={toggleMute}
              className="flex-shrink-0"
            >
              <Volume2 className={`w-5 h-5 ${isMuted ? "text-muted-foreground/50" : "text-muted-foreground"}`} />
            </Button>
            <Slider
              value={[isMuted ? 0 : volume]}
              onValueChange={([value]) => setVolume(value)}
              max={100}
              step={1}
              className="w-32"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
