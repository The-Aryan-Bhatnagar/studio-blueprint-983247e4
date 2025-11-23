import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Maximize2 } from "lucide-react";
import { usePlayer } from "@/contexts/PlayerContext";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "./ProgressBar";
import { VolumeControl } from "./VolumeControl";

export function MiniPlayer() {
  const {
    currentSong,
    isPlaying,
    togglePlay,
    playNext,
    playPrevious,
    isShuffle,
    isRepeat,
    toggleShuffle,
    toggleRepeat,
    setFullScreenOpen,
  } = usePlayer();

  if (!currentSong) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-lg border-t border-border z-40">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Track Info */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <img
              src={currentSong.image}
              alt={currentSong.title}
              className="w-12 h-12 rounded object-cover flex-shrink-0"
            />
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{currentSong.title}</p>
              <p className="text-xs text-muted-foreground truncate">{currentSong.artist}</p>
            </div>
          </div>

          {/* Center: Player Controls */}
          <div className="flex flex-col items-center gap-2 flex-1 max-w-2xl">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleShuffle}
                className={`h-8 w-8 ${isShuffle ? "text-primary" : ""}`}
              >
                <Shuffle className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={playPrevious}
                className="h-8 w-8"
              >
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button
                variant="default"
                size="icon"
                onClick={togglePlay}
                className="h-10 w-10 rounded-full"
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" fill="currentColor" />
                ) : (
                  <Play className="h-5 w-5 ml-0.5" fill="currentColor" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={playNext}
                className="h-8 w-8"
              >
                <SkipForward className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleRepeat}
                className={`h-8 w-8 ${isRepeat ? "text-primary" : ""}`}
              >
                <Repeat className="h-4 w-4" />
              </Button>
            </div>
            <div className="w-full">
              <ProgressBar />
            </div>
          </div>

          {/* Right: Volume & Expand */}
          <div className="flex items-center gap-2 justify-end flex-1">
            <VolumeControl />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setFullScreenOpen(true)}
              className="h-8 w-8 hover:bg-accent ml-2"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
