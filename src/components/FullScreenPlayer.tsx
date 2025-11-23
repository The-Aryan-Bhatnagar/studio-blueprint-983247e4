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
    <div className="fixed inset-0 bg-background z-50 flex">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setFullScreenOpen(false)}
            className="hover:bg-accent"
          >
            <X className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Playing from playlist</p>
            <p className="text-sm font-medium">Current Queue</p>
          </div>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Album Art & Controls */}
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <div className="w-full max-w-2xl space-y-8">
              {/* Album Art */}
              <div className="aspect-square w-full max-w-md mx-auto">
                <img
                  src={currentSong.image}
                  alt={currentSong.title}
                  className="w-full h-full object-cover rounded-lg shadow-2xl"
                />
              </div>

              {/* Track Info */}
              <div className="text-center space-y-2">
                <h1 className="text-4xl font-bold">{currentSong.title}</h1>
                <p className="text-xl text-muted-foreground">{currentSong.artist}</p>
              </div>

              {/* Progress Bar */}
              <div className="w-full">
                <ProgressBar />
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-6">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleShuffle}
                  className={`h-10 w-10 ${isShuffle ? "text-primary" : ""}`}
                >
                  <Shuffle className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={playPrevious}
                  className="h-12 w-12"
                >
                  <SkipBack className="h-6 w-6" />
                </Button>
                <Button
                  size="icon"
                  onClick={togglePlay}
                  className="h-16 w-16 rounded-full"
                >
                  {isPlaying ? (
                    <Pause className="h-8 w-8" fill="currentColor" />
                  ) : (
                    <Play className="h-8 w-8 ml-1" fill="currentColor" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={playNext}
                  className="h-12 w-12"
                >
                  <SkipForward className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleRepeat}
                  className={`h-10 w-10 ${isRepeat ? "text-primary" : ""}`}
                >
                  <Repeat className="h-5 w-5" />
                </Button>
              </div>

              {/* Volume */}
              <div className="flex justify-center">
                <VolumeControl />
              </div>
            </div>
          </div>

          {/* Right: Playlist */}
          <div className="w-96 border-l border-border bg-muted/30">
            <PlaylistView />
          </div>
        </div>
      </div>
    </div>
  );
}

export default FullScreenPlayer;
