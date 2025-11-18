import { Play, Heart, MoreVertical } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Song } from "@/lib/sampleSongs";

interface SongCardProps {
  song: Song;
  onPlay?: (song: Song) => void;
}

const SongCard = ({ song, onPlay }: SongCardProps) => {
  if (!song) {
    return null;
  }

  return (
    <Card className="group relative overflow-hidden bg-gradient-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-glow">
      <div className="relative aspect-square overflow-hidden">
        <img
          src={song.image}
          alt={song.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <Button
          size="icon"
          className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-primary hover:bg-primary/90 shadow-glow"
          onClick={() => onPlay?.(song)}
        >
          <Play className="w-5 h-5 fill-current" />
        </Button>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-foreground truncate mb-1">{song.title}</h3>
        <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
        <p className="text-xs text-muted-foreground mt-2">
          {song.plays.toLocaleString()} plays
        </p>
      </div>
      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          size="icon"
          variant="secondary"
          className="h-8 w-8 bg-background/80 backdrop-blur-sm"
        >
          <Heart className="w-4 h-4" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          className="h-8 w-8 bg-background/80 backdrop-blur-sm"
        >
          <MoreVertical className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};

export default SongCard;
