import { Play, Heart, MoreVertical, MessageCircle, Headphones } from "lucide-react";
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
  index?: number;
}

const SongCard = ({ song, onPlay, index }: SongCardProps) => {
  const [showPlaylistDialog, setShowPlaylistDialog] = useState(false);
  
  if (!song) {
    return null;
  }

  const artistName = song.artist_profiles?.stage_name || song.artist || "Unknown Artist";
  const coverImage = song.cover_image_url || song.image || "/placeholder.svg";
  const plays = song.song_analytics?.total_plays || song.plays || 0;
  const likes = song.song_analytics?.total_likes || 0;
  const comments = song.song_analytics?.total_comments || 0;
  const category = song.genre || song.category || null;

  return (
    <>
      {/* Mobile Layout - List Style */}
      <Card 
        className="md:hidden flex items-center gap-3 p-3 bg-card border-border hover:bg-muted/50 active:bg-muted transition-colors cursor-pointer"
        onClick={() => onPlay?.(song)}
      >
        {/* Index Number */}
        {index !== undefined && (
          <span className="text-sm font-medium text-muted-foreground w-5 text-center flex-shrink-0">
            {index}
          </span>
        )}
        
        {/* Song Cover */}
        <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
          <img
            src={coverImage}
            alt={song.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 active:opacity-100">
            <Play className="w-5 h-5 text-white fill-current" />
          </div>
        </div>
        
        {/* Song Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate text-sm">{song.title}</h3>
          {category && (
            <p className="text-xs text-muted-foreground truncate">{category}</p>
          )}
          
          {/* Stats Row */}
          <div className="flex items-center gap-3 mt-1.5">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Heart className="w-3 h-3" />
              <span>{likes}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MessageCircle className="w-3 h-3" />
              <span>{comments}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Headphones className="w-3 h-3" />
              <span>{plays.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Desktop/Tablet Layout - Card Style */}
      <Card className="hidden md:block group relative overflow-hidden bg-gradient-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-glow">
        <div className="relative aspect-square overflow-hidden">
          <img
            src={coverImage}
            alt={song.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Button
            size="icon"
            className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-primary hover:bg-primary/90 shadow-glow h-10 w-10"
            onClick={() => onPlay?.(song)}
          >
            <Play className="w-5 h-5 fill-current" />
          </Button>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-foreground truncate mb-1">{song.title}</h3>
          <p className="text-sm text-muted-foreground truncate">{artistName}</p>
          <p className="text-xs text-muted-foreground mt-2">
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
    </>
  );
};

export default SongCard;
