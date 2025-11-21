import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Users, Music, TrendingUp, DollarSign, ArrowLeft, Search, MoreVertical, Check, X, Ban, Trash2, Edit, Eye, EyeOff, Calendar, MessageSquare, Image, Video, Award, UserCheck } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
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
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Approvals</CardTitle>
              <UserCheck className="w-5 h-5 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">23</div>
              <p className="text-xs text-muted-foreground mt-1">Artists & Songs</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different sections */}
        <Tabs defaultValue="artists" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="artists">Artist Management</TabsTrigger>
            <TabsTrigger value="songs">Song Management</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled Uploads</TabsTrigger>
            <TabsTrigger value="community">Community Posts</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Artist Management Tab */}
          <TabsContent value="artists" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>All Artists</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search artists..." className="pl-8 w-[300px]" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Artist Name</TableHead>
                      <TableHead>Genre</TableHead>
                      <TableHead>Tracks</TableHead>
                      <TableHead>Followers</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Alex Morgan</TableCell>
                      <TableCell>Pop</TableCell>
                      <TableCell>24</TableCell>
                      <TableCell>12.5K</TableCell>
                      <TableCell><Badge className="bg-emerald-500">Approved</Badge></TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem><Edit className="w-4 h-4 mr-2" />Edit Profile</DropdownMenuItem>
                            <DropdownMenuItem><Music className="w-4 h-4 mr-2" />View Songs</DropdownMenuItem>
                            <DropdownMenuItem><TrendingUp className="w-4 h-4 mr-2" />View Analytics</DropdownMenuItem>
                            <DropdownMenuItem><Ban className="w-4 h-4 mr-2" />Block Artist</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive"><Trash2 className="w-4 h-4 mr-2" />Delete Artist</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Sarah Chen</TableCell>
                      <TableCell>R&B</TableCell>
                      <TableCell>18</TableCell>
                      <TableCell>8.2K</TableCell>
                      <TableCell><Badge className="bg-yellow-500">Pending</Badge></TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem><Check className="w-4 h-4 mr-2" />Approve Artist</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive"><X className="w-4 h-4 mr-2" />Reject Artist</DropdownMenuItem>
                            <DropdownMenuItem><Edit className="w-4 h-4 mr-2" />Edit Profile</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Song Management Tab */}
          <TabsContent value="songs" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>All Songs</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search songs..." className="pl-8 w-[300px]" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Song Title</TableHead>
                      <TableHead>Artist</TableHead>
                      <TableHead>Genre</TableHead>
                      <TableHead>Views</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Summer Vibes</TableCell>
                      <TableCell>Alex Morgan</TableCell>
                      <TableCell>Pop</TableCell>
                      <TableCell>145K</TableCell>
                      <TableCell><Badge className="bg-emerald-500">Published</Badge></TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem><Edit className="w-4 h-4 mr-2" />Edit Details</DropdownMenuItem>
                            <DropdownMenuItem><Image className="w-4 h-4 mr-2" />Change Banner</DropdownMenuItem>
                            <DropdownMenuItem><EyeOff className="w-4 h-4 mr-2" />Hide Song</DropdownMenuItem>
                            <DropdownMenuItem><MessageSquare className="w-4 h-4 mr-2" />Manage Comments</DropdownMenuItem>
                            <DropdownMenuItem><TrendingUp className="w-4 h-4 mr-2" />View Performance</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive"><Trash2 className="w-4 h-4 mr-2" />Delete Song</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Midnight Dreams</TableCell>
                      <TableCell>Sarah Chen</TableCell>
                      <TableCell>R&B</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell><Badge className="bg-yellow-500">Pending</Badge></TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem><Check className="w-4 h-4 mr-2" />Approve Song</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive"><X className="w-4 h-4 mr-2" />Reject Song</DropdownMenuItem>
                            <DropdownMenuItem><Edit className="w-4 h-4 mr-2" />Edit Details</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Scheduled Uploads Tab */}
          <TabsContent value="scheduled" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Scheduled Song Releases</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Song Title</TableHead>
                      <TableHead>Artist</TableHead>
                      <TableHead>Scheduled Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">New Track 2025</TableCell>
                      <TableCell>Mike Rodriguez</TableCell>
                      <TableCell>Dec 25, 2024 12:00 AM</TableCell>
                      <TableCell><Badge className="bg-blue-500">Scheduled</Badge></TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem><Check className="w-4 h-4 mr-2" />Approve Schedule</DropdownMenuItem>
                            <DropdownMenuItem><Calendar className="w-4 h-4 mr-2" />Edit Schedule</DropdownMenuItem>
                            <DropdownMenuItem><Eye className="w-4 h-4 mr-2" />Preview Song</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive"><X className="w-4 h-4 mr-2" />Cancel Schedule</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Community Posts Tab */}
          <TabsContent value="community" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Artist Community Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Artist</TableHead>
                      <TableHead>Post Content</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Engagement</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Alex Morgan</TableCell>
                      <TableCell className="max-w-md truncate">New album coming soon! Stay tuned...</TableCell>
                      <TableCell><Badge><MessageSquare className="w-3 h-3 mr-1" />Text</Badge></TableCell>
                      <TableCell>456 likes, 89 comments</TableCell>
                      <TableCell>2 hours ago</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem><Eye className="w-4 h-4 mr-2" />View Full Post</DropdownMenuItem>
                            <DropdownMenuItem><MessageSquare className="w-4 h-4 mr-2" />Manage Comments</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive"><Trash2 className="w-4 h-4 mr-2" />Delete Post</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Sarah Chen</TableCell>
                      <TableCell className="max-w-md truncate">Behind the scenes of recording...</TableCell>
                      <TableCell><Badge><Video className="w-3 h-3 mr-1" />Video</Badge></TableCell>
                      <TableCell>1.2K likes, 234 comments</TableCell>
                      <TableCell>5 hours ago</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem><Eye className="w-4 h-4 mr-2" />View Full Post</DropdownMenuItem>
                            <DropdownMenuItem><MessageSquare className="w-4 h-4 mr-2" />Manage Comments</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive"><Trash2 className="w-4 h-4 mr-2" />Delete Post</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Verified Artists</CardTitle>
                  <Award className="w-5 h-5 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">892</div>
                  <p className="text-xs text-muted-foreground mt-1">72% of all artists</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Avg Songs per Artist</CardTitle>
                  <Music className="w-5 h-5 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">4.6</div>
                  <p className="text-xs text-emerald-500 mt-1">+0.8 from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Avg Streams per Song</CardTitle>
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">422</div>
                  <p className="text-xs text-emerald-500 mt-1">+15% from last month</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Trending Artists</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rank</TableHead>
                      <TableHead>Artist</TableHead>
                      <TableHead>Streams</TableHead>
                      <TableHead>Followers Growth</TableHead>
                      <TableHead>Engagement Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-bold">1</TableCell>
                      <TableCell className="font-medium">Alex Morgan</TableCell>
                      <TableCell>145K</TableCell>
                      <TableCell className="text-emerald-500">+2.3K</TableCell>
                      <TableCell>8.5%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-bold">2</TableCell>
                      <TableCell className="font-medium">Sarah Chen</TableCell>
                      <TableCell>98K</TableCell>
                      <TableCell className="text-emerald-500">+1.8K</TableCell>
                      <TableCell>7.2%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ArtistDashboard;
