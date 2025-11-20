import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Users, Music, Calendar, MessageSquare, TrendingUp, Shield, 
  AlertTriangle, BarChart3, Settings, FileText, Ban, Image as ImageIcon
} from "lucide-react";
import { useAdminAnalytics, useAdminUsers, useAdminArtists, useAdminSongs, 
  useAdminEvents, useAdminPlaylists, useAdminReports, useAdminCommunityPosts,
  useAdminComments, useAdminAds, useDeleteContent, useUpdateReport } from "@/hooks/useAdminData";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";

const AdminDashboard = () => {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  
  const { data: analytics } = useAdminAnalytics();
  const { data: users } = useAdminUsers();
  const { data: artists } = useAdminArtists();
  const { data: songs } = useAdminSongs();
  const { data: events } = useAdminEvents();
  const { data: playlists } = useAdminPlaylists();
  const { data: reports } = useAdminReports();
  const { data: posts } = useAdminCommunityPosts();
  const { data: comments } = useAdminComments();
  const { data: ads } = useAdminAds();
  
  const deleteContent = useDeleteContent();
  const updateReport = useUpdateReport();

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

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Complete platform management and control</p>
          </div>
          <Shield className="w-8 h-8 text-primary" />
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-muted-foreground mb-1">Total Users</p>
                <p className="text-2xl md:text-3xl font-bold">{analytics?.totalUsers || 0}</p>
              </div>
              <Users className="w-8 h-8 md:w-10 md:h-10 text-primary" />
            </div>
          </Card>

          <Card className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-muted-foreground mb-1">Total Artists</p>
                <p className="text-2xl md:text-3xl font-bold">{analytics?.totalArtists || 0}</p>
              </div>
              <Music className="w-8 h-8 md:w-10 md:h-10 text-primary" />
            </div>
          </Card>

          <Card className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-muted-foreground mb-1">Total Songs</p>
                <p className="text-2xl md:text-3xl font-bold">{analytics?.totalSongs || 0}</p>
              </div>
              <TrendingUp className="w-8 h-8 md:w-10 md:h-10 text-primary" />
            </div>
          </Card>

          <Card className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-muted-foreground mb-1">Events</p>
                <p className="text-2xl md:text-3xl font-bold">{analytics?.totalEvents || 0}</p>
              </div>
              <Calendar className="w-8 h-8 md:w-10 md:h-10 text-primary" />
            </div>
          </Card>

          <Card className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-muted-foreground mb-1">Total Plays</p>
                <p className="text-2xl md:text-3xl font-bold">{analytics?.totalPlays || 0}</p>
              </div>
              <BarChart3 className="w-8 h-8 md:w-10 md:h-10 text-primary" />
            </div>
          </Card>
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="mb-6 flex-wrap h-auto">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="artists">Artists</TabsTrigger>
            <TabsTrigger value="songs">Songs</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="playlists">Playlists</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="ads">Ads</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Users Management */}
          <TabsContent value="users">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">User Management</h3>
                <Badge>{users?.length || 0} Users</Badge>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users?.slice(0, 10).map((user: any) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.full_name}</TableCell>
                        <TableCell>{user.user_id}</TableCell>
                        <TableCell>{user.city ? `${user.city}, ${user.country}` : "N/A"}</TableCell>
                        <TableCell>{formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">View</Button>
                            <Button size="sm" variant="destructive">Block</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>

          {/* Artists Management */}
          <TabsContent value="artists">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Artist Management</h3>
                <Badge>{artists?.length || 0} Artists</Badge>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Stage Name</TableHead>
                      <TableHead>Followers</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {artists?.slice(0, 10).map((artist: any) => (
                      <TableRow key={artist.id}>
                        <TableCell className="font-medium">{artist.stage_name}</TableCell>
                        <TableCell>{artist.total_followers || 0}</TableCell>
                        <TableCell>{formatDistanceToNow(new Date(artist.created_at), { addSuffix: true })}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">View</Button>
                            <Button size="sm" variant="outline">Verify</Button>
                            <Button size="sm" variant="destructive">Block</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>

          {/* Songs Management */}
          <TabsContent value="songs">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Song Management</h3>
                <Badge>{songs?.length || 0} Songs</Badge>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Artist</TableHead>
                      <TableHead>Plays</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {songs?.slice(0, 10).map((song: any) => (
                      <TableRow key={song.id}>
                        <TableCell className="font-medium">{song.title}</TableCell>
                        <TableCell>{song.artist_profiles?.stage_name}</TableCell>
                        <TableCell>{song.song_analytics?.total_plays || 0}</TableCell>
                        <TableCell>
                          <Badge variant={song.is_published ? "default" : "secondary"}>
                            {song.is_published ? "Published" : "Draft"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">View</Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => deleteContent.mutate({ table: "songs", id: song.id })}
                            >
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>

          {/* Events Management */}
          <TabsContent value="events">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Event Management</h3>
                <Badge>{events?.length || 0} Events</Badge>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Artist</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Seats</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {events?.slice(0, 10).map((event: any) => (
                      <TableRow key={event.id}>
                        <TableCell className="font-medium">{event.title}</TableCell>
                        <TableCell>{event.artist_profiles?.stage_name}</TableCell>
                        <TableCell>{new Date(event.event_date).toLocaleDateString()}</TableCell>
                        <TableCell>{event.location}</TableCell>
                        <TableCell>{event.available_seats}/{event.total_seats}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">View</Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => deleteContent.mutate({ table: "events", id: event.id })}
                            >
                              Cancel
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>

          {/* Playlists */}
          <TabsContent value="playlists">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Playlist Management</h3>
                <Badge>{playlists?.length || 0} Playlists</Badge>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Public</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {playlists?.slice(0, 10).map((playlist: any) => (
                      <TableRow key={playlist.id}>
                        <TableCell className="font-medium">{playlist.name}</TableCell>
                        <TableCell>
                          <Badge variant={playlist.is_public ? "default" : "secondary"}>
                            {playlist.is_public ? "Public" : "Private"}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDistanceToNow(new Date(playlist.created_at), { addSuffix: true })}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">View</Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => deleteContent.mutate({ table: "playlists", id: playlist.id })}
                            >
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>

          {/* Community Posts */}
          <TabsContent value="community">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Community Post Moderation</h3>
                <Badge>{posts?.length || 0} Posts</Badge>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Content</TableHead>
                      <TableHead>Artist</TableHead>
                      <TableHead>Likes</TableHead>
                      <TableHead>Comments</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {posts?.slice(0, 10).map((post: any) => (
                      <TableRow key={post.id}>
                        <TableCell className="max-w-xs truncate">{post.content}</TableCell>
                        <TableCell>{post.artist_profiles?.stage_name}</TableCell>
                        <TableCell>{post.community_post_analytics?.total_likes || 0}</TableCell>
                        <TableCell>{post.community_post_analytics?.total_comments || 0}</TableCell>
                        <TableCell>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">View</Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => deleteContent.mutate({ table: "community_posts", id: post.id })}
                            >
                              Remove
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>

          {/* Comments */}
          <TabsContent value="comments">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Comment Moderation</h3>
                <Badge>{comments?.length || 0} Recent Comments</Badge>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Comment</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Song</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {comments?.slice(0, 15).map((comment: any) => (
                      <TableRow key={comment.id}>
                        <TableCell className="max-w-xs truncate">{comment.content}</TableCell>
                        <TableCell>{comment.profiles?.full_name || "Unknown"}</TableCell>
                        <TableCell>{comment.songs?.title || "Unknown"}</TableCell>
                        <TableCell>{formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}</TableCell>
                        <TableCell>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => deleteContent.mutate({ table: "song_comments", id: comment.id })}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>

          {/* Reports */}
          <TabsContent value="reports">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                  User Reports & Complaints
                </h3>
                <Badge variant="destructive">
                  {reports?.filter((r: any) => r.status === "pending").length || 0} Pending
                </Badge>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports?.map((report: any) => (
                      <TableRow key={report.id}>
                        <TableCell>
                          <Badge variant="outline">{report.reported_type}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">{report.reason}</TableCell>
                        <TableCell className="max-w-xs truncate">{report.description || "N/A"}</TableCell>
                        <TableCell>
                          <Badge variant={
                            report.status === "pending" ? "destructive" :
                            report.status === "resolved" ? "default" : "secondary"
                          }>
                            {report.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDistanceToNow(new Date(report.created_at), { addSuffix: true })}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => updateReport.mutate({ 
                                id: report.id, 
                                status: "reviewed",
                                action_taken: "Under review"
                              })}
                            >
                              Review
                            </Button>
                            <Button 
                              size="sm" 
                              onClick={() => updateReport.mutate({ 
                                id: report.id, 
                                status: "resolved",
                                action_taken: "Resolved by admin"
                              })}
                            >
                              Resolve
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>

          {/* Ads Management */}
          <TabsContent value="ads">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Advertisement Management</h3>
                <Button>
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Create Ad
                </Button>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ads?.map((ad: any) => (
                      <TableRow key={ad.id}>
                        <TableCell className="font-medium">{ad.title}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{ad.position}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            ad.priority === "high" ? "destructive" :
                            ad.priority === "medium" ? "default" : "secondary"
                          }>
                            {ad.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={ad.is_active ? "default" : "secondary"}>
                            {ad.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">Edit</Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => deleteContent.mutate({ table: "ads", id: ad.id })}
                            >
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-6">Platform Analytics Dashboard</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-6 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Total Users</h4>
                  <p className="text-3xl font-bold text-primary">{analytics?.totalUsers || 0}</p>
                  <p className="text-sm text-muted-foreground mt-2">Platform-wide users</p>
                </div>
                
                <div className="p-6 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Total Artists</h4>
                  <p className="text-3xl font-bold text-primary">{analytics?.totalArtists || 0}</p>
                  <p className="text-sm text-muted-foreground mt-2">Active creators</p>
                </div>
                
                <div className="p-6 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Total Songs</h4>
                  <p className="text-3xl font-bold text-primary">{analytics?.totalSongs || 0}</p>
                  <p className="text-sm text-muted-foreground mt-2">Content library</p>
                </div>
                
                <div className="p-6 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Total Events</h4>
                  <p className="text-3xl font-bold text-primary">{analytics?.totalEvents || 0}</p>
                  <p className="text-sm text-muted-foreground mt-2">Scheduled events</p>
                </div>
                
                <div className="p-6 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Total Plays</h4>
                  <p className="text-3xl font-bold text-primary">{analytics?.totalPlays || 0}</p>
                  <p className="text-sm text-muted-foreground mt-2">All-time streams</p>
                </div>
                
                <div className="p-6 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Pending Reports</h4>
                  <p className="text-3xl font-bold text-primary">
                    {reports?.filter((r: any) => r.status === "pending").length || 0}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">Needs attention</p>
                </div>
              </div>

              <div className="mt-8">
                <h4 className="font-semibold mb-4">Quick Actions</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="justify-start">
                    <Ban className="w-4 h-4 mr-2" />
                    Manage Banned Users
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    Platform Settings
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    Export Data
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Advanced Analytics
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
