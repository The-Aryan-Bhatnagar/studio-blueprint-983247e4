import { Play, Heart, MoreVertical } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddToPlaylistDialog } from "@/components/AddToPlaylistDialog";
import { useState } from "react";

interface SongCardProps {
  song: any;
  onPlay?: (song: any) => void;
}

const SongCard = ({ song, onPlay }: SongCardProps) => {
  const [showPlaylistDialog, setShowPlaylistDialog] = useState(false);
  
  if (!song) {
    return null;
  }

  const artistName = song.artist_profiles?.stage_name || song.artist || "Unknown Artist";
  const coverImage = song.cover_image_url || song.image || "/placeholder.svg";
  const plays = song.song_analytics?.total_plays || song.plays || 0;

  return (
    <Card className="group relative overflow-hidden bg-gradient-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-glow">
      <div className="relative aspect-square overflow-hidden">
        <img
          src={coverImage}
          alt={song.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <Button
          size="icon"
          className="absolute bottom-2 right-2 md:bottom-4 md:right-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-primary hover:bg-primary/90 shadow-glow h-8 w-8 md:h-10 md:w-10"
          onClick={() => onPlay?.(song)}
        >
          <Play className="w-4 h-4 md:w-5 md:h-5 fill-current" />
        </Button>
      </div>
      <div className="p-2 md:p-4">
        <h3 className="font-semibold text-foreground truncate mb-0.5 md:mb-1 text-sm md:text-base">{song.title}</h3>
        <p className="text-xs md:text-sm text-muted-foreground truncate">{artistName}</p>
        <p className="text-[10px] md:text-xs text-muted-foreground mt-1 md:mt-2">
          {plays.toLocaleString()} plays
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8 bg-background/80 backdrop-blur-sm"
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setShowPlaylistDialog(true)}>
              Add to Playlist
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {showPlaylistDialog && (
          <AddToPlaylistDialog 
            songId={song.id} 
            trigger={<div style={{ display: 'none' }} />}
          />
        )}
      </div>
    </Card>
  );
};

export default SongCard;
