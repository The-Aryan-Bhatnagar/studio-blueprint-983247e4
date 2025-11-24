import { Play, Pause, SkipBack, SkipForward, Volume2, Heart, Shuffle, Repeat, MessageSquare, X, Maximize2, VolumeX } from "lucide-react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { usePlayer } from "@/contexts/PlayerContext";
import { useToast } from "@/hooks/use-toast";
import { useSongLikes } from "@/hooks/useSongLikes";
import { useAuth } from "@/contexts/AuthContext";
import { useFullscreenAds } from "@/hooks/useFullscreenAds";
import CommentsDialog from "./CommentsDialog";
import { useState } from "react";

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
  const { data: ads } = useFullscreenAds();
  const [showComments, setShowComments] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

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

  const activeAd = ads?.[0];

  // Bottom Mini Player
  if (!isFullscreen) {
    return (
      <>
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border backdrop-blur-lg bg-opacity-95 z-50">
          <div className="px-4 py-3">
            <div className="grid grid-cols-[1fr_2fr_1fr] items-center gap-4">
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
                  onClick={() => setIsFullscreen(true)}
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
  }

  // Fullscreen Player
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 z-50 flex items-center justify-center p-8">
      {/* Close Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 h-10 w-10 rounded-full bg-black/30 hover:bg-black/50 text-white z-10"
        onClick={() => setIsFullscreen(false)}
      >
        <X className="h-6 w-6" />
      </Button>

      <div className="w-full h-full flex flex-col items-center justify-center px-4 py-6">
        {/* Main Player Section - Always Horizontal/Landscape */}
        <div className="flex flex-row items-center justify-center gap-6 lg:gap-10 mb-8">
          {/* Album Cover with Thick Border */}
          <div className="w-56 h-56 lg:w-64 lg:h-64 rounded-2xl overflow-hidden border-[6px] border-gray-900 shadow-2xl flex-shrink-0">
            <img
              src={currentSong.image}
              alt={currentSong.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Player Card - Center */}
          <div className="bg-[#1e2937] rounded-3xl p-6 lg:p-8 w-80 lg:w-96 shadow-2xl flex-shrink-0">
            <div className="space-y-5 lg:space-y-6">
              {/* Song Info */}
              <div className="text-center space-y-2">
                <h2 className="text-2xl lg:text-3xl font-bold text-white">
                  {currentSong.title}
                </h2>
                <p className="text-sm lg:text-base text-pink-400">
                  {currentSong.artist}
                </p>
              </div>

              {/* Play Controls */}
              <div className="flex items-center justify-center gap-5 lg:gap-6 py-2">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={playPrevious}
                  className="h-10 w-10 lg:h-11 lg:w-11 text-white hover:bg-white/10 rounded-lg"
                >
                  <SkipBack className="h-5 w-5 fill-current" />
                </Button>
                <Button
                  size="icon"
                  className="h-14 w-14 lg:h-16 lg:w-16 rounded-full bg-pink-500 hover:bg-pink-600 text-white shadow-xl hover:scale-105 transition-transform"
                  onClick={togglePlay}
                >
                  {isPlaying ? (
                    <Pause className="h-6 w-6 lg:h-7 lg:w-7 fill-current" />
                  ) : (
                    <Play className="h-6 w-6 lg:h-7 lg:w-7 fill-current ml-0.5" />
                  )}
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={playNext}
                  className="h-10 w-10 lg:h-11 lg:w-11 text-white hover:bg-white/10 rounded-lg"
                >
                  <SkipForward className="h-5 w-5 fill-current" />
                </Button>
              </div>

              {/* Volume Control */}
              <div className="flex items-center justify-center gap-3 px-2">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={toggleMute}
                  className="h-9 w-9 text-white hover:bg-white/10 rounded-lg flex-shrink-0"
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
                  className="flex-1 [&_[role=slider]]:bg-pink-500 [&_[role=slider]]:border-pink-500 [&_>.relative]:bg-gray-600"
                />
              </div>
            </div>
          </div>

          {/* Ad Section - Right */}
          {activeAd && (
            <div className="w-48 h-64 lg:w-56 lg:h-72 rounded-2xl overflow-hidden shadow-2xl flex-shrink-0">
              <a
                href={activeAd.link_url || "#"}
                target={activeAd.link_url ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="block w-full h-full"
              >
                <img
                  src={activeAd.image_url}
                  alt={activeAd.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </a>
            </div>
          )}
        </div>

        {/* Bottom Progress Bar Section */}
        <div className="w-full max-w-5xl">
          <div className="bg-[#1e2937]/80 rounded-2xl p-4 lg:p-5 space-y-3 lg:space-y-4 shadow-xl">
            {/* Progress Bar with Times */}
            <div className="flex items-center gap-3 lg:gap-4">
              <span className="text-xs lg:text-sm text-white/80 tabular-nums font-medium min-w-[40px] lg:min-w-[45px]">
                {formatTime(currentTime)}
              </span>
              <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
                <Slider
                  value={[currentTime]}
                  onValueChange={([value]) => seekTo(value)}
                  max={duration || 100}
                  step={1}
                  className="w-full [&_[role=slider]]:bg-pink-500 [&_[role=slider]]:border-pink-500 [&_>.relative]:bg-transparent h-1"
                />
              </div>
              <span className="text-xs lg:text-sm text-white/80 tabular-nums font-medium min-w-[40px] lg:min-w-[45px] text-right">
                {duration ? formatTime(duration) : "0:00"}
              </span>
            </div>

            {/* Bottom Icon Controls */}
            <div className="flex items-center justify-center gap-8 lg:gap-12 py-1">
              <Button
                size="icon"
                variant="ghost"
                onClick={toggleShuffle}
                className={`h-9 w-9 lg:h-10 lg:w-10 ${isShuffle ? "text-pink-400" : "text-white/60 hover:text-white"}`}
              >
                <Shuffle className="h-4 w-4 lg:h-5 lg:w-5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={toggleRepeat}
                className={`h-9 w-9 lg:h-10 lg:w-10 ${isRepeat ? "text-pink-400" : "text-white/60 hover:text-white"}`}
              >
                <Repeat className="h-4 w-4 lg:h-5 lg:w-5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setShowComments(true)}
                className="h-9 w-9 lg:h-10 lg:w-10 text-white/60 hover:text-white"
              >
                <MessageSquare className="h-4 w-4 lg:h-5 lg:w-5" />
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
    </div>
  );
};

export default MusicPlayer;
