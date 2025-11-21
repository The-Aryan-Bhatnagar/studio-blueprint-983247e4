import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Music, TrendingUp, DollarSign, ArrowLeft } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { useAdminArtists } from "@/hooks/useAdminData";

const ArtistDashboard = () => {
  const navigate = useNavigate();
  const { data: artists, isLoading } = useAdminArtists();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const recentArtists = artists?.slice(0, 4) || [];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Artist Dashboard</h1>
            <p className="text-muted-foreground">Manage and monitor artist activities</p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Artists</CardTitle>
            <Users className="w-5 h-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1,234</div>
            <p className="text-xs text-emerald-500 mt-1">+12.5% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Tracks</CardTitle>
            <Music className="w-5 h-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">5,678</div>
            <p className="text-xs text-emerald-500 mt-1">+8.2% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Streams</CardTitle>
            <TrendingUp className="w-5 h-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">2.4M</div>
            <p className="text-xs text-emerald-500 mt-1">+15.3% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Revenue</CardTitle>
            <DollarSign className="w-5 h-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$45,890</div>
            <p className="text-xs text-emerald-500 mt-1">+9.8% from last month</p>
          </CardContent>
        </Card>
        </div>

        {/* Recent Artists Table */}
        <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Recent Artists</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Artist Name</TableHead>
                <TableHead>Tracks</TableHead>
                <TableHead>Streams</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Alex Morgan</TableCell>
                <TableCell>24</TableCell>
                <TableCell>145K</TableCell>
                <TableCell>
                  <Badge className="bg-emerald-500 hover:bg-emerald-600">Active</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Sarah Chen</TableCell>
                <TableCell>18</TableCell>
                <TableCell>98K</TableCell>
                <TableCell>
                  <Badge className="bg-emerald-500 hover:bg-emerald-600">Active</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Mike Rodriguez</TableCell>
                <TableCell>32</TableCell>
                <TableCell>203K</TableCell>
                <TableCell>
                  <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Emma Wilson</TableCell>
                <TableCell>15</TableCell>
                <TableCell>76K</TableCell>
                <TableCell>
                  <Badge className="bg-emerald-500 hover:bg-emerald-600">Active</Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ArtistDashboard;
