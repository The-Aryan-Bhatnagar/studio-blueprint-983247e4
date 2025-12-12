import { useEffect, useState } from "react";
import SongCard from "@/components/SongCard";
import ArtistCard from "@/components/ArtistCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { usePlayer } from "@/contexts/PlayerContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { usePublicSongs, usePublicArtists } from "@/hooks/usePublicSongs";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { playSong, setQueue } = usePlayer();
  const { toast } = useToast();
  const [userName, setUserName] = useState("Guest");
  const { data: songs = [], isLoading: songsLoading } = usePublicSongs();
  const { data: artists = [], isLoading: artistsLoading } = usePublicArtists();

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
          .maybeSingle();
        
        if (profile?.full_name) {
          setUserName(profile.full_name);
        }
      }
    } catch (error) {
      console.error("Error loading user name:", error);
    }
  };
  
  const topMixes = songs.slice(0, 4);
  const popularArtists = artists.slice(0, 4);
  const recentlyPlayed = songs.slice(4, 8);

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

  const navigate = useNavigate();

  return (
    <div className="min-h-screen pb-36 md:pb-32">
      {/* Hero Banner Section */}
      <section className="w-full p-6 sm:p-8 md:p-[60px_40px] rounded-[20px] bg-gradient-to-br from-[hsl(270,100%,50%)] via-[hsl(290,100%,50%)] to-[hsl(320,100%,60%)] flex flex-col items-center mb-6 md:mb-10 gap-4 md:gap-6">
        {/* Content */}
        <div className="text-center md:text-left md:flex md:justify-between md:items-center md:w-full md:gap-10">
          <div className="flex-1">
            <h1 className="text-white text-2xl sm:text-3xl md:text-[42px] font-bold leading-tight">
              Discover Amazing Artists
            </h1>
            <p className="text-white/90 mt-2 text-sm sm:text-base md:text-lg max-w-[480px] mx-auto md:mx-0">
              Connect with talented artists and stream music from around the world.
            </p>
            <div className="mt-4 md:mt-6 flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <Button
                size="lg"
                className="bg-white text-[hsl(270,100%,50%)] hover:bg-white/90 font-semibold px-6 py-3 rounded-[10px] border-none"
                onClick={() => navigate("/search")}
              >
                Explore Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                className="bg-white/20 text-white hover:bg-white/30 font-semibold px-6 py-3 rounded-[10px] border border-white/40"
                onClick={() => navigate("/artist/signup")}
              >
                Become an Artist
              </Button>
            </div>
          </div>
          
          {/* Desktop Ad Image - hidden on mobile/tablet where we show separate banners */}
          <div className="hidden lg:block">
            <img
              src="/placeholder.svg"
              alt="Ad banner"
              className="h-[200px] w-auto rounded-[20px] object-cover"
            />
          </div>
        </div>
        
        {/* Mobile Ad Banner - 1546x423 ratio */}
        <div className="block sm:hidden w-full flex justify-center px-4">
          <div className="w-full aspect-[1546/423] bg-white/20 rounded-lg flex items-center justify-center overflow-hidden">
            <img
              src="/placeholder.svg"
              alt="Ad banner"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        {/* Tablet Ad Banner - 728x90 (landscape) or 300x250 (portrait) */}
        <div className="hidden sm:flex lg:hidden justify-center w-full">
          {/* 728x90 for wider tablets */}
          <div className="hidden md:block w-[728px] h-[90px] bg-white/20 rounded-lg overflow-hidden">
            <img
              src="/placeholder.svg"
              alt="Ad banner"
              className="w-full h-full object-cover"
            />
          </div>
          {/* 300x250 for smaller tablets */}
          <div className="block md:hidden w-[300px] h-[250px] bg-white/20 rounded-lg overflow-hidden">
            <img
              src="/placeholder.svg"
              alt="Ad banner"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="mb-4 md:mb-8">
        <h2 className="text-xl sm:text-2xl md:text-4xl font-bold mb-1 md:mb-2">Made For {userName}</h2>
        <p className="text-xs sm:text-sm md:text-base text-muted-foreground">Your personalized music experience</p>
      </section>

      {/* Your Top Mixes */}
      <section className="mb-6 md:mb-12">
        <div className="flex items-center justify-between mb-3 md:mb-6">
          <h2 className="text-lg sm:text-xl md:text-3xl font-bold">Your Top Mixes</h2>
          <Button variant="ghost" className="text-primary text-xs md:text-sm px-2 md:px-4">
            See all
            <ArrowRight className="ml-1 md:ml-2 w-3 h-3 md:w-4 md:h-4" />
          </Button>
        </div>
        {songsLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="aspect-square rounded-lg" />
            ))}
          </div>
        ) : topMixes.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {topMixes.map((song) => (
              <SongCard key={song.id} song={song} onPlay={handlePlaySong} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8 text-sm">No songs available yet. Artists can upload music!</p>
        )}
      </section>

      {/* Popular Artists */}
      <section className="mb-6 md:mb-12">
        <div className="flex items-center justify-between mb-3 md:mb-6">
          <h2 className="text-lg sm:text-xl md:text-3xl font-bold">Popular Artists</h2>
          <Button variant="ghost" className="text-primary text-xs md:text-sm px-2 md:px-4">
            See all
            <ArrowRight className="ml-1 md:ml-2 w-3 h-3 md:w-4 md:h-4" />
          </Button>
        </div>
        {artistsLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="aspect-square rounded-full" />
            ))}
          </div>
        ) : popularArtists.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {popularArtists.map((artist) => (
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
          <p className="text-muted-foreground text-center py-8 text-sm">No artists yet.</p>
        )}
      </section>

      {/* Recently Played */}
      <section className="mb-6 md:mb-12">
        <div className="flex items-center justify-between mb-3 md:mb-6">
          <h2 className="text-lg sm:text-xl md:text-3xl font-bold">Recently Played</h2>
          <Button variant="ghost" className="text-primary text-xs md:text-sm px-2 md:px-4">
            See all
            <ArrowRight className="ml-1 md:ml-2 w-3 h-3 md:w-4 md:h-4" />
          </Button>
        </div>
        {songsLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="aspect-square rounded-lg" />
            ))}
          </div>
        ) : recentlyPlayed.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {recentlyPlayed.map((song) => (
              <SongCard key={song.id} song={song} onPlay={handlePlaySong} />
            ))}
          </div>
        ) : null}
      </section>
    </div>
  );
};

export default Home;
