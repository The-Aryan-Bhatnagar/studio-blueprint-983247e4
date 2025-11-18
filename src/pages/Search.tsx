import { Search as SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import SongCard from "@/components/SongCard";
import { useState } from "react";
import { sampleSongs } from "@/lib/sampleSongs";
import { usePlayer } from "@/contexts/PlayerContext";
import { useToast } from "@/hooks/use-toast";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { playSong, setQueue } = usePlayer();
  const { toast } = useToast();

  const filteredSongs = searchQuery
    ? sampleSongs.filter(
        (song) =>
          song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
          song.genre.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : sampleSongs;

  const handlePlaySong = (song: typeof sampleSongs[0]) => {
    setQueue(sampleSongs);
    playSong(song);
    toast({
      title: "Now Playing",
      description: `${song.title} by ${song.artist}`,
    });
  };

  const genres = [
    "Pop",
    "Rock",
    "Hip Hop",
    "Electronic",
    "Jazz",
    "Classical",
    "R&B",
    "Country",
  ];

  return (
    <div className="min-h-screen pb-32">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-6">Search</h1>
        <div className="relative max-w-2xl">
          <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            type="text"
            placeholder="Search songs, artists, albums..."
            className="pl-12 h-14 text-lg bg-secondary border-border"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {!searchQuery && (
        <>
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Browse by Genre</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {genres.map((genre) => (
                <div
                  key={genre}
                  className="aspect-square rounded-xl bg-gradient-primary p-6 flex items-center justify-center cursor-pointer hover:shadow-glow transition-all"
                >
                  <span className="text-2xl font-bold">{genre}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6">Popular Searches</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {sampleSongs.slice(0, 8).map((song) => (
                <SongCard key={song.id} song={song} onPlay={handlePlaySong} />
              ))}
            </div>
          </section>
        </>
      )}

      {searchQuery && (
        <section>
          <h2 className="text-2xl font-bold mb-6">
            Results for "{searchQuery}" ({filteredSongs.length} songs)
          </h2>
          {filteredSongs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredSongs.map((song) => (
                <SongCard key={song.id} song={song} onPlay={handlePlaySong} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-12">
              No songs found matching "{searchQuery}"
            </p>
          )}
        </section>
      )}
    </div>
  );
};

export default Search;
