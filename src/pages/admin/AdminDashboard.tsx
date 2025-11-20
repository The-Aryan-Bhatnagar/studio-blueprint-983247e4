import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Music, TrendingUp } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { useAdminAnalytics, useAdminArtists, useAdminSongs } from "@/hooks/useAdminData";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const AdminDashboard = () => {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  
  const { data: analytics } = useAdminAnalytics();
  const { data: songs } = useAdminSongs();
  const { data: artists } = useAdminArtists();

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate("/admin/login");
    }
  }, [isAdmin, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const recentSongs = songs?.slice(0, 5) || [];
  const recentArtists = artists?.slice(0, 5) || [];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening with your music platform.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
            <Users className="w-5 h-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12,543</div>
            <p className="text-xs text-green-500 mt-1">↑ 12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Artists</CardTitle>
            <Music className="w-5 h-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1,234</div>
            <p className="text-xs text-green-500 mt-1">↑ 8% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Songs</CardTitle>
            <Music className="w-5 h-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">8,921</div>
            <p className="text-xs text-green-500 mt-1">↑ 15% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Likes</CardTitle>
            <TrendingUp className="w-5 h-5 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">45.2K</div>
            <p className="text-xs text-green-500 mt-1">↑ 23% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Songs */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Songs</CardTitle>
            <Button variant="outline" size="sm" onClick={() => navigate("/admin/songs")}>
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Artist</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Uploaded</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentSongs.map((song: any) => (
                  <TableRow key={song.id}>
                    <TableCell className="font-medium">{song.title}</TableCell>
                    <TableCell>{song.artist_profiles?.stage_name}</TableCell>
                    <TableCell>
                      <Badge variant={song.is_published ? "default" : "secondary"}>
                        {song.is_published ? "approved" : "pending"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(song.created_at), { addSuffix: true })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent Artists */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Artists</CardTitle>
            <Button variant="outline" size="sm" onClick={() => navigate("/admin/artists")}>
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentArtists.map((artist: any) => (
                  <TableRow key={artist.id}>
                    <TableCell className="font-medium">{artist.stage_name}</TableCell>
                    <TableCell>artist@music.com</TableCell>
                    <TableCell>
                      <Badge variant="default" className="bg-green-500">verified</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(artist.created_at), { addSuffix: true })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
