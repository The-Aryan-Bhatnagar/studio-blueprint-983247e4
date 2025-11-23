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
    title: "Sean Akhay - New Album",
    image_url: "/images/sean-akhay-ad.jpg",
    link_url: "#",
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

        {/* Main Content */}
        <div className="flex-1 flex items-center px-12 lg:px-20">
          <div className="flex items-center gap-8 lg:gap-16 w-full max-w-7xl mx-auto">
            {/* Album Art */}
            <div className="flex-shrink-0">
              <div className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={currentSong.image}
                  alt={currentSong.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Right Side - Song Info & Controls */}
            <div className="flex-1 flex flex-col gap-8">
              {/* Song Info */}
              <div>
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-2">
                  {currentSong.title}
                </h1>
                <p className="text-lg lg:text-xl text-pink-400/90">
                  {currentSong.artist}
                </p>
              </div>

              {/* Playback Controls */}
              <div className="flex items-center gap-6">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={playPrevious}
                  className="h-12 w-12 text-white hover:bg-white/10"
                >
                  <SkipBack className="h-6 w-6" fill="white" />
                </Button>
                <Button
                  size="icon"
                  onClick={togglePlay}
                  className="h-16 w-16 rounded-full bg-pink-500 hover:bg-pink-600 shadow-lg"
                >
                  {isPlaying ? (
                    <Pause className="h-7 w-7 text-white" fill="white" />
                  ) : (
                    <Play className="h-7 w-7 text-white ml-1" fill="white" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={playNext}
                  className="h-12 w-12 text-white hover:bg-white/10"
                >
                  <SkipForward className="h-6 w-6" fill="white" />
                </Button>
              </div>

              {/* Volume Control */}
              <div className="flex items-center gap-4 max-w-xs">
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
          </div>
        </div>

        {/* Bottom Section - Progress Bar & Controls */}
        <div className="px-12 lg:px-20 pb-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-6 mb-4">
              {/* Progress Bar */}
              <div className="flex-1">
                <div 
                  onClick={handleProgressClick} 
                  className="relative h-1 bg-white/20 rounded-full cursor-pointer group"
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
              </div>
              
              {/* Time Display */}
              <span className="text-sm text-pink-400 font-medium min-w-[40px] text-right">
                {formatTime(currentTime)}
              </span>
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

        {/* Right Sidebar - Ad Space & Actions */}
        <div className="absolute right-20 top-1/2 -translate-y-1/2 flex flex-col gap-6 items-center">
          {/* Ad Showcase Area */}
          <div className="w-80 h-96 rounded-2xl border-2 border-pink-500/30 bg-gradient-to-br from-pink-500/10 to-purple-500/10 backdrop-blur-sm overflow-hidden group hover:border-pink-500/50 transition-all">
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
