import { useParams } from "react-router-dom";
import { useArtistPublicProfile, useArtistSongs, useArtistFollow } from "@/hooks/useArtistFollow";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserPlus, UserMinus, Music, Heart, Play, Instagram, Youtube, MessageCircle, Headphones, Calendar, MapPin, Music2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { usePlayer } from "@/contexts/PlayerContext";
import { toast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { useCommunityPosts } from "@/hooks/useCommunityPosts";
import CommunityPostCard from "@/components/CommunityPostCard";
import { useArtistEvents } from "@/hooks/useEvents";
import { format } from "date-fns";

const ArtistProfilePublic = () => {
  const { artistId } = useParams<{ artistId: string }>();
  const { user } = useAuth();
  const { playSong } = usePlayer();
  const { data: artist, isLoading: artistLoading } = useArtistPublicProfile(artistId);
  const { data: songs, isLoading: songsLoading } = useArtistSongs(artistId);
  const { isFollowing, toggleFollow, isPending } = useArtistFollow(artistId);
  const { data: communityPosts, isLoading: postsLoading } = useCommunityPosts(artistId);
  const { data: events, isLoading: eventsLoading } = useArtistEvents(artistId);

  const handleFollow = async () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to follow artists",
        variant: "destructive",
      });
      return;
    }

    try {
      await toggleFollow();
      toast({
        title: isFollowing ? "Unfollowed" : "Following",
        description: `${isFollowing ? "Unfollowed" : "Now following"} ${artist?.stage_name}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update follow status",
        variant: "destructive",
      });
    }
  };

  const handlePlaySong = (song: any) => {
    playSong({
      id: song.id,
      title: song.title,
      artist: artist?.stage_name || "Unknown Artist",
      image: song.cover_image_url || "/placeholder.svg",
      audioUrl: song.audio_url,
      plays: song.song_analytics?.total_plays || 0,
    });
  };

  if (artistLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-lg">Loading artist profile...</div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Artist not found</h2>
          <p className="text-muted-foreground">The artist you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32">
      {/* Cover Image */}
      <div 
        className="h-64 bg-gradient-to-b from-primary/20 to-background"
        style={{
          backgroundImage: artist.cover_image_url ? `url(${artist.cover_image_url})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Artist Info */}
      <div className="container mx-auto px-6 -mt-20">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-end mb-8">
          <Avatar className="h-40 w-40 border-4 border-background shadow-xl">
            <AvatarImage src={artist.avatar_url || undefined} />
            <AvatarFallback className="text-4xl bg-gradient-primary">
              {artist.stage_name.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">{artist.stage_name}</h1>
            <div className="flex gap-4 text-muted-foreground mb-4">
              <span>{artist.total_followers || 0} followers</span>
              <span>{songs?.length || 0} songs</span>
            </div>

            <div className="flex gap-3 mb-4">
              <Button 
                onClick={handleFollow}
                disabled={isPending}
                size="lg"
              >
                {isFollowing ? (
                  <>
                    <UserMinus className="mr-2 h-5 w-5" />
                    Unfollow
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-5 w-5" />
                    Follow
                  </>
                )}
              </Button>

              {/* Social Media Links */}
              <div className="flex gap-2">
                {artist.instagram_url && (
                  <Button
                    variant="outline"
                    size="icon"
                    asChild
                  >
                    <a href={artist.instagram_url} target="_blank" rel="noopener noreferrer">
                      <Instagram className="h-5 w-5" />
                    </a>
                  </Button>
                )}
                {artist.youtube_url && (
                  <Button
                    variant="outline"
                    size="icon"
                    asChild
                  >
                    <a href={artist.youtube_url} target="_blank" rel="noopener noreferrer">
                      <Youtube className="h-5 w-5" />
                    </a>
                  </Button>
                )}
                {artist.spotify_url && (
                  <Button
                    variant="outline"
                    size="icon"
                    asChild
                  >
                    <a href={artist.spotify_url} target="_blank" rel="noopener noreferrer">
                      <Music className="h-5 w-5" />
                    </a>
                  </Button>
                )}
                {artist.apple_music_url && (
                  <Button
                    variant="outline"
                    size="icon"
                    asChild
                  >
                    <a href={artist.apple_music_url} target="_blank" rel="noopener noreferrer">
                      <Music2 className="h-5 w-5" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        {artist.bio && (
          <Card className="p-6 mb-8">
            <h2 className="text-xl font-semibold mb-3">About</h2>
            <p className="text-muted-foreground whitespace-pre-line">{artist.bio}</p>
          </Card>
        )}

        <Separator className="my-8" />

        {/* Songs */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Popular Songs</h2>
          {songsLoading ? (
            <div className="text-center py-8">
              <div className="animate-pulse">Loading songs...</div>
            </div>
          ) : songs?.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No published songs yet</p>
            </Card>
          ) : (
            <div className="grid gap-4">
              {songs?.map((song, index) => (
                <Card 
                  key={song.id}
                  className="p-4 hover:bg-muted/50 transition-colors cursor-pointer group"
                  onClick={() => handlePlaySong(song)}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-muted-foreground w-8 text-center">{index + 1}</span>
                    
                    <div className="relative">
                      <img
                        src={song.cover_image_url || "/placeholder.svg"}
                        alt={song.title}
                        className="w-14 h-14 rounded object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded">
                        <Play className="h-6 w-6 text-white" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{song.title}</h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {song.genre || "Music"}
                      </p>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Headphones className="h-4 w-4" />
                        <span>{song.song_analytics?.total_plays ?? 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        <span>{song.song_analytics?.total_likes ?? 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        <span>{song.song_analytics?.total_comments ?? 0}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Community Posts Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Community</h2>
          {postsLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading posts...
            </div>
          ) : communityPosts && communityPosts.length > 0 ? (
            <div className="space-y-6">
              {communityPosts.map((post) => (
                <CommunityPostCard key={post.id} post={post} isArtist={false} />
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center text-muted-foreground">
              No community posts yet
            </Card>
          )}
        </div>

        {/* Events Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Upcoming Events</h2>
          {eventsLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading events...
            </div>
          ) : events && events.length > 0 ? (
            <div className="grid gap-6">
              {events
                .filter(event => event.is_published && new Date(event.event_date) >= new Date())
                .map((event) => (
                  <Card key={event.id} className="p-6 hover:border-primary/50 transition-colors">
                    <div className="flex flex-col md:flex-row gap-6">
                      {event.banner_url && (
                        <img
                          src={event.banner_url}
                          alt={event.title}
                          className="w-full md:w-48 h-32 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                        <div className="space-y-2 text-muted-foreground mb-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{format(new Date(event.event_date), "PPP 'at' p")}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{event.location}</span>
                          </div>
                        </div>
                        {event.description && (
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                            {event.description}
                          </p>
                        )}
                        <div className="flex items-center justify-between">
                          <div className="text-sm">
                            <span className="font-semibold">₹{event.ticket_price}</span>
                            <span className="text-muted-foreground ml-2">
                              • {event.available_seats} / {event.total_seats} seats available
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
          ) : (
            <Card className="p-8 text-center text-muted-foreground">
              No upcoming events
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtistProfilePublic;
