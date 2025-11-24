import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Heart, MessageSquare } from "lucide-react";
import { usePlayer } from "@/contexts/PlayerContext";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "./ProgressBar";
import { VolumeControl } from "./VolumeControl";
import { useSongLikes } from "@/hooks/useSongLikes";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import CommentsDialog from "../CommentsDialog";
import { useState } from "react";

export function MiniPlayer() {
  const {
    currentSong,
    isPlaying,
    togglePlay,
    playNext,
    playPrevious,
    isShuffle,
    isRepeat,
    toggleShuffle,
    toggleRepeat,
  } = usePlayer();

  const { user } = useAuth();
  const { toast } = useToast();
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

  if (!currentSong) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-lg border-t border-border z-40">
      <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-3">
        <div className="flex items-center justify-between gap-2 sm:gap-3 md:gap-4">
          {/* Left: Track Info */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <img
              src={currentSong.image}
              alt={currentSong.title}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded object-cover flex-shrink-0"
            />
            <div className="min-w-0 hidden sm:block">
              <p className="text-xs sm:text-sm font-medium truncate">{currentSong.title}</p>
              <p className="text-xs text-muted-foreground truncate">{currentSong.artist}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLike}
              disabled={isLoading}
              className="h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0"
            >
              <Heart className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${isLiked ? "fill-primary text-primary" : ""}`} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowComments(true)}
              className="h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0 hidden sm:flex"
            >
              <MessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
          </div>

          {/* Center: Player Controls */}
          <div className="flex flex-col items-center gap-1 sm:gap-2 flex-1 max-w-2xl">
            <div className="flex items-center gap-1 sm:gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleShuffle}
                className={`h-7 w-7 sm:h-8 sm:w-8 hidden md:flex ${isShuffle ? "text-primary" : ""}`}
              >
                <Shuffle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={playPrevious}
                className="h-7 w-7 sm:h-8 sm:w-8"
              >
                <SkipBack className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Button>
              <Button
                variant="default"
                size="icon"
                onClick={togglePlay}
                className="h-8 w-8 sm:h-10 sm:w-10 rounded-full"
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4 sm:h-5 sm:w-5" fill="currentColor" />
                ) : (
                  <Play className="h-4 w-4 sm:h-5 sm:w-5 ml-0.5" fill="currentColor" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={playNext}
                className="h-7 w-7 sm:h-8 sm:w-8"
              >
                <SkipForward className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleRepeat}
                className={`h-7 w-7 sm:h-8 sm:w-8 hidden md:flex ${isRepeat ? "text-primary" : ""}`}
              >
                <Repeat className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Button>
            </div>
            <div className="w-full hidden sm:block">
              <ProgressBar />
            </div>
          </div>

          {/* Right: Volume */}
          <div className="flex items-center gap-1 sm:gap-2 justify-end flex-1">
            <VolumeControl />
          </div>
        </div>
      </div>

      {/* Comments Dialog */}
      {currentSong && showComments && (
        <CommentsDialog 
          songId={currentSong.id.toString()} 
          songTitle={currentSong.title}
          open={showComments}
          onOpenChange={setShowComments}
        />
      )}
    </div>
  );
}
