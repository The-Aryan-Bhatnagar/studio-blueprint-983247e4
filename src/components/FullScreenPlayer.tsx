import { X, Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Volume2, Heart } from "lucide-react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { usePlayer } from "@/contexts/PlayerContext";
import { useSongLikes } from "@/hooks/useSongLikes";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const FullScreenPlayer = () => {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isRepeat,
    isShuffle,
    isFullScreenOpen,
    togglePlay,
    seekTo,
    setVolume,
    toggleMute,
    toggleRepeat,
    toggleShuffle,
    playNext,
    playPrevious,
    setFullScreenOpen,
  } = usePlayer();
  
  const { user } = useAuth();
  const { toast } = useToast();
  const { isLiked, toggleLike, isLoading } = useSongLikes(currentSong?.id?.toString());
  const [showAd, setShowAd] = useState(false);

  useEffect(() => {
    // Show ad every 3 songs (simulated)
    const adTimer = setTimeout(() => {
      setShowAd(true);
      setTimeout(() => setShowAd(false), 5000); // Hide after 5 seconds
    }, 15000);
    
    return () => clearTimeout(adTimer);
  }, [currentSong]);

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

  if (!isFullScreenOpen || !currentSong) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-gradient-to-b from-primary/20 via-background to-background backdrop-blur-xl animate-fade-in">
      {/* Ad Banner - Top */}
      {showAd && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 z-10 animate-fade-in">
          <div className="bg-card border border-border rounded-lg p-4 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/20 rounded flex items-center justify-center">
                <span className="text-xs font-bold text-primary">AD</span>
              </div>
              <div>
                <p className="font-semibold text-foreground">Premium Experience Awaits</p>
                <p className="text-sm text-muted-foreground">Upgrade to remove ads and unlock features</p>
              </div>
            </div>
            <Button size="sm" className="bg-primary hover:bg-primary/90">
              Upgrade Now
            </Button>
          </div>
        </div>
      )}

      {/* Close Button */}
      <Button
        size="icon"
        variant="ghost"
        onClick={() => setFullScreenOpen(false)}
        className="absolute top-4 right-4 z-10 hover:bg-background/50"
      >
        <X className="w-6 h-6" />
      </Button>

      {/* Main Content */}
      <div className="container mx-auto px-6 h-full flex flex-col items-center justify-center py-20">
        <div className="w-full max-w-2xl space-y-8">
          {/* Album Art */}
          <div className="relative aspect-square w-full max-w-md mx-auto rounded-2xl overflow-hidden shadow-2xl animate-scale-in">
            <img
              src={currentSong.image}
              alt={currentSong.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Song Info */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground truncate">
              {currentSong.title}
            </h1>
            <p className="text-xl text-muted-foreground truncate">
              {currentSong.artist}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Slider
              value={[currentTime]}
              onValueChange={([value]) => seekTo(value)}
              max={duration || 100}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{duration ? formatTime(duration) : "0:00"}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-6">
            <Button
              size="icon"
              variant="ghost"
              onClick={toggleShuffle}
              className={isShuffle ? "text-primary bg-primary/20" : ""}
            >
              <Shuffle className="w-5 h-5" />
            </Button>
            
            <Button
              size="icon"
              variant="ghost"
              onClick={playPrevious}
              className="hover:scale-110 transition-transform"
            >
              <SkipBack className="w-6 h-6" />
            </Button>

            <Button
              size="icon"
              className="h-16 w-16 bg-primary hover:bg-primary/90 hover:scale-110 transition-transform"
              onClick={togglePlay}
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 fill-current" />
              ) : (
                <Play className="w-8 h-8 fill-current" />
              )}
            </Button>

            <Button
              size="icon"
              variant="ghost"
              onClick={playNext}
              className="hover:scale-110 transition-transform"
            >
              <SkipForward className="w-6 h-6" />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              onClick={toggleRepeat}
              className={isRepeat ? "text-primary bg-primary/20" : ""}
            >
              <Repeat className="w-5 h-5" />
            </Button>
          </div>

          {/* Secondary Controls */}
          <div className="flex items-center justify-between px-4">
            <Button
              size="icon"
              variant="ghost"
              onClick={handleLike}
              disabled={isLoading}
              className="hover:scale-110 transition-transform"
            >
              <Heart className={`w-6 h-6 ${isLiked ? "fill-primary text-primary" : ""}`} />
            </Button>

            <div className="flex items-center gap-3">
              <Button
                size="icon"
                variant="ghost"
                onClick={toggleMute}
              >
                <Volume2 className={`w-5 h-5 ${isMuted ? "text-muted-foreground/50" : ""}`} />
              </Button>
              <Slider
                value={[isMuted ? 0 : volume]}
                onValueChange={([value]) => setVolume(value)}
                max={100}
                step={1}
                className="w-24"
              />
            </div>
          </div>
        </div>

        {/* Bottom Ad Section */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-full max-w-md px-4">
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-3 text-center">
            <p className="text-xs text-muted-foreground">
              Sponsored • <span className="text-primary font-medium">Discover new artists</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullScreenPlayer;
