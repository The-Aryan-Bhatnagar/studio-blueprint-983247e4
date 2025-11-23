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
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-lg">Queue</h3>
        <p className="text-xs text-muted-foreground mt-1">{queue.length} songs</p>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-2 p-4">
          {queue.map((song, index) => (
            <div
              key={`${song.id}-${index}`}
              onClick={() => playSong(song)}
              className={cn(
                "group flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200",
                currentSong?.id === song.id 
                  ? "bg-primary/10 border border-primary/20" 
                  : "hover:bg-accent/50 border border-transparent"
              )}
            >
              <div className="relative flex-shrink-0">
                <img
                  src={song.image}
                  alt={song.title}
                  className="w-14 h-14 rounded-md object-cover shadow-md"
                />
                {currentSong?.id === song.id ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-primary/80 rounded-md">
                    <div className="bg-background rounded-full p-1.5">
                      <Play className="h-4 w-4 text-primary" fill="currentColor" />
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-primary rounded-full p-1.5">
                      <Play className="h-4 w-4 text-primary-foreground" fill="currentColor" />
                    </div>
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
                <p className="text-xs text-muted-foreground truncate mt-0.5">
                  {song.artist}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
