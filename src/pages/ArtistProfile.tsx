import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SongCard from "@/components/SongCard";
import { Users, Music, Heart } from "lucide-react";
import { sampleSongs } from "@/lib/sampleSongs";
import { usePlayer } from "@/contexts/PlayerContext";
import { useToast } from "@/hooks/use-toast";

const ArtistProfile = () => {
  const { playSong, setQueue } = usePlayer();
  const { toast } = useToast();

  // Get all Honey Singh songs
  const artistSongs = sampleSongs.filter((song) => song.artist === "Honey Singh");
  const displaySongs = artistSongs.length > 0 ? artistSongs : sampleSongs.slice(0, 4);

  const handlePlaySong = (song: typeof sampleSongs[0]) => {
    setQueue(displaySongs);
    playSong(song);
    toast({
      title: "Now Playing",
      description: `${song.title} by ${song.artist}`,
    });
  };

  return (
    <div className="min-h-screen pb-32">
      {/* Artist Header */}
      <div className="relative h-96 rounded-2xl overflow-hidden mb-8">
        <img
          src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&h=400&fit=crop"
          alt="Honey Singh"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute bottom-8 left-8 right-8">
          <div className="flex items-end gap-6">
            <img
              src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop"
              alt="Honey Singh"
              className="w-32 h-32 rounded-full border-4 border-background shadow-glow"
            />
            <div className="flex-1">
              <h1 className="text-5xl font-bold mb-2">Honey Singh</h1>
              <p className="text-muted-foreground text-lg mb-4">
                Punjabi Singer, Rapper & Music Producer
              </p>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  <span className="text-sm">3.5M Followers</span>
                </div>
                <div className="flex items-center gap-2">
                  <Music className="w-5 h-5 text-primary" />
                  <span className="text-sm">{displaySongs.length} Songs</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-primary" />
                  <span className="text-sm">12.8M Likes</span>
                </div>
              </div>
            </div>
            <Button
              size="lg"
              className="bg-gradient-primary hover:shadow-glow"
            >
              Follow
            </Button>
          </div>
        </div>
      </div>

      {/* Artist Content */}
      <Tabs defaultValue="songs" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="songs">Songs</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>

        <TabsContent value="songs">
          {displaySongs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {displaySongs.map((song) => (
                <SongCard key={song.id} song={song} onPlay={handlePlaySong} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-12">
              No songs available
            </p>
          )}
        </TabsContent>

        <TabsContent value="about">
          <Card className="p-8 bg-card border-border">
            <h2 className="text-2xl font-bold mb-4">About Honey Singh</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Yo Yo Honey Singh is one of India's most celebrated rappers, music
              producers, and singers. Known for his infectious beats and catchy
              lyrics, he has revolutionized the Punjabi and Bollywood music industry
              with chartbuster hits.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              With over 3.5 million followers and billions of streams worldwide,
              Honey Singh has become a household name. His signature style blends
              hip-hop, Punjabi folk, and electronic music, creating an unmistakable
              sound that dominates parties and clubs across the globe.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-4 py-2 bg-secondary rounded-full text-sm">
                Hip Hop
              </span>
              <span className="px-4 py-2 bg-secondary rounded-full text-sm">
                Punjabi Pop
              </span>
              <span className="px-4 py-2 bg-secondary rounded-full text-sm">
                Rap
              </span>
              <span className="px-4 py-2 bg-secondary rounded-full text-sm">
                Party Music
              </span>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="events">
          <Card className="p-8 bg-card border-border">
            <h2 className="text-2xl font-bold mb-6">Upcoming Events</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                <div>
                  <h3 className="font-semibold mb-1">Honey Singh Live in Concert</h3>
                  <p className="text-sm text-muted-foreground">
                    April 20, 2024 • Talkatora Stadium, Delhi
                  </p>
                </div>
                <Button>Get Tickets</Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ArtistProfile;
