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

      <div className="w-full max-w-6xl mx-auto flex flex-col items-center">
        {/* Main Player Section */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 mb-8">
          {/* Album Cover with Border */}
          <div className="w-60 h-60 md:w-72 md:h-72 rounded-lg overflow-hidden border-4 border-gray-800 shadow-2xl flex-shrink-0">
            <img
              src={currentSong.image}
              alt={currentSong.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Player Card */}
          <div className="bg-gray-900/90 rounded-2xl p-8 w-full max-w-xs shadow-2xl">
            <div className="space-y-6">
              {/* Song Info */}
              <div className="text-center space-y-1">
                <h2 className="text-2xl font-bold text-white">
                  {currentSong.title}
                </h2>
                <p className="text-sm text-pink-400">
                  {currentSong.artist}
                </p>
              </div>

              {/* Play Controls */}
              <div className="flex items-center justify-center gap-4">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={playPrevious}
                  className="h-10 w-10 text-white hover:bg-white/10"
                >
                  <SkipBack className="h-5 w-5 fill-current" />
                </Button>
                <Button
                  size="icon"
                  className="h-14 w-14 rounded-full bg-pink-500 hover:bg-pink-600 text-white shadow-lg hover:scale-105 transition-transform"
                  onClick={togglePlay}
                >
                  {isPlaying ? (
                    <Pause className="h-6 w-6 fill-current" />
                  ) : (
                    <Play className="h-6 w-6 fill-current ml-0.5" />
                  )}
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={playNext}
                  className="h-10 w-10 text-white hover:bg-white/10"
                >
                  <SkipForward className="h-5 w-5 fill-current" />
                </Button>
              </div>

              {/* Volume Control */}
              <div className="flex items-center justify-center gap-3">
                <Button
                  size="icon"
                  variant="ghost"
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
                  className="flex-1 [&_[role=slider]]:bg-pink-500 [&_[role=slider]]:border-pink-500"
                />
              </div>
            </div>
          </div>

          {/* Ad Section */}
          {activeAd && (
            <div className="w-56 h-72 rounded-xl overflow-hidden shadow-2xl flex-shrink-0">
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

        {/* Bottom Progress Bar */}
        <div className="w-full max-w-4xl bg-gray-900/70 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-sm text-white/70 tabular-nums min-w-[45px]">
              {formatTime(currentTime)}
            </span>
            <Slider
              value={[currentTime]}
              onValueChange={([value]) => seekTo(value)}
              max={duration || 100}
              step={1}
              className="flex-1 [&_[role=slider]]:bg-pink-500 [&_[role=slider]]:border-pink-500"
            />
            <span className="text-sm text-white/70 tabular-nums min-w-[45px]">
              {duration ? formatTime(duration) : "0:00"}
            </span>
          </div>

          {/* Bottom Icon Controls */}
          <div className="flex items-center justify-center gap-8">
            <Button
              size="icon"
              variant="ghost"
              onClick={toggleShuffle}
              className={`h-9 w-9 ${isShuffle ? "text-pink-400" : "text-white/50 hover:text-white"}`}
            >
              <Shuffle className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={toggleRepeat}
              className={`h-9 w-9 ${isRepeat ? "text-pink-400" : "text-white/50 hover:text-white"}`}
            >
              <Repeat className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setShowComments(true)}
              className="h-9 w-9 text-white/50 hover:text-white"
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
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
