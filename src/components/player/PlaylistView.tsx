import { usePlayer } from "@/contexts/PlayerContext";
import { Play } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export function PlaylistView() {
  const { queue, currentSong, playSong } = usePlayer();

  if (queue.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        No songs in queue
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-1 p-4">
        <h3 className="font-semibold mb-4">Queue ({queue.length})</h3>
        {queue.map((song, index) => (
          <div
            key={`${song.id}-${index}`}
            onClick={() => playSong(song)}
            className={cn(
              "flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-accent transition-colors",
              currentSong?.id === song.id && "bg-accent"
            )}
          >
            <div className="relative flex-shrink-0">
              <img
                src={song.image}
                alt={song.title}
                className="w-12 h-12 rounded object-cover"
              />
              {currentSong?.id === song.id && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded">
                  <Play className="h-5 w-5 text-white" fill="white" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className={cn(
                "text-sm font-medium truncate",
                currentSong?.id === song.id && "text-primary"
              )}>
                {song.title}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {song.artist}
              </p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
