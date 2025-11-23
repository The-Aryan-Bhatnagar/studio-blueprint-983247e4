import { X, Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Volume2, Heart, ChevronDown, MoreVertical, Share2, ListMusic, VolumeX } from "lucide-react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { usePlayer } from "@/contexts/PlayerContext";
import { useSongLikes } from "@/hooks/useSongLikes";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { AddToPlaylistDialog } from "./AddToPlaylistDialog";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

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
  const [showPlaylistDialog, setShowPlaylistDialog] = useState(false);
  const [showVolumePopover, setShowVolumePopover] = useState(false);

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

  const handleShare = async () => {
    const songUrl = `${window.location.origin}/?song=${currentSong?.id}`;
    try {
      await navigator.clipboard.writeText(songUrl);
      toast({
        title: "Link Copied!",
        description: "Song link has been copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Share Link",
        description: songUrl,
      });
    }
  };

  const handleAddToPlaylist = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to add songs to playlists",
        variant: "destructive",
      });
      return;
    }
    setShowPlaylistDialog(true);
  };

  if (!isFullScreenOpen || !currentSong) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-gradient-to-br from-primary/10 via-background to-secondary/10 animate-fade-in">
      {/* Animated Background Blur */}
      <div className="absolute inset-0 backdrop-blur-3xl" />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

      {/* Ad Banner - Top */}
      {showAd && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-5xl px-6 z-20 animate-fade-in">
          <div className="relative overflow-hidden bg-gradient-to-r from-primary/20 via-primary/10 to-secondary/20 border border-primary/30 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-secondary/20 rounded-full blur-3xl" />
            
            <div className="relative flex items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/30 rounded-xl blur-lg" />
                  <div className="relative w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-sm font-black text-primary-foreground tracking-wider">AD</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-lg text-foreground">Unlock Premium Features</h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    Ad-free listening, unlimited skips, and high-quality audio
                  </p>
                </div>
              </div>
              <Button 
                size="lg" 
                className="relative overflow-hidden bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-semibold px-8 shadow-lg hover:shadow-primary/50 transition-all"
              >
                <span className="relative z-10">Upgrade Now</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Header Bar */}
      <div className="relative z-10 flex items-center justify-between px-8 py-6">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setFullScreenOpen(false)}
          className="hover:bg-background/80 hover:scale-110 transition-all rounded-full h-12 w-12"
        >
          <ChevronDown className="w-6 h-6" />
        </Button>

        <div className="flex items-center gap-2">
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={handleShare}
            className="hover:bg-background/80 rounded-full h-10 w-10"
          >
            <Share2 className="w-5 h-5" />
          </Button>
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={handleAddToPlaylist}
            className="hover:bg-background/80 rounded-full h-10 w-10"
          >
            <ListMusic className="w-5 h-5" />
          </Button>
          
          <Popover open={showVolumePopover} onOpenChange={setShowVolumePopover}>
            <PopoverTrigger asChild>
              <Button 
                size="icon" 
                variant="ghost" 
                className="hover:bg-background/80 rounded-full h-10 w-10"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-4" align="end">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Volume</span>
                  <span className="text-sm text-muted-foreground">{isMuted ? 0 : volume}%</span>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={toggleMute}
                    className="h-8 w-8"
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-4 h-4" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </Button>
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    onValueChange={([value]) => {
                      setVolume(value);
                      if (isMuted && value > 0) toggleMute();
                    }}
                    max={100}
                    step={1}
                    className="flex-1"
                  />
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button 
                size="icon" 
                variant="ghost" 
                className="hover:bg-background/80 rounded-full h-10 w-10"
              >
                <MoreVertical className="w-5 h-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2" align="end">
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start h-auto py-2 px-3"
                  onClick={handleShare}
                >
                  <Share2 className="w-4 h-4 mr-3" />
                  <span className="text-sm">Share Song</span>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-auto py-2 px-3"
                  onClick={handleAddToPlaylist}
                >
                  <ListMusic className="w-4 h-4 mr-3" />
                  <span className="text-sm">Add to Playlist</span>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-auto py-2 px-3"
                  onClick={handleLike}
                >
                  <Heart className={`w-4 h-4 mr-3 ${isLiked ? "fill-primary text-primary" : ""}`} />
                  <span className="text-sm">{isLiked ? "Remove from Liked" : "Like Song"}</span>
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-8 h-[calc(100vh-120px)] flex flex-col items-center justify-center">
        <div className="w-full max-w-2xl space-y-10">
          {/* Album Art with Shadow Effect */}
          <div className="relative mx-auto max-w-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-primary/20 to-secondary/30 rounded-3xl blur-3xl scale-95" />
            <div className="relative aspect-square w-full rounded-3xl overflow-hidden shadow-2xl animate-scale-in ring-1 ring-white/10">
              <img
                src={currentSong.image}
                alt={currentSong.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </div>
          </div>

          {/* Song Info with Genre Badge */}
          <div className="text-center space-y-3 px-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              {currentSong.genre && (
                <Badge variant="secondary" className="text-xs font-medium px-3 py-1">
                  {currentSong.genre}
                </Badge>
              )}
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground tracking-tight leading-tight">
              {currentSong.title}
            </h1>
            <p className="text-2xl text-muted-foreground font-medium">
              {currentSong.artist}
            </p>
          </div>

          {/* Progress Bar with Enhanced Styling */}
          <div className="space-y-3 px-4">
            <Slider
              value={[currentTime]}
              onValueChange={([value]) => seekTo(value)}
              max={duration || 100}
              step={1}
              className="w-full cursor-pointer"
            />
            <div className="flex justify-between text-sm font-medium text-muted-foreground">
              <span className="tabular-nums">{formatTime(currentTime)}</span>
              <span className="tabular-nums">{duration ? formatTime(duration) : "0:00"}</span>
            </div>
          </div>

          {/* Main Controls with Better Spacing */}
          <div className="flex items-center justify-center gap-8 px-4">
            <Button
              size="icon"
              variant="ghost"
              onClick={toggleShuffle}
              className={`hover:bg-background/80 rounded-full h-12 w-12 transition-all ${
                isShuffle ? "text-primary bg-primary/20 hover:bg-primary/30" : ""
              }`}
            >
              <Shuffle className="w-5 h-5" />
            </Button>
            
            <Button
              size="icon"
              variant="ghost"
              onClick={playPrevious}
              className="hover:bg-background/80 hover:scale-110 transition-all rounded-full h-14 w-14"
            >
              <SkipBack className="w-7 h-7 fill-current" />
            </Button>

            <Button
              size="icon"
              className="h-20 w-20 bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 hover:scale-105 transition-all rounded-full shadow-2xl shadow-primary/50"
              onClick={togglePlay}
            >
              {isPlaying ? (
                <Pause className="w-9 h-9 fill-current" />
              ) : (
                <Play className="w-9 h-9 fill-current ml-1" />
              )}
            </Button>

            <Button
              size="icon"
              variant="ghost"
              onClick={playNext}
              className="hover:bg-background/80 hover:scale-110 transition-all rounded-full h-14 w-14"
            >
              <SkipForward className="w-7 h-7 fill-current" />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              onClick={toggleRepeat}
              className={`hover:bg-background/80 rounded-full h-12 w-12 transition-all ${
                isRepeat ? "text-primary bg-primary/20 hover:bg-primary/30" : ""
              }`}
            >
              <Repeat className="w-5 h-5" />
            </Button>
          </div>

          {/* Like Button Centered */}
          <div className="flex items-center justify-center px-4">
            <Button
              size="icon"
              variant="ghost"
              onClick={handleLike}
              disabled={isLoading}
              className="hover:bg-background/80 hover:scale-110 transition-all rounded-full h-14 w-14"
            >
              <Heart className={`w-7 h-7 transition-all ${isLiked ? "fill-primary text-primary scale-110" : ""}`} />
            </Button>
          </div>
        </div>
      </div>

      {/* Add to Playlist Dialog */}
      {showPlaylistDialog && currentSong && (
        <AddToPlaylistDialog
          open={showPlaylistDialog}
          onOpenChange={setShowPlaylistDialog}
          songId={currentSong.id.toString()}
        />
      )}
    </div>
  );
};

export default FullScreenPlayer;
