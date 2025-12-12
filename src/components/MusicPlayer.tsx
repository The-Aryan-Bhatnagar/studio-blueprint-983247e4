import { Play, Pause, SkipBack, SkipForward, Volume2, Heart, Shuffle, Repeat, MessageSquare, X, Maximize2, VolumeX, Music } from "lucide-react";
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

// Sample lyrics for demo - in production, this would come from the song data
const sampleLyrics = [
  "🎵 Lyrics coming soon...",
  "",
  "This song doesn't have lyrics yet.",
  "Check back later for updates."
];

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
  const [showLyrics, setShowLyrics] = useState(false);

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

  // Fullscreen Player - Premium Design
  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Blurred Background Artwork */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${currentSong.image})`,
          filter: 'blur(40px)',
          transform: 'scale(1.2)',
        }}
      />
      
      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/70 via-black/80 to-black/95" />
      
      {/* Content Container */}
      <div className="relative z-10 w-full h-full flex flex-col">
        {/* Lyrics View */}
        {showLyrics ? (
          <div className="w-full h-full flex flex-col">
            {/* Close Lyrics Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowLyrics(false)}
              className="absolute top-6 left-6 h-10 w-10 text-white/80 hover:text-white hover:bg-white/10 z-20"
            >
              <X className="h-6 w-6" />
            </Button>
            
            {/* Lyrics Content */}
            <div className="flex-1 flex items-center justify-center px-8 py-20">
              <div className="text-center space-y-4 max-w-lg">
                {sampleLyrics.map((line, index) => (
                  <p 
                    key={index}
                    className={`text-xl md:text-2xl transition-all duration-300 ${
                      index === 0 ? 'text-white font-bold' : 'text-white/60'
                    }`}
                  >
                    {line || '\u00A0'}
                  </p>
                ))}
              </div>
            </div>
            
            {/* Mini Controls at Bottom */}
            <div className="p-6">
              <div className="flex items-center justify-center gap-4 mb-4">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={playPrevious}
                  className="h-10 w-10 text-white/80 hover:text-white"
                >
                  <SkipBack className="h-5 w-5 fill-current" />
                </Button>
                <Button
                  size="icon"
                  className="h-14 w-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-[0_0_30px_rgba(168,85,247,0.5)] hover:shadow-[0_0_40px_rgba(168,85,247,0.7)] transition-shadow"
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
                  className="h-10 w-10 text-white/80 hover:text-white"
                >
                  <SkipForward className="h-5 w-5 fill-current" />
                </Button>
              </div>
              
              {/* Progress Bar */}
              <div className="flex items-center gap-3 max-w-md mx-auto">
                <span className="text-xs text-white/60 tabular-nums">{formatTime(currentTime)}</span>
                <Slider
                  value={[currentTime]}
                  onValueChange={([value]) => seekTo(value)}
                  max={duration || 100}
                  step={1}
                  className="flex-1 [&_[role=slider]]:bg-purple-500 [&_[role=slider]]:border-purple-500 [&_>.relative]:bg-white/20"
                />
                <span className="text-xs text-white/60 tabular-nums">{duration ? formatTime(duration) : "0:00"}</span>
              </div>
            </div>
          </div>
        ) : (
          /* Main Player View */
          <>
            {/* Close/Back Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsFullscreen(false)}
              className="absolute top-6 left-6 h-10 w-10 text-white/80 hover:text-white hover:bg-white/10 z-20"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Button>

            {/* Mobile Layout */}
            {isMobile ? (
              <div className="w-full h-full flex flex-col justify-center px-6 py-8 max-w-md mx-auto">
                {/* Frosted Glass Card */}
                <div className="bg-white/10 backdrop-blur-xl rounded-[2rem] p-8 border border-white/20 shadow-2xl">
                  {/* Circular Artwork with Glow */}
                  <div className="flex justify-center mb-8">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-2xl opacity-50" />
                      <img
                        src={currentSong.image}
                        alt={currentSong.title}
                        className="relative w-48 h-48 rounded-full object-cover border-4 border-white/20 shadow-[0_0_40px_rgba(168,85,247,0.3)]"
                      />
                    </div>
                  </div>

                  {/* Song Info */}
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-white mb-2 truncate">
                      {currentSong.title}
                    </h2>
                    <p className="text-white/70 text-lg">
                      {currentSong.artist}
                    </p>
                  </div>

                  {/* Like Button */}
                  <div className="flex justify-center mb-6">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={handleLike}
                      disabled={isLoading}
                      className="h-12 w-12 text-white/80 hover:text-pink-400"
                    >
                      <Heart className={`h-6 w-6 ${isLiked ? "fill-pink-400 text-pink-400" : ""}`} />
                    </Button>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-8">
                    <Slider
                      value={[currentTime]}
                      onValueChange={([value]) => seekTo(value)}
                      max={duration || 100}
                      step={1}
                      className="mb-3 [&_[role=slider]]:bg-purple-500 [&_[role=slider]]:border-purple-400 [&_[role=slider]]:shadow-[0_0_10px_rgba(168,85,247,0.5)] [&_>.relative]:bg-white/20"
                    />
                    <div className="flex justify-between text-sm text-white/60">
                      <span>{formatTime(currentTime)}</span>
                      <span>{duration ? formatTime(duration) : "0:00"}</span>
                    </div>
                  </div>

                  {/* Main Controls */}
                  <div className="flex items-center justify-between px-4">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={toggleShuffle}
                      className={`h-10 w-10 ${isShuffle ? "text-purple-400" : "text-white/60"}`}
                    >
                      <Shuffle className="h-5 w-5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={playPrevious}
                      className="h-12 w-12 text-white hover:bg-white/10"
                    >
                      <SkipBack className="h-6 w-6 fill-current" />
                    </Button>
                    
                    {/* Glowing Play Button */}
                    <Button
                      size="icon"
                      className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 text-white shadow-[0_0_30px_rgba(168,85,247,0.5),0_0_60px_rgba(236,72,153,0.3)] hover:shadow-[0_0_40px_rgba(168,85,247,0.7),0_0_80px_rgba(236,72,153,0.5)] transition-all hover:scale-105"
                      onClick={togglePlay}
                    >
                      {isPlaying ? (
                        <Pause className="h-7 w-7 fill-current" />
                      ) : (
                        <Play className="h-7 w-7 fill-current ml-1" />
                      )}
                    </Button>
                    
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={playNext}
                      className="h-12 w-12 text-white hover:bg-white/10"
                    >
                      <SkipForward className="h-6 w-6 fill-current" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={toggleRepeat}
                      className={`h-10 w-10 ${isRepeat ? "text-purple-400" : "text-white/60"}`}
                    >
                      <Repeat className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="flex items-center justify-around mt-8">
                  <div className="relative">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={handleVolumeClick}
                      className="h-12 w-12 text-white/60 hover:text-white"
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
                        <div 
                          className="fixed inset-0 z-40" 
                          onClick={() => setShowVolumeSlider(false)}
                        />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 bg-black/90 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-white/10 z-50 w-48">
                          <div className="flex flex-col items-center gap-3">
                            <span className="text-xs text-white/70 font-medium">Volume</span>
                            <div className="flex items-center gap-3 w-full">
                              <VolumeX className="h-4 w-4 text-white/60" />
                              <Slider
                                value={[isMuted ? 0 : volume]}
                                onValueChange={([value]) => {
                                  setVolume(value);
                                  if (value > 0 && isMuted) toggleMute();
                                }}
                                max={100}
                                step={1}
                                className="flex-1 [&_[role=slider]]:bg-purple-500 [&_[role=slider]]:border-purple-500"
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
                    className="h-12 w-12 text-white/60 hover:text-white"
                  >
                    <MessageSquare className="h-5 w-5" />
                  </Button>
                </div>

                {/* Lyrics Button - Curved Tab */}
                <div className="mt-auto pt-6">
                  <button
                    onClick={() => setShowLyrics(true)}
                    className="w-full bg-white/10 backdrop-blur-lg rounded-t-[2rem] py-4 text-center text-white/80 hover:text-white hover:bg-white/15 transition-colors border-t border-x border-white/20"
                  >
                    <Music className="h-5 w-5 inline-block mr-2" />
                    Lyrics
                  </button>
                </div>
              </div>
            ) : (
              /* Desktop Layout */
              <div className="w-full h-full flex flex-col items-center justify-center px-8">
                <div className="flex items-center justify-center gap-12 lg:gap-20 mb-8">
                  {/* Frosted Glass Card with Circular Artwork */}
                  <div className="bg-white/10 backdrop-blur-xl rounded-[2rem] p-10 border border-white/20 shadow-2xl">
                    <div className="relative mb-8">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-3xl opacity-40" />
                      <img
                        src={currentSong.image}
                        alt={currentSong.title}
                        className="relative w-64 h-64 lg:w-72 lg:h-72 rounded-full object-cover border-4 border-white/20 shadow-[0_0_50px_rgba(168,85,247,0.4)]"
                      />
                    </div>
                    
                    {/* Song Info */}
                    <div className="text-center">
                      <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2 truncate max-w-[280px]">
                        {currentSong.title}
                      </h2>
                      <p className="text-white/70 text-lg">
                        {currentSong.artist}
                      </p>
                    </div>
                  </div>

                  {/* Ad Section */}
                  {activeAd && (
                    <div className="w-60 h-80 lg:w-72 lg:h-96 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
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
                <div className="w-full max-w-5xl">
                  <div className="bg-black/50 backdrop-blur-xl rounded-2xl px-8 py-5 border border-white/10">
                    <div className="flex items-center gap-6">
                      {/* Left: Song Info */}
                      <div className="flex items-center gap-4 min-w-[220px]">
                        <img
                          src={currentSong.image}
                          alt={currentSong.title}
                          className="w-14 h-14 rounded-lg object-cover border border-white/10"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-white truncate">
                            {currentSong.title}
                          </h4>
                          <p className="text-xs text-white/60 truncate">
                            {currentSong.artist}
                          </p>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={handleLike}
                          disabled={isLoading}
                          className="h-8 w-8 text-white/60 hover:text-pink-400"
                        >
                          <Heart className={`h-4 w-4 ${isLiked ? "fill-pink-400 text-pink-400" : ""}`} />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setShowComments(true)}
                          className="h-8 w-8 text-white/60 hover:text-white"
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Center: Playback Controls */}
                      <div className="flex-1 flex flex-col gap-3 items-center">
                        <div className="flex items-center gap-4">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={toggleShuffle}
                            className={`h-8 w-8 ${isShuffle ? "text-purple-400" : "text-white/60 hover:text-white"}`}
                          >
                            <Shuffle className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={playPrevious}
                            className="h-9 w-9 text-white hover:bg-white/10"
                          >
                            <SkipBack className="h-5 w-5 fill-current" />
                          </Button>
                          
                          {/* Glowing Play Button */}
                          <Button
                            size="icon"
                            className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 text-white shadow-[0_0_25px_rgba(168,85,247,0.5)] hover:shadow-[0_0_35px_rgba(168,85,247,0.7)] transition-all hover:scale-105"
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
                            className="h-9 w-9 text-white hover:bg-white/10"
                          >
                            <SkipForward className="h-5 w-5 fill-current" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={toggleRepeat}
                            className={`h-8 w-8 ${isRepeat ? "text-purple-400" : "text-white/60 hover:text-white"}`}
                          >
                            <Repeat className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="flex items-center gap-3 w-full max-w-xl">
                          <span className="text-xs text-white/60 tabular-nums min-w-[40px]">
                            {formatTime(currentTime)}
                          </span>
                          <Slider
                            value={[currentTime]}
                            onValueChange={([value]) => seekTo(value)}
                            max={duration || 100}
                            step={1}
                            className="flex-1 [&_[role=slider]]:bg-purple-500 [&_[role=slider]]:border-purple-400 [&_[role=slider]]:shadow-[0_0_8px_rgba(168,85,247,0.5)] [&_>.relative]:bg-white/20"
                          />
                          <span className="text-xs text-white/60 tabular-nums min-w-[40px] text-right">
                            {duration ? formatTime(duration) : "0:00"}
                          </span>
                        </div>
                      </div>

                      {/* Right: Volume & Lyrics */}
                      <div className="flex items-center gap-3 min-w-[180px] justify-end">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setShowLyrics(true)}
                          className="text-white/60 hover:text-white text-xs"
                        >
                          <Music className="h-4 w-4 mr-1" />
                          Lyrics
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={toggleMute}
                          className="h-8 w-8 text-white/60 hover:text-white"
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
                          className="w-24 [&_[role=slider]]:bg-purple-500 [&_[role=slider]]:border-purple-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
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
