import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, Music, Calendar } from "lucide-react";
import { useAdminAnalytics } from "@/hooks/useAdminData";

const AnalyticsPage = () => {
  const { data: analytics, isLoading } = useAdminAnalytics();

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Analytics Overview</h1>
        <p className="text-muted-foreground">Detailed platform analytics and insights</p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
            <Users className="w-5 h-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics?.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Registered users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Artists</CardTitle>
            <Music className="w-5 h-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics?.totalArtists || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Verified artists</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Songs</CardTitle>
            <Music className="w-5 h-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics?.totalSongs || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Published songs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Events</CardTitle>
            <Calendar className="w-5 h-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics?.totalEvents || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">All events</p>
          </CardContent>
        </Card>
      </div>

      {/* Engagement Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Plays</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <TrendingUp className="w-12 h-12 text-primary" />
              <div>
                <div className="text-4xl font-bold">{analytics?.totalPlays || 0}</div>
                <p className="text-sm text-muted-foreground">Song plays across platform</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total Plays</span>
                <span className="font-bold flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                  {analytics?.totalPlays || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Active Users</span>
                <span className="font-bold">{analytics?.totalUsers || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Active Artists</span>
                <span className="font-bold">{analytics?.totalArtists || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Platform Health */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Average Songs per Artist</p>
              <p className="text-2xl font-bold">
                {analytics?.totalArtists && analytics?.totalSongs
                  ? (analytics.totalSongs / analytics.totalArtists).toFixed(1)
                  : '0'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Average Plays per Song</p>
              <p className="text-2xl font-bold">
                {analytics?.totalSongs && analytics?.totalPlays
                  ? (analytics.totalPlays / analytics.totalSongs).toFixed(0)
                  : '0'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">User Engagement Rate</p>
              <p className="text-2xl font-bold">
                {analytics?.totalUsers && analytics?.totalPlays
                  ? ((analytics.totalPlays / analytics.totalUsers) * 100).toFixed(1)
                  : '0'}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsPage;
