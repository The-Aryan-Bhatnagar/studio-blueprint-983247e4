import ArtistCard from "@/components/ArtistCard";
import SongCard from "@/components/SongCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { sampleSongs } from "@/lib/sampleSongs";
import { sampleArtists } from "@/lib/sampleArtists";
import { usePlayer } from "@/contexts/PlayerContext";
import { useToast } from "@/hooks/use-toast";

const Discover = () => {
  const navigate = useNavigate();
  const { playSong, setQueue } = usePlayer();
  const { toast } = useToast();

  const trendingSongs = sampleSongs.slice(0, 4);
  const newReleases = sampleSongs.slice(4, 8);
  const recommendedToday = sampleSongs.slice(2, 6);
  const biggestHits = sampleSongs.slice(0, 4);

  const handlePlaySong = (song: typeof sampleSongs[0]) => {
    setQueue(sampleSongs);
    playSong(song);
    toast({
      title: "Now Playing",
      description: `${song.title} by ${song.artist}`,
    });
  };

  return (
    <div className="min-h-screen pb-32">
      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden rounded-2xl mb-12 bg-gradient-hero">
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent" />
        <div className="relative h-full flex flex-col justify-center px-12">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Discover Amazing Artists
          </h1>
          <p className="text-xl text-muted-foreground mb-6 max-w-2xl">
            Connect with talented artists and stream their music from around the world
          </p>
          <div className="flex gap-4">
            <Button
              size="lg"
              className="bg-gradient-primary hover:shadow-glow transition-all"
              onClick={() => navigate("/search")}
            >
              Explore Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate("/artist/signup")}
            >
              Become an Artist
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Artists Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">Featured Artists</h2>
          <Button variant="ghost" className="text-primary">
            See all
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sampleArtists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      </section>

      {/* Trending Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">Trending Now</h2>
          <Button variant="ghost" className="text-primary">
            See all
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingSongs.map((song) => (
            <SongCard key={song.id} song={song} onPlay={handlePlaySong} />
          ))}
        </div>
      </section>

      {/* Recommended for Today */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">Recommended for Today</h2>
          <Button variant="ghost" className="text-primary">
            See all
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendedToday.map((song) => (
            <SongCard key={song.id} song={song} onPlay={handlePlaySong} />
          ))}
        </div>
      </section>

      {/* Today's Biggest Hits */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">Today's Biggest Hits</h2>
          <Button variant="ghost" className="text-primary">
            See all
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {biggestHits.map((song) => (
            <SongCard key={song.id} song={song} onPlay={handlePlaySong} />
          ))}
        </div>
      </section>

      {/* Discover Picks for You */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">Discover Picks for You</h2>
          <Button variant="ghost" className="text-primary">
            See all
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newReleases.map((song) => (
            <SongCard key={song.id} song={song} onPlay={handlePlaySong} />
          ))}
        </div>
      </section>

      {/* Ad Banner */}
      <section className="bg-gradient-primary rounded-2xl p-8 text-center">
        <h3 className="text-2xl font-bold mb-2">Join GreenBox Community</h3>
        <p className="text-lg mb-4 opacity-90">
          Connect with artists, discover new music, and be part of the community
        </p>
        <Button
          size="lg"
          variant="secondary"
          onClick={() => navigate("/auth/signup")}
        >
          Sign Up Free
        </Button>
      </section>
    </div>
  );
};

export default Discover;
