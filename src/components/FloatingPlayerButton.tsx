import { usePlayer } from "@/contexts/PlayerContext";
import { Button } from "./ui/button";
import { Play, Pause } from "lucide-react";

const FloatingPlayerButton = () => {
  const { currentSong, isPlaying, setFullScreenOpen, togglePlay } = usePlayer();

  if (!currentSong) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
      <div className="flex items-center gap-3 bg-background/95 backdrop-blur-lg border border-border rounded-full shadow-2xl pr-4 hover:scale-105 transition-all">
        {/* Album Art */}
        <button
          onClick={() => setFullScreenOpen(true)}
          className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0 hover:opacity-80 transition-opacity"
        >
          <img
            src={currentSong.image}
            alt={currentSong.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </button>

        {/* Song Info */}
        <button
          onClick={() => setFullScreenOpen(true)}
          className="flex flex-col items-start min-w-0 hover:opacity-80 transition-opacity"
        >
          <p className="text-sm font-semibold text-foreground truncate max-w-[200px]">
            {currentSong.title}
          </p>
          <p className="text-xs text-muted-foreground truncate max-w-[200px]">
            {currentSong.artist}
          </p>
        </button>

        {/* Play/Pause Button */}
        <Button
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            togglePlay();
          }}
          className="h-10 w-10 rounded-full bg-primary hover:bg-primary/90 flex-shrink-0"
        >
          {isPlaying ? (
            <Pause className="h-5 w-5 fill-current" />
          ) : (
            <Play className="h-5 w-5 fill-current ml-0.5" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default FloatingPlayerButton;
