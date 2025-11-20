import { Search as SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import SongCard from "@/components/SongCard";
import ArtistCard from "@/components/ArtistCard";
import { useState } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { useToast } from "@/hooks/use-toast";
import { usePublicSongs, usePublicArtists } from "@/hooks/usePublicSongs";
import { usePlaylists } from "@/hooks/usePlaylists";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Music, Users, ListMusic, Grid } from "lucide-react";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const { playSong, setQueue } = usePlayer();
  const { toast } = useToast();
  const { data: songs = [], isLoading: songsLoading } = usePublicSongs();
  const { data: artists = [], isLoading: artistsLoading } = usePublicArtists();
  const { playlists = [], isLoading: playlistsLoading } = usePlaylists();

  // Filter songs
  const filteredSongs = searchQuery
    ? songs.filter(
        (song) =>
          song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          song.artist_profiles?.stage_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          song.genre?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : songs;

  // Filter artists
  const filteredArtists = searchQuery
    ? artists.filter(
        (artist) =>
          artist.stage_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          artist.bio?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : artists;

  // Filter playlists
  const filteredPlaylists = searchQuery
    ? playlists.filter(
        (playlist) =>
          playlist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          playlist.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : playlists;

  // Get unique genres from songs
  const genres = Array.from(new Set(songs.map(song => song.genre).filter(Boolean)));

  const handlePlaySong = (song: any) => {
    const songForPlayer = {
      id: song.id,
      title: song.title,
      artist: song.artist_profiles?.stage_name || "Unknown Artist",
      image: song.cover_image_url || "/placeholder.svg",
      audioUrl: song.audio_url,
      plays: song.song_analytics?.[0]?.total_plays || 0,
      likes: song.song_analytics?.[0]?.total_likes || 0,
    };
    setQueue(songs.map(s => ({
      id: s.id,
      title: s.title,
      artist: s.artist_profiles?.stage_name || "Unknown Artist",
      image: s.cover_image_url || "/placeholder.svg",
      audioUrl: s.audio_url,
      plays: s.song_analytics?.[0]?.total_plays || 0,
      likes: s.song_analytics?.[0]?.total_likes || 0,
    })));
    playSong(songForPlayer);
    toast({
      title: "Now Playing",
      description: `${song.title} by ${song.artist_profiles?.stage_name || "Unknown Artist"}`,
    });
  };

  const isLoading = songsLoading || artistsLoading || playlistsLoading;

  return (
    <div className="min-h-screen pb-32">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-6">Search</h1>
        <div className="relative max-w-2xl">
          <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            type="text"
            placeholder="Search songs, artists, playlists, genres..."
            className="pl-12 h-14 text-lg bg-secondary border-border"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="all" className="gap-2">
              <Grid className="w-4 h-4" />
              All
            </TabsTrigger>
            <TabsTrigger value="songs" className="gap-2">
              <Music className="w-4 h-4" />
              Songs
            </TabsTrigger>
            <TabsTrigger value="artists" className="gap-2">
              <Users className="w-4 h-4" />
              Artists
            </TabsTrigger>
            <TabsTrigger value="genres" className="gap-2">
              <Grid className="w-4 h-4" />
              Genres
            </TabsTrigger>
            <TabsTrigger value="playlists" className="gap-2">
              <ListMusic className="w-4 h-4" />
              Playlists
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {!searchQuery ? (
              <>
                <section className="mb-12">
                  <h2 className="text-2xl font-bold mb-6">Browse by Genre</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {genres.slice(0, 8).map((genre) => (
                      <div
                        key={genre}
                        onClick={() => {
                          setSearchQuery(genre || "");
                          setActiveTab("genres");
                        }}
                        className="aspect-square rounded-xl bg-gradient-primary p-6 flex items-center justify-center cursor-pointer hover:shadow-glow transition-all"
                      >
                        <span className="text-2xl font-bold">{genre}</span>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="mb-12">
                  <h2 className="text-2xl font-bold mb-6">Popular Artists</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {artists.slice(0, 8).map((artist) => (
                      <ArtistCard
                        key={artist.id}
                        artist={{
                          id: artist.id,
                          name: artist.stage_name,
                          image: artist.avatar_url || "/placeholder.svg",
                          followers: artist.total_followers || 0,
                        }}
                      />
                    ))}
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-6">Popular Songs</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {songs.slice(0, 8).map((song) => (
                      <SongCard
                        key={song.id}
                        song={{
                          id: song.id,
                          title: song.title,
                          artist: song.artist_profiles?.stage_name || "Unknown Artist",
                          image: song.cover_image_url || "/placeholder.svg",
                          audioUrl: song.audio_url,
                          plays: song.song_analytics?.[0]?.total_plays || 0,
                          likes: song.song_analytics?.[0]?.total_likes || 0,
                        }}
                        onPlay={handlePlaySong}
                      />
                    ))}
                  </div>
                </section>
              </>
            ) : (
              <div className="space-y-12">
                {filteredSongs.length > 0 && (
                  <section>
                    <h2 className="text-2xl font-bold mb-6">Songs ({filteredSongs.length})</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {filteredSongs.map((song) => (
                        <SongCard
                          key={song.id}
                          song={{
                            id: song.id,
                            title: song.title,
                            artist: song.artist_profiles?.stage_name || "Unknown Artist",
                            image: song.cover_image_url || "/placeholder.svg",
                            audioUrl: song.audio_url,
                            plays: song.song_analytics?.[0]?.total_plays || 0,
                            likes: song.song_analytics?.[0]?.total_likes || 0,
                          }}
                          onPlay={handlePlaySong}
                        />
                      ))}
                    </div>
                  </section>
                )}
                {filteredArtists.length > 0 && (
                  <section>
                    <h2 className="text-2xl font-bold mb-6">Artists ({filteredArtists.length})</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {filteredArtists.map((artist) => (
                        <ArtistCard
                          key={artist.id}
                          artist={{
                            id: artist.id,
                            name: artist.stage_name,
                            image: artist.avatar_url || "/placeholder.svg",
                            followers: artist.total_followers || 0,
                          }}
                        />
                      ))}
                    </div>
                  </section>
                )}
                {filteredPlaylists.length > 0 && (
                  <section>
                    <h2 className="text-2xl font-bold mb-6">Playlists ({filteredPlaylists.length})</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {filteredPlaylists.map((playlist) => (
                        <Card key={playlist.id} className="p-4 hover:shadow-glow transition-all cursor-pointer">
                          <div className="aspect-square bg-secondary rounded-lg mb-3 flex items-center justify-center">
                            <ListMusic className="w-12 h-12 text-muted-foreground" />
                          </div>
                          <h3 className="font-bold mb-1">{playlist.name}</h3>
                          {playlist.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">{playlist.description}</p>
                          )}
                        </Card>
                      ))}
                    </div>
                  </section>
                )}
                {filteredSongs.length === 0 && filteredArtists.length === 0 && filteredPlaylists.length === 0 && (
                  <p className="text-muted-foreground text-center py-12">
                    No results found for "{searchQuery}"
                  </p>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="songs">
            <h2 className="text-2xl font-bold mb-6">
              {searchQuery ? `Songs matching "${searchQuery}"` : "All Songs"} ({filteredSongs.length})
            </h2>
            {filteredSongs.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredSongs.map((song) => (
                  <SongCard
                    key={song.id}
                    song={{
                      id: song.id,
                      title: song.title,
                      artist: song.artist_profiles?.stage_name || "Unknown Artist",
                      image: song.cover_image_url || "/placeholder.svg",
                      audioUrl: song.audio_url,
                      plays: song.song_analytics?.[0]?.total_plays || 0,
                      likes: song.song_analytics?.[0]?.total_likes || 0,
                    }}
                    onPlay={handlePlaySong}
                  />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-12">No songs found</p>
            )}
          </TabsContent>

          <TabsContent value="artists">
            <h2 className="text-2xl font-bold mb-6">
              {searchQuery ? `Artists matching "${searchQuery}"` : "All Artists"} ({filteredArtists.length})
            </h2>
            {filteredArtists.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredArtists.map((artist) => (
                  <ArtistCard
                    key={artist.id}
                    artist={{
                      id: artist.id,
                      name: artist.stage_name,
                      image: artist.avatar_url || "/placeholder.svg",
                      followers: artist.total_followers || 0,
                    }}
                  />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-12">No artists found</p>
            )}
          </TabsContent>

          <TabsContent value="genres">
            <h2 className="text-2xl font-bold mb-6">Browse by Genre</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {genres.map((genre) => (
                <div
                  key={genre}
                  onClick={() => setSearchQuery(genre || "")}
                  className="aspect-square rounded-xl bg-gradient-primary p-6 flex items-center justify-center cursor-pointer hover:shadow-glow transition-all"
                >
                  <span className="text-2xl font-bold">{genre}</span>
                </div>
              ))}
            </div>
            {searchQuery && (
              <>
                <h3 className="text-xl font-bold mb-4">Songs in {searchQuery}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredSongs.map((song) => (
                    <SongCard
                      key={song.id}
                      song={{
                        id: song.id,
                        title: song.title,
                        artist: song.artist_profiles?.stage_name || "Unknown Artist",
                        image: song.cover_image_url || "/placeholder.svg",
                        audioUrl: song.audio_url,
                        plays: song.song_analytics?.[0]?.total_plays || 0,
                        likes: song.song_analytics?.[0]?.total_likes || 0,
                      }}
                      onPlay={handlePlaySong}
                    />
                  ))}
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="playlists">
            <h2 className="text-2xl font-bold mb-6">
              {searchQuery ? `Playlists matching "${searchQuery}"` : "All Playlists"} ({filteredPlaylists.length})
            </h2>
            {filteredPlaylists.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredPlaylists.map((playlist) => (
                  <Card key={playlist.id} className="p-4 hover:shadow-glow transition-all cursor-pointer">
                    <div className="aspect-square bg-secondary rounded-lg mb-3 flex items-center justify-center">
                      <ListMusic className="w-12 h-12 text-muted-foreground" />
                    </div>
                    <h3 className="font-bold mb-1">{playlist.name}</h3>
                    {playlist.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{playlist.description}</p>
                    )}
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-12">No playlists found</p>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default Search;
