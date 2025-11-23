import { X, MoreVertical, Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Shuffle, Repeat, List, Heart, Share2, ChevronLeft } from "lucide-react";
import { usePlayer } from "@/contexts/PlayerContext";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useSongLikes } from "@/hooks/useSongLikes";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import CommentsDialog from "./CommentsDialog";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useFullscreenAds } from "@/hooks/useFullscreenAds";
import { ExternalLink } from "lucide-react";

const formatTime = (seconds: number): string => {
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export function FullScreenPlayer() {
  const {
    currentSong,
    isPlaying,
    isFullScreenOpen,
    setFullScreenOpen,
    togglePlay,
    playNext,
    playPrevious,
    isShuffle,
    isRepeat,
    toggleShuffle,
    toggleRepeat,
    currentTime,
    duration,
    seekTo,
    volume,
    isMuted,
    setVolume,
    toggleMute,
  } = usePlayer();

  const { user } = useAuth();
  const { toast } = useToast();
  const { isLiked, toggleLike, isLoading } = useSongLikes(currentSong?.id?.toString());
  const [showComments, setShowComments] = useState(false);
  const { data: ads } = useFullscreenAds();
  
  // Sample ad for Sean Akhay (fallback if no ads from database)
  const sampleAd = {
    id: "sample-1",
    title: "Sean Akhay - Out Now",
    image_url: "/images/sean-akhay-ad.png",
    link_url: "https://www.hresigf.com",
  };
  
  const activeAd = ads?.[0] || sampleAd;

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

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * duration;
    seekTo(newTime);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!isFullScreenOpen || !currentSong) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background overflow-hidden">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(var(--primary),0.15),transparent_50%)]" />
      
      <div className="relative h-full flex flex-col animate-fade-in">
        {/* Header with Back Arrow */}
        <div className="flex items-center justify-between p-4 md:p-6 backdrop-blur-sm">
          <div className="flex items-center gap-2 md:gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setFullScreenOpen(false)}
              className="h-10 w-10 rounded-full hover:bg-primary/10 hover:scale-110 transition-all duration-200"
            >
              <ChevronLeft className="h-6 w-6 text-foreground" />
            </Button>
            <span className="text-foreground text-sm md:text-base font-medium">Now Playing</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full hover:bg-primary/10 hover:scale-110 transition-all duration-200"
          >
            <MoreVertical className="h-6 w-6 text-muted-foreground" />
          </Button>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="flex-1 flex flex-col md:flex-row gap-6 md:gap-8 lg:gap-12 px-4 md:px-8 lg:px-16 pb-4 overflow-auto">
          {/* Left Side - Album Cover */}
          <div className="w-full md:w-1/2 flex items-center justify-center">
            <div className="relative w-full max-w-[450px] group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-primary rounded-2xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
              <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl ring-1 ring-border/50 hover-scale">
                <img
                  src={currentSong.image}
                  alt={currentSong.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          </div>

          {/* Right Side - Ad Showcase */}
          <div className="w-full md:w-1/2 flex flex-col gap-4 md:gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-foreground text-lg md:text-xl font-bold flex items-center gap-2">
                <span className="w-1 h-6 bg-primary rounded-full" />
                Featured
              </h2>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div className="relative w-full max-w-[400px] group">
                <div className="absolute -inset-1 bg-gradient-to-r from-accent via-primary to-accent rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
                <div 
                  className="relative rounded-2xl border-2 border-border/50 bg-card/50 backdrop-blur-md overflow-hidden group-hover:border-primary/50 transition-all duration-300 hover-scale shadow-xl"
                  style={{ aspectRatio: '9/10' }}
                >
                  <a 
                    href={activeAd.link_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block w-full h-full relative"
                  >
                    <img 
                      src={activeAd.image_url} 
                      alt={activeAd.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-4">
                      <div className="flex items-center justify-between w-full">
                        <span className="text-sm font-semibold text-foreground">{activeAd.title}</span>
                        <ExternalLink className="w-4 h-4 text-primary" />
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Controls Section */}
        <div className="relative bg-gradient-to-t from-background via-background/98 to-transparent backdrop-blur-xl border-t border-border/50 px-4 md:px-8 lg:px-16 py-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Song Info */}
            <div className="text-center md:text-left space-y-1">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground truncate">
                {currentSong.title}
              </h1>
              <p className="text-base md:text-lg text-muted-foreground">
                {currentSong.artist}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <span className="text-xs md:text-sm text-muted-foreground min-w-[40px] tabular-nums">
                  {formatTime(currentTime)}
                </span>
                <div 
                  onClick={handleProgressClick} 
                  className="flex-1 relative h-2 bg-secondary rounded-full cursor-pointer group overflow-hidden"
                >
                  <div 
                    className="absolute h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-150 shadow-lg shadow-primary/50"
                    style={{ width: `${progress}%` }}
                  />
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity border-2 border-background"
                    style={{ left: `${progress}%`, transform: 'translate(-50%, -50%)' }}
                  />
                </div>
                <span className="text-xs md:text-sm text-muted-foreground min-w-[40px] text-right tabular-nums">
                  {formatTime(duration)}
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between gap-4">
              {/* Left Controls */}
              <div className="flex items-center gap-1 md:gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleShuffle}
                  className={cn(
                    "h-9 w-9 md:h-10 md:w-10 rounded-full hover:bg-primary/10 transition-all duration-200",
                    isShuffle ? "text-primary bg-primary/10" : "text-muted-foreground"
                  )}
                >
                  <Shuffle className="h-4 w-4 md:h-5 md:w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleRepeat}
                  className={cn(
                    "h-9 w-9 md:h-10 md:w-10 rounded-full hover:bg-primary/10 transition-all duration-200",
                    isRepeat ? "text-primary bg-primary/10" : "text-muted-foreground"
                  )}
                >
                  <Repeat className="h-4 w-4 md:h-5 md:w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 md:h-10 md:w-10 rounded-full text-muted-foreground hover:bg-primary/10 hover:text-foreground transition-all duration-200"
                >
                  <List className="h-4 w-4 md:h-5 md:w-5" />
                </Button>
              </div>

              {/* Center - Playback Controls */}
              <div className="flex items-center gap-3 md:gap-5">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={playPrevious}
                  className="h-11 w-11 md:h-12 md:w-12 rounded-full text-foreground hover:bg-primary/10 hover:scale-110 transition-all duration-200"
                >
                  <SkipBack className="h-5 w-5 md:h-6 md:w-6" fill="currentColor" />
                </Button>
                <Button
                  size="icon"
                  onClick={togglePlay}
                  className="h-14 w-14 md:h-16 md:w-16 rounded-full bg-gradient-to-br from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-2xl shadow-primary/50 hover:scale-105 transition-all duration-200"
                >
                  {isPlaying ? (
                    <Pause className="h-6 w-6 md:h-7 md:w-7 text-primary-foreground" fill="currentColor" />
                  ) : (
                    <Play className="h-6 w-6 md:h-7 md:w-7 text-primary-foreground ml-1" fill="currentColor" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={playNext}
                  className="h-11 w-11 md:h-12 md:w-12 rounded-full text-foreground hover:bg-primary/10 hover:scale-110 transition-all duration-200"
                >
                  <SkipForward className="h-5 w-5 md:h-6 md:w-6" fill="currentColor" />
                </Button>
              </div>

              {/* Right Controls */}
              <div className="flex items-center gap-1 md:gap-2">
                <div className="hidden lg:flex items-center gap-2 w-32">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleMute}
                    className="h-9 w-9 rounded-full text-muted-foreground hover:bg-primary/10 hover:text-foreground transition-all duration-200"
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="h-4 w-4" />
                    ) : (
                      <Volume2 className="h-4 w-4" />
                    )}
                  </Button>
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    onValueChange={([value]) => setVolume(value)}
                    max={100}
                    step={1}
                    className="flex-1 cursor-pointer"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLike}
                  disabled={isLoading}
                  className={cn(
                    "h-9 w-9 md:h-10 md:w-10 rounded-full hover:bg-primary/10 transition-all duration-200",
                    isLiked ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  <Heart className={cn("h-4 w-4 md:h-5 md:w-5 transition-all", isLiked && "fill-primary scale-110")} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 md:h-10 md:w-10 rounded-full text-muted-foreground hover:bg-primary/10 hover:text-foreground transition-all duration-200"
                >
                  <Share2 className="h-4 w-4 md:h-5 md:w-5" />
                </Button>
              </div>
            </div>
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

export default FullScreenPlayer;
