import { Play, Pause, SkipBack, SkipForward, Volume2, Heart, Shuffle, Repeat, MessageSquare, X, Maximize2, VolumeX } from "lucide-react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { usePlayer } from "@/contexts/PlayerContext";
import { useToast } from "@/hooks/use-toast";
import { useSongLikes } from "@/hooks/useSongLikes";
import { useAuth } from "@/contexts/AuthContext";
import { useFullscreenAds } from "@/hooks/useFullscreenAds";
import { useIsMobile } from "@/hooks/useIsMobile";
import CommentsDialog from "./CommentsDialog";
import { useState, useEffect } from "react";

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
  const isMobile = useIsMobile();
  const [showComments, setShowComments] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  // Auto-open fullscreen on mobile when song is playing
  useEffect(() => {
    if (isMobile && currentSong) {
      setIsFullscreen(true);
    }
  }, [isMobile, currentSong]);

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

  const handleVolumeClick = () => {
    if (showVolumeSlider) {
      // If slider is showing, toggle mute
      toggleMute();
    } else {
      // Show the slider
      setShowVolumeSlider(true);
    }
  };

  if (!currentSong) return null;

  const activeAd = ads?.[0];

  // Bottom Mini Player
  if (!isFullscreen) {
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
                onClick={() => setIsFullscreen(true)}
              />
              <div className="min-w-0 flex-1" onClick={() => setIsFullscreen(true)}>
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
      {/* Close Button - Only show on desktop */}
      {!isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 h-10 w-10 rounded-full bg-black/30 hover:bg-black/50 text-white z-10"
          onClick={() => setIsFullscreen(false)}
        >
          <X className="h-6 w-6" />
        </Button>
      )}

      {/* Mobile Layout */}
      {isMobile ? (
        <div className="w-full h-full flex flex-col px-6 py-8 max-w-md mx-auto">
          {/* Back Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsFullscreen(false)}
            className="h-10 w-10 text-white hover:bg-white/10 self-start mb-4"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Button>

          {/* Large Album Cover */}
          <div className="w-full aspect-square rounded-3xl overflow-hidden shadow-2xl mb-6">
            <img
              src={currentSong.image}
              alt={currentSong.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Song Info & Add Button */}
          <div className="flex items-start justify-between mb-8">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold text-white truncate mb-1">
                {currentSong.title}
              </h2>
              <p className="text-base text-white/80 truncate">
                {currentSong.artist}
              </p>
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={handleLike}
              disabled={isLoading}
              className="h-12 w-12 text-white hover:bg-white/10 flex-shrink-0"
            >
              <Heart className={`h-6 w-6 ${isLiked ? "fill-white" : ""}`} />
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <Slider
              value={[currentTime]}
              onValueChange={([value]) => seekTo(value)}
              max={duration || 100}
              step={1}
              className="mb-2 [&_[role=slider]]:bg-white [&_[role=slider]]:border-white [&_>.relative]:bg-white/30"
            />
            <div className="flex items-center justify-between text-sm text-white/70">
              <span>{formatTime(currentTime)}</span>
              <span>{duration ? formatTime(duration) : "0:00"}</span>
            </div>
          </div>

          {/* Main Playback Controls */}
          <div className="flex items-center justify-between mb-8">
            <Button
              size="icon"
              variant="ghost"
              onClick={toggleShuffle}
              className={`h-12 w-12 ${isShuffle ? "text-white" : "text-white/60"}`}
            >
              <Shuffle className="h-5 w-5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={playPrevious}
              className="h-14 w-14 text-white hover:bg-white/10"
            >
              <SkipBack className="h-7 w-7 fill-current" />
            </Button>
            <Button
              size="icon"
              className="h-16 w-16 rounded-full bg-white hover:bg-white/90 text-gray-900 shadow-xl"
              onClick={togglePlay}
            >
              {isPlaying ? (
                <Pause className="h-8 w-8 fill-current" />
              ) : (
                <Play className="h-8 w-8 fill-current ml-0.5" />
              )}
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={playNext}
              className="h-14 w-14 text-white hover:bg-white/10"
            >
              <SkipForward className="h-7 w-7 fill-current" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={toggleRepeat}
              className={`h-12 w-12 ${isRepeat ? "text-white" : "text-white/60"}`}
            >
              <Repeat className="h-5 w-5" />
            </Button>
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center justify-around mt-auto relative">
            <div className="relative">
              <Button
                size="icon"
                variant="ghost"
                onClick={handleVolumeClick}
                className="h-12 w-12 text-white/80 hover:text-white"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="h-5 w-5" />
                ) : (
                  <Volume2 className="h-5 w-5" />
                )}
              </Button>
              
              {/* Volume Slider Popup */}
              {showVolumeSlider && (
                <>
                  {/* Backdrop to close slider */}
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowVolumeSlider(false)}
                  />
                  
                  {/* Volume Slider */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 bg-gray-900/95 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-white/10 z-50 w-48">
                    <div className="flex flex-col items-center gap-3">
                      <span className="text-xs text-white/70 font-medium">Volume</span>
                      <div className="flex items-center gap-3 w-full">
                        <VolumeX className="h-4 w-4 text-white/60" />
                        <Slider
                          value={[isMuted ? 0 : volume]}
                          onValueChange={([value]) => {
                            setVolume(value);
                            if (value > 0 && isMuted) {
                              toggleMute();
                            }
                          }}
                          max={100}
                          step={1}
                          className="flex-1 [&_[role=slider]]:bg-white [&_[role=slider]]:border-white [&_>.relative]:bg-white/30"
                        />
                        <Volume2 className="h-4 w-4 text-white/60" />
                      </div>
                      <span className="text-sm text-white font-semibold">{isMuted ? 0 : volume}%</span>
                    </div>
                  </div>
                </>
              )}
            </div>
            
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setShowComments(true)}
              className="h-12 w-12 text-white/80 hover:text-white"
            >
              <MessageSquare className="h-5 w-5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-12 w-12 text-white/80 hover:text-white"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
        </div>
      ) : (
        // Desktop Layout
        <div className="w-full h-full flex flex-col items-center justify-center px-4 py-6">
          {/* Main Section - Responsive Layout */}
          <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} items-center justify-center gap-6 lg:gap-16 mb-8`}>
            {/* Album Cover with Thick Border */}
            <div className={`${isMobile ? 'w-64 h-64' : 'w-64 h-64 lg:w-80 lg:h-80'} rounded-2xl overflow-hidden border-[6px] border-gray-900 shadow-2xl flex-shrink-0`}>
              <img
                src={currentSong.image}
                alt={currentSong.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Ad Section */}
            {activeAd && (
              <div className={`${isMobile ? 'w-56 h-64' : 'w-52 h-72 lg:w-64 lg:h-80'} rounded-2xl overflow-hidden shadow-2xl flex-shrink-0`}>
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

          {/* Bottom Control Bar */}
          <div className="w-full max-w-6xl">
            <div className="bg-[#1a1d29] rounded-2xl px-6 py-4 shadow-2xl border border-gray-800">
              <div className="flex items-center gap-4">
                {/* Left: Album Thumbnail & Song Info */}
                <div className="flex items-center gap-3 min-w-[200px]">
                  <img
                    src={currentSong.image}
                    alt={currentSong.title}
                    className="w-12 h-12 rounded object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-white truncate">
                      {currentSong.title}
                    </h4>
                    <p className="text-xs text-gray-400 truncate">
                      {currentSong.artist}
                    </p>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleLike}
                    disabled={isLoading}
                    className="h-8 w-8 text-white/60 hover:text-pink-400 flex-shrink-0"
                  >
                    <Heart className={`h-4 w-4 ${isLiked ? "fill-pink-400 text-pink-400" : ""}`} />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setShowComments(true)}
                    className="h-8 w-8 text-white/60 hover:text-white flex-shrink-0"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>

                {/* Center: Playback Controls */}
                <div className="flex-1 flex flex-col gap-2 items-center min-w-0">
                  <div className="flex items-center gap-3">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={toggleShuffle}
                      className={`h-8 w-8 ${isShuffle ? "text-pink-400" : "text-white/60 hover:text-white"}`}
                    >
                      <Shuffle className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={playPrevious}
                      className="h-8 w-8 text-white hover:bg-white/10"
                    >
                      <SkipBack className="h-4 w-4 fill-current" />
                    </Button>
                    <Button
                      size="icon"
                      className="h-10 w-10 rounded-full bg-pink-500 hover:bg-pink-600 text-white shadow-lg hover:scale-105 transition-transform"
                      onClick={togglePlay}
                    >
                      {isPlaying ? (
                        <Pause className="h-5 w-5 fill-current" />
                      ) : (
                        <Play className="h-5 w-5 fill-current ml-0.5" />
                      )}
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={playNext}
                      className="h-8 w-8 text-white hover:bg-white/10"
                    >
                      <SkipForward className="h-4 w-4 fill-current" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={toggleRepeat}
                      className={`h-8 w-8 ${isRepeat ? "text-pink-400" : "text-white/60 hover:text-white"}`}
                    >
                      <Repeat className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="flex items-center gap-3 w-full max-w-2xl">
                    <span className="text-xs text-white/70 tabular-nums min-w-[40px]">
                      {formatTime(currentTime)}
                    </span>
                    <Slider
                      value={[currentTime]}
                      onValueChange={([value]) => seekTo(value)}
                      max={duration || 100}
                      step={1}
                      className="flex-1 [&_[role=slider]]:bg-pink-500 [&_[role=slider]]:border-pink-500 [&_>.relative]:bg-gray-700"
                    />
                    <span className="text-xs text-white/70 tabular-nums min-w-[40px] text-right">
                      {duration ? formatTime(duration) : "0:00"}
                    </span>
                  </div>
                </div>

                {/* Right: Volume Control */}
                <div className="flex items-center gap-2 min-w-[140px] justify-end">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={toggleMute}
                    className="h-8 w-8 text-white/60 hover:text-white flex-shrink-0"
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
                    className="w-24 [&_[role=slider]]:bg-pink-500 [&_[role=slider]]:border-pink-500 [&_>.relative]:bg-gray-700"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
