import { X, Play, Pause, SkipBack, SkipForward, Shuffle, Repeat } from "lucide-react";
import { usePlayer } from "@/contexts/PlayerContext";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "./player/ProgressBar";
import { VolumeControl } from "./player/VolumeControl";
import { PlaylistView } from "./player/PlaylistView";

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
  } = usePlayer();

  if (!isFullScreenOpen || !currentSong) return null;

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col lg:flex-row">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-border">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setFullScreenOpen(false)}
            className="hover:bg-accent h-8 w-8 md:h-10 md:w-10"
          >
            <X className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
          <div className="text-center">
            <p className="text-xs md:text-sm text-muted-foreground">Playing from playlist</p>
            <p className="text-xs md:text-sm font-medium">Current Queue</p>
          </div>
          <div className="w-8 md:w-10" /> {/* Spacer for centering */}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Album Art & Controls */}
          <div className="flex-1 flex flex-col items-center justify-center px-4 py-6 md:px-16 md:py-8 lg:px-32">
            <div className="w-full max-w-5xl mx-auto space-y-4 md:space-y-6 lg:space-y-8">
              {/* Album Art - Responsive sizes: 192px (phone), 256px (tablet), 320px (desktop) */}
              <div className="w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 mx-auto">
                <img
                  src={currentSong.image}
                  alt={currentSong.title}
                  className="w-full h-full object-cover rounded-lg shadow-2xl"
                />
              </div>

              {/* Track Info */}
              <div className="text-center space-y-1 md:space-y-2">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold truncate px-4">
                  {currentSong.title}
                </h1>
                <p className="text-base md:text-lg lg:text-xl text-muted-foreground truncate px-4">
                  {currentSong.artist}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full px-2 md:px-0">
                <ProgressBar />
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-3 md:gap-4 lg:gap-6">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleShuffle}
                  className={`h-8 w-8 md:h-9 md:w-9 lg:h-10 lg:w-10 ${isShuffle ? "text-primary" : ""}`}
                >
                  <Shuffle className="h-4 w-4 md:h-4.5 md:w-4.5 lg:h-5 lg:w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={playPrevious}
                  className="h-10 w-10 md:h-11 md:w-11 lg:h-12 lg:w-12"
                >
                  <SkipBack className="h-5 w-5 md:h-5.5 md:w-5.5 lg:h-6 lg:w-6" />
                </Button>
                <Button
                  size="icon"
                  onClick={togglePlay}
                  className="h-12 w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 rounded-full"
                >
                  {isPlaying ? (
                    <Pause className="h-6 w-6 md:h-7 md:w-7 lg:h-8 lg:w-8" fill="currentColor" />
                  ) : (
                    <Play className="h-6 w-6 md:h-7 md:w-7 lg:h-8 lg:w-8 ml-0.5" fill="currentColor" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={playNext}
                  className="h-10 w-10 md:h-11 md:w-11 lg:h-12 lg:w-12"
                >
                  <SkipForward className="h-5 w-5 md:h-5.5 md:w-5.5 lg:h-6 lg:w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleRepeat}
                  className={`h-8 w-8 md:h-9 md:w-9 lg:h-10 lg:w-10 ${isRepeat ? "text-primary" : ""}`}
                >
                  <Repeat className="h-4 w-4 md:h-4.5 md:w-4.5 lg:h-5 lg:w-5" />
                </Button>
              </div>

              {/* Volume */}
              <div className="flex justify-center">
                <VolumeControl />
              </div>
            </div>
          </div>

          {/* Right: Playlist - Hidden on mobile and tablet, shown on desktop */}
          <div className="hidden lg:block w-96 border-l border-border bg-muted/30">
            <PlaylistView />
          </div>
        </div>
      </div>
    </div>
  );
}

export default FullScreenPlayer;
