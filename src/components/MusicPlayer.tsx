import { useNavigate, useLocation } from "react-router-dom";
import { Play, Pause, SkipBack, SkipForward, Volume2, Heart, Shuffle, Repeat, MessageSquare, Maximize2, VolumeX } from "lucide-react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { usePlayer } from "@/contexts/PlayerContext";
import { useToast } from "@/hooks/use-toast";
import { useSongLikes } from "@/hooks/useSongLikes";
import { useAuth } from "@/contexts/AuthContext";
import CommentsDialog from "./CommentsDialog";
import { useState } from "react";

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const MusicPlayer = () => {
  const navigate = useNavigate();
  const location = useLocation();
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
  const [showComments, setShowComments] = useState(false);

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

  const openFullscreen = () => {
    navigate("/player");
  };

  // Don't show mini player if we're on the fullscreen player page
  if (location.pathname === "/player") {
    return null;
  }

  if (!currentSong) return null;

  // Mini Player Only
  return (
    <>
      <div className="fixed bottom-[60px] md:bottom-0 left-0 right-0 bg-card border-t border-border backdrop-blur-lg bg-opacity-95 z-40">
        <div className="px-2 md:px-4 py-2 md:py-3">
          {/* Mobile Mini Player */}
          <div className="md:hidden flex items-center gap-2">
            <img
              src={currentSong.image}
              alt={currentSong.title}
              className="w-10 h-10 rounded object-cover flex-shrink-0"
              onClick={openFullscreen}
            />
            <div className="min-w-0 flex-1" onClick={openFullscreen}>
              <h4 className="font-medium text-xs text-foreground truncate">
                {currentSong.title}
              </h4>
              <p className="text-[10px] text-muted-foreground truncate">
                {currentSong.artist}
              </p>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={handleLike}
              disabled={isLoading}
            >
              <Heart className={`w-4 h-4 ${isLiked ? "fill-primary text-primary" : ""}`} />
            </Button>
            <Button
              size="icon"
              className="h-9 w-9 rounded-full bg-foreground text-background"
              onClick={togglePlay}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </Button>
          </div>

          {/* Desktop Mini Player */}
          <div className="hidden md:grid grid-cols-[1fr_2fr_1fr] items-center gap-4">
            {/* Left Section - Song Info */}
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={currentSong.image}
                alt={currentSong.title}
                className="w-14 h-14 rounded object-cover flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h4 className="font-medium text-sm text-foreground truncate">
                  {currentSong.title}
                </h4>
                <p className="text-xs text-muted-foreground truncate">
                  {currentSong.artist}
                </p>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="flex-shrink-0 h-8 w-8 hover:text-primary"
                onClick={handleLike}
                disabled={isLoading}
              >
                <Heart className={`w-4 h-4 ${isLiked ? "fill-primary text-primary" : ""}`} />
              </Button>
            </div>

            {/* Center Section - Player Controls */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-center gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={toggleShuffle}
                  className={`h-8 w-8 ${isShuffle ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <Shuffle className="w-3.5 h-3.5" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={playPrevious}
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                >
                  <SkipBack className="w-4 h-4 fill-current" />
                </Button>
                <Button
                  size="icon"
                  className="h-8 w-8 rounded-full bg-foreground hover:bg-foreground/90 text-background hover:scale-105 transition-transform"
                  onClick={togglePlay}
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 fill-current" />
                  ) : (
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  )}
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={playNext}
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                >
                  <SkipForward className="w-4 h-4 fill-current" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={toggleRepeat}
                  className={`h-8 w-8 ${isRepeat ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <Repeat className="w-3.5 h-3.5" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground tabular-nums w-10 text-right">
                  {formatTime(currentTime)}
                </span>
                <Slider
                  value={[currentTime]}
                  onValueChange={([value]) => seekTo(value)}
                  max={duration || 100}
                  step={1}
                  className="flex-1"
                />
                <span className="text-xs text-muted-foreground tabular-nums w-10">
                  {duration ? formatTime(duration) : "0:00"}
                </span>
              </div>
            </div>

            {/* Right Section - Additional Controls */}
            <div className="flex items-center justify-end gap-2">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={() => setShowComments(true)}
              >
                <MessageSquare className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={toggleMute}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </Button>
              <Slider
                value={[isMuted ? 0 : volume]}
                onValueChange={([value]) => setVolume(value)}
                max={100}
                step={1}
                className="w-24"
              />
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={openFullscreen}
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Comments Dialog */}
      {showComments && (
        <CommentsDialog 
          songId={currentSong.id.toString()}
          songTitle={currentSong.title}
          open={showComments}
          onOpenChange={setShowComments}
        />
      )}
    </>
  );
};

export default MusicPlayer;
