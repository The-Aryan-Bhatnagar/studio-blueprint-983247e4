import { Play, Heart, MessageCircle, Headphones } from "lucide-react";
import { Card } from "./ui/card";

interface ArtistSongListItemProps {
  song: any;
  index: number;
  onPlay?: (song: any) => void;
}

const ArtistSongListItem = ({ song, index, onPlay }: ArtistSongListItemProps) => {
  if (!song) return null;

  const coverImage = song.cover_image_url || "/placeholder.svg";
  const plays = song.song_analytics?.total_plays || 0;
  const likes = song.song_analytics?.total_likes || 0;
  const comments = song.song_analytics?.total_comments || 0;
  const category = song.genre || song.category || null;

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
  );
};

export default ArtistSongListItem;
