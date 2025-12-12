import { Play, Heart, MessageCircle, Headphones, SkipBack, SkipForward } from "lucide-react";
import { Card } from "./ui/card";

interface ArtistSongListItemProps {
  song: any;
  index: number;
  onPlay?: (song: any) => void;
  onPrevious?: () => void;
  onNext?: () => void;
}

const ArtistSongListItem = ({ song, index, onPlay, onPrevious, onNext }: ArtistSongListItemProps) => {
  if (!song) return null;

  const coverImage = song.cover_image_url || "/placeholder.svg";
  const plays = song.song_analytics?.total_plays || 0;
  const likes = song.song_analytics?.total_likes || 0;
  const comments = song.song_analytics?.total_comments || 0;
  const artistName = song.artist_profiles?.stage_name || song.artist || null;

  return (
    <Card 
      className="flex items-center gap-3 p-3 bg-card border-border hover:bg-muted/50 active:bg-muted transition-colors cursor-pointer"
      onClick={() => onPlay?.(song)}
    >
      {/* Index Number */}
      <span className="text-sm font-medium text-muted-foreground w-5 text-center flex-shrink-0">
        {index}
      </span>
      
      {/* Song Cover */}
      <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
        <img
          src={coverImage}
          alt={song.title}
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Song Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-foreground truncate text-sm">{song.title}</h3>
        <p className="text-xs text-muted-foreground truncate">
          {artistName || "Unknown Artist"}
        </p>
        
        {/* Stats Row */}
        <div className="flex items-center gap-3 mt-1">
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

      {/* Navigation Buttons - Always visible */}
      <div className="flex items-center gap-0.5 flex-shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrevious?.();
          }}
          className="p-1.5 rounded-full border border-border hover:bg-muted active:bg-muted/80 transition-colors"
        >
          <SkipBack className="w-4 h-4 text-foreground fill-current" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext?.();
          }}
          className="p-1.5 rounded-full border border-border hover:bg-muted active:bg-muted/80 transition-colors"
        >
          <SkipForward className="w-4 h-4 text-foreground fill-current" />
        </button>
      </div>
    </Card>
  );
};

export default ArtistSongListItem;
