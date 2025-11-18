import { useEffect, useState } from "react";
import SongCard from "@/components/SongCard";
import ArtistCard from "@/components/ArtistCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { sampleSongs } from "@/lib/sampleSongs";
import { sampleArtists } from "@/lib/sampleArtists";
import { usePlayer } from "@/contexts/PlayerContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Home = () => {
  const { playSong, setQueue } = usePlayer();
  const { toast } = useToast();
  const [userName, setUserName] = useState("Guest");

  useEffect(() => {
    loadUserName();
  }, []);

  const loadUserName = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("user_id", user.id)
          .single();
        
        if (profile?.full_name) {
          setUserName(profile.full_name);
        }
      }
    } catch (error) {
      console.error("Error loading user name:", error);
    }
  };
  
  const topMixes = sampleSongs.slice(0, 4);
  const popularArtists = sampleArtists.slice(0, 4);
  const recentlyPlayed = sampleSongs.slice(4, 8);

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
      {/* Welcome Section */}
      <section className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Made For {userName}</h1>
        <p className="text-muted-foreground">Your personalized music experience</p>
      </section>

      {/* Your Top Mixes */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">Your Top Mixes</h2>
          <Button variant="ghost" className="text-primary">
            See all
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {topMixes.map((song) => (
            <SongCard key={song.id} song={song} onPlay={handlePlaySong} />
          ))}
        </div>
      </section>

      {/* Popular Artists */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">Popular Artists</h2>
          <Button variant="ghost" className="text-primary">
            See all
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularArtists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      </section>

      {/* Recently Played */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">Recently Played</h2>
          <Button variant="ghost" className="text-primary">
            See all
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentlyPlayed.map((song) => (
            <SongCard key={song.id} song={song} onPlay={handlePlaySong} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
