import ArtistCard from "@/components/ArtistCard";
import SongCard from "@/components/SongCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePlayer } from "@/contexts/PlayerContext";
import { useToast } from "@/hooks/use-toast";
import { usePublicSongs, usePublicArtists } from "@/hooks/usePublicSongs";
import { Skeleton } from "@/components/ui/skeleton";
import AdsBannerCarousel from "@/components/AdsBannerCarousel";
const Discover = () => {
  const navigate = useNavigate();
  const { playSong, setQueue } = usePlayer();
  const { toast } = useToast();
  const { data: songs = [], isLoading: songsLoading } = usePublicSongs();
  const { data: artists = [], isLoading: artistsLoading } = usePublicArtists();

  const trendingSongs = songs.slice(0, 4);
  const newReleases = songs.slice(4, 8);
  const recommendedToday = songs.slice(2, 6);
  const biggestHits = songs.slice(0, 4);

  const handlePlaySong = (song: any) => {
    const formattedSongs = songs.map(s => ({
      id: s.id,
      title: s.title,
      artist: s.artist_profiles?.stage_name || "Unknown Artist",
      image: s.cover_image_url || "/placeholder.svg",
      audioUrl: s.audio_url,
      plays: s.song_analytics?.total_plays || 0,
    }));
    setQueue(formattedSongs);
    playSong({
      id: song.id,
      title: song.title,
      artist: song.artist_profiles?.stage_name || "Unknown Artist",
      image: song.cover_image_url || "/placeholder.svg",
      audioUrl: song.audio_url,
      plays: song.song_analytics?.total_plays || 0,
    });
    toast({
      title: "Now Playing",
      description: `${song.title} by ${song.artist_profiles?.stage_name || "Unknown Artist"}`,
    });
  };

  return (
    <div className="min-h-screen pb-32">
      {/* Ads Banner Carousel */}
      <AdsBannerCarousel />

      {/* Featured Artists Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">Featured Artists</h2>
          <Button variant="ghost" className="text-primary">
            See all
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
        {artistsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="aspect-square rounded-full" />
            ))}
          </div>
        ) : artists.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {artists.map((artist) => (
              <ArtistCard 
                key={artist.id} 
                artist={{
                  id: artist.id,
                  name: artist.stage_name,
                  image: artist.avatar_url || "/placeholder.svg",
                  followers: artist.total_followers?.toString() || "0",
                  verified: false,
                }}
              />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">No artists yet.</p>
        )}
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
        {songsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="aspect-square rounded-lg" />
            ))}
          </div>
        ) : trendingSongs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingSongs.map((song) => (
              <SongCard key={song.id} song={song} onPlay={handlePlaySong} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">No songs available yet.</p>
        )}
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
