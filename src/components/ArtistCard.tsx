import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Artist {
  id: string | number;
  name: string;
  image: string;
  followers: string | number;
  genre?: string;
  verified?: boolean;
}

interface ArtistCardProps {
  artist: Artist;
}

const ArtistCard = ({ artist }: ArtistCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="group overflow-hidden hover:shadow-glow transition-all duration-300 cursor-pointer">
      <div className="relative aspect-square overflow-hidden">
        <img
          src={artist.image}
          alt={artist.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="p-2 md:p-4">
        <h3 className="font-bold text-sm md:text-lg mb-0.5 md:mb-1 truncate">{artist.name}</h3>
        {artist.genre && <p className="text-xs md:text-sm text-muted-foreground mb-1 md:mb-2 truncate">{artist.genre}</p>}
        <div className="flex items-center justify-between gap-1">
          <div className="flex items-center gap-1 text-xs md:text-sm text-muted-foreground">
            <Users className="w-3 h-3 md:w-4 md:h-4" />
            <span>{artist.followers}</span>
          </div>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => navigate(`/artist/${artist.id}`)}
            className="text-[10px] md:text-xs h-7 md:h-8 px-2 md:px-3"
          >
            View
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ArtistCard;
