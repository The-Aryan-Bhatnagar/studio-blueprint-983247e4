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
        {/* Header */}
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setFullScreenOpen(false)}
              className="h-10 w-10 rounded-full hover:bg-white/10"
            >
              <ChevronLeft className="h-6 w-6 text-white" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full hover:bg-white/10"
            >
              <MoreVertical className="h-6 w-6 text-white" />
            </Button>
          </div>
        </div>

        {/* Main Content - Centered Layout */}
        <div className="flex-1 flex items-center justify-center px-12 lg:px-20">
          <div className="flex items-start gap-8 w-full max-w-7xl">
            {/* Left Side - Album Art (Small) */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-xl overflow-hidden shadow-2xl">
                <img
                  src={currentSong.image}
                  alt={currentSong.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Center - Song Info & Controls */}
            <div className="flex-1 flex flex-col items-center justify-center gap-8 max-w-2xl mx-auto">
              {/* Song Info */}
              <div className="text-center">
                <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-3">
                  {currentSong.title}
                </h1>
                <p className="text-xl lg:text-2xl text-pink-400/90">
                  {currentSong.artist}
                </p>
              </div>

              {/* Playback Controls */}
              <div className="flex items-center gap-8">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={playPrevious}
                  className="h-14 w-14 text-white hover:bg-white/10"
                >
                  <SkipBack className="h-7 w-7" fill="white" />
                </Button>
                <Button
                  size="icon"
                  onClick={togglePlay}
                  className="h-20 w-20 rounded-full bg-pink-500 hover:bg-pink-600 shadow-lg"
                >
                  {isPlaying ? (
                    <Pause className="h-8 w-8 text-white" fill="white" />
                  ) : (
                    <Play className="h-8 w-8 text-white ml-1" fill="white" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={playNext}
                  className="h-14 w-14 text-white hover:bg-white/10"
                >
                  <SkipForward className="h-7 w-7" fill="white" />
                </Button>
              </div>

              {/* Volume Control */}
              <div className="flex items-center gap-4 w-full max-w-md">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMute}
                  className="h-10 w-10 text-white hover:bg-white/10"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="h-5 w-5" />
                  ) : (
                    <Volume2 className="h-5 w-5" />
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
            </div>

            {/* Right Sidebar - Ad Space & Actions */}
            <div className="flex-shrink-0 flex flex-col gap-6 items-center">
              {/* Ad Showcase Area - Responsive 9cm × 10cm */}
              <div 
                className="rounded-xl border border-white/20 bg-background/10 backdrop-blur-md overflow-hidden group transition-all duration-300 hover:scale-[1.02] hover:border-pink-500/50"
                style={{
                  width: '9cm',
                  height: '10cm',
                  maxWidth: '28vw',
                  maxHeight: '40vh',
                  minWidth: '150px',
                  minHeight: '180px',
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
              
              {/* Action Buttons */}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLike}
                disabled={isLoading}
                className={cn(
                  "h-12 w-12 rounded-full hover:bg-white/10",
                  isLiked ? "text-pink-500" : "text-white/70"
                )}
              >
                <Heart className={cn("h-6 w-6", isLiked && "fill-pink-500")} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12 rounded-full text-white/70 hover:bg-white/10"
              >
                <Share2 className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Section - Progress Bar & Controls */}
        <div className="px-12 lg:px-20 pb-8">
          <div className="max-w-7xl mx-auto space-y-4">
            {/* Progress Bar with Labels */}
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-sm text-white/60">
                <span>Start Slide</span>
                <span className="flex-1"></span>
                <span>End of Slide</span>
              </div>
              <div className="flex items-center gap-4">
                <div 
                  onClick={handleProgressClick} 
                  className="flex-1 relative h-1 bg-white/20 rounded-full cursor-pointer group"
                >
                  <div 
                    className="absolute h-full bg-white rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ left: `${progress}%`, transform: 'translate(-50%, -50%)' }}
                  />
                </div>
                <span className="text-sm text-pink-400 font-medium min-w-[40px] text-right">
                  {formatTime(currentTime)}
                </span>
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleShuffle}
                  className={cn(
                    "h-9 w-9 hover:bg-white/10",
                    isShuffle ? "text-pink-400" : "text-white/70"
                  )}
                >
                  <Shuffle className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleRepeat}
                  className={cn(
                    "h-9 w-9 hover:bg-white/10",
                    isRepeat ? "text-pink-400" : "text-white/70"
                  )}
                >
                  <Repeat className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-white/70 hover:bg-white/10"
                >
                  <List className="h-5 w-5" />
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
