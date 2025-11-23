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
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-pink-500/30 via-background to-background">
      <div className="absolute inset-0 bg-gradient-to-r from-[#2d3561] via-[#2d3561]/95 to-[#2d3561]/80" />
      
      <div className="relative h-full flex flex-col">
        {/* Header with Back Arrow */}
        <div className="flex items-center justify-between p-4 md:p-6">
          <div className="flex items-center gap-2 md:gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setFullScreenOpen(false)}
              className="h-10 w-10 rounded-full hover:bg-white/10"
            >
              <ChevronLeft className="h-6 w-6 text-white" />
            </Button>
            <span className="text-white text-sm md:text-base font-medium">Back</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full hover:bg-white/10"
          >
            <MoreVertical className="h-6 w-6 text-white" />
          </Button>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="flex-1 flex flex-col md:flex-row gap-4 md:gap-6 lg:gap-8 px-4 md:px-6 lg:px-12 pb-4">
          {/* Left Side - Album Cover */}
          <div className="w-full md:w-1/2 flex items-center justify-center">
            <div className="relative w-full max-w-[400px] aspect-square rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={currentSong.image}
                alt={currentSong.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right Side - Ad Showcase */}
          <div className="w-full md:w-1/2 flex flex-col gap-4">
            <h2 className="text-white text-lg md:text-xl font-semibold text-center md:text-left">Ads</h2>
            <div className="flex-1 flex items-center justify-center">
              <div 
                className="rounded-xl border-4 border-white/30 bg-background/10 backdrop-blur-md overflow-hidden group transition-all duration-300 hover:scale-[1.02] hover:border-pink-500/50 w-full max-w-[350px]"
                style={{
                  aspectRatio: '9/10',
                }}
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <div className="flex items-center gap-2 text-white">
                      <span className="text-sm font-medium">{activeAd.title}</span>
                      <ExternalLink className="w-4 h-4" />
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Center - Song Info & Controls Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#2d3561] via-[#2d3561]/95 to-transparent px-4 md:px-6 lg:px-12 pb-6 pt-16">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Song Info */}
            <div className="text-center md:text-left">
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
                {currentSong.title}
              </h1>
              <p className="text-base md:text-xl text-pink-400/90">
                {currentSong.artist}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <span className="text-xs md:text-sm text-white/60 min-w-[40px]">
                  {formatTime(currentTime)}
                </span>
                <div 
                  onClick={handleProgressClick} 
                  className="flex-1 relative h-1.5 bg-white/20 rounded-full cursor-pointer group"
                >
                  <div 
                    className="absolute h-full bg-pink-500 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ left: `${progress}%`, transform: 'translate(-50%, -50%)' }}
                  />
                </div>
                <span className="text-xs md:text-sm text-white/60 min-w-[40px] text-right">
                  {formatTime(duration)}
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between gap-4">
              {/* Left Controls - Shuffle, Repeat, List */}
              <div className="flex items-center gap-2 md:gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleShuffle}
                  className={cn(
                    "h-8 w-8 md:h-10 md:w-10 hover:bg-white/10",
                    isShuffle ? "text-pink-400" : "text-white/70"
                  )}
                >
                  <Shuffle className="h-4 w-4 md:h-5 md:w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleRepeat}
                  className={cn(
                    "h-8 w-8 md:h-10 md:w-10 hover:bg-white/10",
                    isRepeat ? "text-pink-400" : "text-white/70"
                  )}
                >
                  <Repeat className="h-4 w-4 md:h-5 md:w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 md:h-10 md:w-10 text-white/70 hover:bg-white/10"
                >
                  <List className="h-4 w-4 md:h-5 md:w-5" />
                </Button>
              </div>

              {/* Center - Playback Controls */}
              <div className="flex items-center gap-3 md:gap-6">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={playPrevious}
                  className="h-10 w-10 md:h-12 md:w-12 text-white hover:bg-white/10"
                >
                  <SkipBack className="h-5 w-5 md:h-6 md:w-6" fill="white" />
                </Button>
                <Button
                  size="icon"
                  onClick={togglePlay}
                  className="h-14 w-14 md:h-16 md:w-16 rounded-full bg-pink-500 hover:bg-pink-600 shadow-lg"
                >
                  {isPlaying ? (
                    <Pause className="h-6 w-6 md:h-7 md:w-7 text-white" fill="white" />
                  ) : (
                    <Play className="h-6 w-6 md:h-7 md:w-7 text-white ml-1" fill="white" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={playNext}
                  className="h-10 w-10 md:h-12 md:w-12 text-white hover:bg-white/10"
                >
                  <SkipForward className="h-5 w-5 md:h-6 md:w-6" fill="white" />
                </Button>
              </div>

              {/* Right Controls - Volume, Like, Share */}
              <div className="flex items-center gap-2 md:gap-4">
                <div className="hidden md:flex items-center gap-2 max-w-[120px]">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleMute}
                    className="h-8 w-8 text-white hover:bg-white/10"
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
                    className="flex-1 cursor-pointer [&_[role=slider]]:bg-white [&_[role=slider]]:border-white"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLike}
                  disabled={isLoading}
                  className={cn(
                    "h-8 w-8 md:h-10 md:w-10 rounded-full hover:bg-white/10",
                    isLiked ? "text-pink-500" : "text-white/70"
                  )}
                >
                  <Heart className={cn("h-4 w-4 md:h-5 md:w-5", isLiked && "fill-pink-500")} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 md:h-10 md:w-10 rounded-full text-white/70 hover:bg-white/10"
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
