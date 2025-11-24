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
    <div className="fixed inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20 z-50 overflow-auto">
      {/* Close Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 h-10 w-10 rounded-full hover:bg-background/50 z-10"
        onClick={() => setIsFullscreen(false)}
      >
        <X className="h-6 w-6" />
      </Button>

      <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col justify-center">
        {/* Main Content */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 mb-12">
          {/* Album Cover */}
          <div className="w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden shadow-2xl flex-shrink-0">
            <img
              src={currentSong.image}
              alt={currentSong.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Player Controls */}
          <div className="bg-card/80 backdrop-blur-xl rounded-3xl p-8 w-full max-w-md shadow-2xl border border-border/50">
            <div className="space-y-6">
              {/* Song Info */}
              <div className="text-center space-y-2">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                  {currentSong.title}
                </h2>
                <p className="text-lg text-muted-foreground">
                  {currentSong.artist}
                </p>
              </div>

              {/* Main Controls */}
              <div className="flex items-center justify-center gap-4">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={playPrevious}
                  className="h-12 w-12 hover:bg-accent"
                >
                  <SkipBack className="h-6 w-6 fill-current" />
                </Button>
                <Button
                  size="icon"
                  className="h-16 w-16 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:scale-105 transition-transform"
                  onClick={togglePlay}
                >
                  {isPlaying ? (
                    <Pause className="h-8 w-8 fill-current" />
                  ) : (
                    <Play className="h-8 w-8 fill-current ml-1" />
                  )}
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={playNext}
                  className="h-12 w-12 hover:bg-accent"
                >
                  <SkipForward className="h-6 w-6 fill-current" />
                </Button>
              </div>

              {/* Volume Control */}
              <div className="flex items-center gap-3">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={toggleMute}
                  className="h-10 w-10"
                >
                  <Volume2 className="h-5 w-5" />
                </Button>
                <Slider
                  value={[isMuted ? 0 : volume]}
                  onValueChange={([value]) => setVolume(value)}
                  max={100}
                  step={1}
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          {/* Ad Section */}
          {activeAd && (
            <div className="w-48 h-64 md:w-56 md:h-72 rounded-2xl overflow-hidden shadow-xl flex-shrink-0 bg-muted">
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

        {/* Progress Bar Section */}
        <div className="max-w-4xl mx-auto w-full space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground tabular-nums min-w-[40px]">
              {formatTime(currentTime)}
            </span>
            <Slider
              value={[currentTime]}
              onValueChange={([value]) => seekTo(value)}
              max={duration || 100}
              step={1}
              className="flex-1"
            />
            <span className="text-sm text-muted-foreground tabular-nums min-w-[40px]">
              {duration ? formatTime(duration) : "0:00"}
            </span>
          </div>

          {/* Bottom Controls */}
          <div className="flex items-center justify-center gap-6">
            <Button
              size="icon"
              variant="ghost"
              onClick={toggleShuffle}
              className={`h-10 w-10 ${isShuffle ? "text-primary" : "text-muted-foreground"}`}
            >
              <Shuffle className="h-5 w-5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={toggleRepeat}
              className={`h-10 w-10 ${isRepeat ? "text-primary" : "text-muted-foreground"}`}
            >
              <Repeat className="h-5 w-5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setShowComments(true)}
              className="h-10 w-10 text-muted-foreground"
            >
              <MessageSquare className="h-5 w-5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={handleLike}
              disabled={isLoading}
              className="h-10 w-10 text-muted-foreground hover:text-primary"
            >
              <Heart className={`h-5 w-5 ${isLiked ? "fill-primary text-primary" : ""}`} />
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
