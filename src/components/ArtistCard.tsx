import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Artist {
  id: number;
  name: string;
  image: string;
  followers: string;
  genre: string;
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
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1">{artist.name}</h3>
        <p className="text-sm text-muted-foreground mb-2">{artist.genre}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>{artist.followers}</span>
          </div>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => navigate("/artist")}
          >
            View Profile
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ArtistCard;
