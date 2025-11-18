import { Card } from "@/components/ui/card";
import { useArtistProfile } from "@/hooks/useArtistProfile";
import { useSongs } from "@/hooks/useSongs";
import { Play, Users, Heart, DollarSign, TrendingUp, Music, Calendar, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ArtistDashboardHome = () => {
  const { data: artistProfile } = useArtistProfile();
  const { data: songs } = useSongs();

  // Calculate analytics
  const totalSongs = songs?.length || 0;
  const scheduledSongs = songs?.filter(s => s.is_scheduled && !s.is_published).length || 0;
  const totalPlays = songs?.reduce((sum, song) => sum + (song.song_analytics?.[0]?.total_plays || 0), 0) || 0;
  const totalLikes = songs?.reduce((sum, song) => sum + (song.song_analytics?.[0]?.total_likes || 0), 0) || 0;
  const playsLast7Days = songs?.reduce((sum, song) => sum + (song.song_analytics?.[0]?.plays_last_7_days || 0), 0) || 0;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Welcome back, {artistProfile?.stage_name}!</h1>
        <p className="text-muted-foreground">Here's what's happening with your music</p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-gradient-card border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-muted-foreground">Total Streams</span>
            <Play className="w-5 h-5 text-primary" />
          </div>
          <p className="text-3xl font-bold">{totalPlays.toLocaleString()}</p>
          <p className="text-sm text-green-500 mt-1">+{playsLast7Days} last 7 days</p>
        </Card>

        <Card className="p-6 bg-gradient-card border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-muted-foreground">Followers</span>
            <Users className="w-5 h-5 text-primary" />
          </div>
          <p className="text-3xl font-bold">{artistProfile?.total_followers?.toLocaleString() || 0}</p>
          <p className="text-sm text-muted-foreground mt-1">From all platforms</p>
        </Card>

        <Card className="p-6 bg-gradient-card border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-muted-foreground">Total Likes</span>
            <Heart className="w-5 h-5 text-primary" />
          </div>
          <p className="text-3xl font-bold">{totalLikes.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground mt-1">Across all songs</p>
        </Card>

        <Card className="p-6 bg-gradient-card border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-muted-foreground">Subscribers</span>
            <DollarSign className="w-5 h-5 text-primary" />
          </div>
          <p className="text-3xl font-bold">{artistProfile?.total_subscribers?.toLocaleString() || 0}</p>
          <p className="text-sm text-muted-foreground mt-1">Personal community</p>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Music className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalSongs}</p>
              <p className="text-sm text-muted-foreground">Total Songs</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-accent/10">
              <Calendar className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">{scheduledSongs}</p>
              <p className="text-sm text-muted-foreground">Scheduled Releases</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-green-500/10">
              <MessageCircle className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-muted-foreground">Community Posts</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Insights */}
      <Card className="p-6 border-border">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Recent Insights
        </h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span>Last 7 days plays</span>
            </div>
            <span className="font-semibold">{playsLast7Days.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span>Follower count</span>
            </div>
            <span className="font-semibold">{artistProfile?.total_followers?.toLocaleString() || 0}</span>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="p-6 border-border">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link to="/artist/dashboard/upload">
            <Button className="bg-gradient-primary">Upload New Song</Button>
          </Link>
          <Link to="/artist/dashboard/songs">
            <Button variant="outline">Manage Songs</Button>
          </Link>
          <Link to="/artist/dashboard/settings">
            <Button variant="outline">Profile Settings</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default ArtistDashboardHome;