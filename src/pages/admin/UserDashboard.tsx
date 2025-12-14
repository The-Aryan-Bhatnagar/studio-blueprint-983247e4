import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Users, Activity, Clock, Shield, ArrowLeft, Search, MoreVertical, Ban, Trash2, Edit, Music, Heart, UserPlus, MessageSquare, Flag, TrendingUp, Globe, Calendar } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useAdminUsers, useAdminAnalytics, useAdminReports, useAdminComments, useAdminUserLocations, useAdminNewUsersThisWeek } from "@/hooks/useAdminData";
import { useTransparentLogo } from "@/hooks/useTransparentLogo";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";

const formatNumber = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
};

const UserDashboard = () => {
  const navigate = useNavigate();
  const { data: users = [], isLoading: usersLoading } = useAdminUsers();
  const { data: analytics } = useAdminAnalytics();
  const { data: reports = [] } = useAdminReports();
  const { data: comments = [] } = useAdminComments();
  const { data: locations = [] } = useAdminUserLocations();
  const { data: newUsersThisWeek = 0 } = useAdminNewUsersThisWeek();
  const logo = useTransparentLogo();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");

  // Real-time subscriptions
  useEffect(() => {
    const channel = supabase
      .channel("admin-users-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, () => {
        queryClient.invalidateQueries({ queryKey: ["admin-users"] });
        queryClient.invalidateQueries({ queryKey: ["admin-user-locations"] });
        queryClient.invalidateQueries({ queryKey: ["admin-new-users-week"] });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "reports" }, () => {
        queryClient.invalidateQueries({ queryKey: ["admin-reports"] });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "song_comments" }, () => {
        queryClient.invalidateQueries({ queryKey: ["admin-comments"] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const isLoading = usersLoading;
  const pendingReports = reports.filter((r: any) => r.status === "pending").length;

  // Filter users based on search
  const filteredUsers = users.filter((user: any) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      user.full_name?.toLowerCase().includes(query) ||
      user.phone_number?.toLowerCase().includes(query) ||
      user.city?.toLowerCase().includes(query) ||
      user.country?.toLowerCase().includes(query)
    );
  });

  // Calculate top country
  const topCountry = locations.length > 0 ? locations[0] : null;
  const totalLocatedUsers = locations.reduce((sum: number, loc: any) => sum + loc.count, 0);

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
          <div className="flex items-center gap-3">
            <img src={logo} alt="GREENBOXX Logo" className="w-10 h-10 object-contain" />
            <div>
              <h1 className="text-3xl font-bold">User Dashboard</h1>
              <p className="text-muted-foreground">Monitor and manage user activities • Real-time data</p>
            </div>
          </div>
        </div>

        {/* Stats Overview - Real data */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
              <Users className="w-5 h-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatNumber(users.length)}</div>
              <p className="text-xs text-muted-foreground mt-1">Registered users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Plays</CardTitle>
              <Activity className="w-5 h-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatNumber(analytics?.totalPlays || 0)}</div>
              <p className="text-xs text-muted-foreground mt-1">All-time streams</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Events</CardTitle>
              <Calendar className="w-5 h-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatNumber(analytics?.totalEvents || 0)}</div>
              <p className="text-xs text-muted-foreground mt-1">Created events</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Reports</CardTitle>
              <Shield className="w-5 h-5 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{pendingReports}</div>
              <p className="text-xs text-muted-foreground mt-1">Needs review</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different sections */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="activity">Activity & Comments</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* User Management Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>All Users ({filteredUsers.length})</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search users..." 
                      className="pl-8 w-[300px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No users found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user: any) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              {user.avatar_url ? (
                                <img src={user.avatar_url} alt={user.full_name} className="w-10 h-10 rounded-full object-cover" />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                  <Users className="w-5 h-5 text-primary" />
                                </div>
                              )}
                              <div>
                                <div className="font-medium">{user.full_name || "Unknown"}</div>
                                <div className="text-xs text-muted-foreground">
                                  {user.user_roles?.[0]?.role ? (
                                    <Badge variant="outline" className="text-xs">{user.user_roles[0].role}</Badge>
                                  ) : (
                                    <Badge variant="secondary" className="text-xs">user</Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{user.phone_number || "-"}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm">
                              <Globe className="w-3 h-3 text-muted-foreground" />
                              {user.city && user.country ? `${user.city}, ${user.country}` : user.country || "-"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}
                            </div>
                          </TableCell>
                          <TableCell>
                            {user.last_login ? (
                              <div className="text-sm">
                                <div className="flex items-center gap-1 text-muted-foreground">
                                  <Activity className="w-3 h-3" />
                                  {formatDistanceToNow(new Date(user.last_login.logged_in_at), { addSuffix: true })}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {user.last_login.device_type} • {user.last_login.browser}
                                </div>
                              </div>
                            ) : (
                              <span className="text-sm text-muted-foreground">Never</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem><Edit className="w-4 h-4 mr-2" />Edit Profile</DropdownMenuItem>
                                <DropdownMenuItem><Music className="w-4 h-4 mr-2" />View Playlists</DropdownMenuItem>
                                <DropdownMenuItem><Heart className="w-4 h-4 mr-2" />Liked Songs</DropdownMenuItem>
                                <DropdownMenuItem><Ban className="w-4 h-4 mr-2" />Block User</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive"><Trash2 className="w-4 h-4 mr-2" />Delete</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity & Comments Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Comments ({comments.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Comment</TableHead>
                      <TableHead>Song</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {comments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No comments yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      comments.map((comment: any) => (
                        <TableRow key={comment.id}>
                          <TableCell className="font-medium">
                            {comment.profiles?.full_name || "Unknown User"}
                          </TableCell>
                          <TableCell className="max-w-md truncate">{comment.content}</TableCell>
                          <TableCell>{comment.songs?.title || "Unknown Song"}</TableCell>
                          <TableCell>
                            {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem><MessageSquare className="w-4 h-4 mr-2" />View Full Comment</DropdownMenuItem>
                                <DropdownMenuItem><Ban className="w-4 h-4 mr-2" />Block from Commenting</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive"><Trash2 className="w-4 h-4 mr-2" />Delete Comment</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
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
                  <CardTitle className="text-sm font-medium">New Users This Week</CardTitle>
                  <UserPlus className="w-5 h-5 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{newUsersThisWeek}</div>
                  <p className="text-xs text-muted-foreground mt-1">In the last 7 days</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Artists</CardTitle>
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{analytics?.totalArtists || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">Registered artists</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Top Location</CardTitle>
                  <Globe className="w-5 h-5 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{topCountry?.country || "N/A"}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {topCountry ? `${Math.round((topCountry.count / totalLocatedUsers) * 100)}% of located users` : "No data"}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Users by Location</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Country</TableHead>
                      <TableHead>City</TableHead>
                      <TableHead>Users</TableHead>
                      <TableHead>Percentage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {locations.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          No location data available
                        </TableCell>
                      </TableRow>
                    ) : (
                      locations.slice(0, 10).map((location: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell>{location.country}</TableCell>
                          <TableCell>{location.city || "-"}</TableCell>
                          <TableCell>{location.count}</TableCell>
                          <TableCell>{((location.count / totalLocatedUsers) * 100).toFixed(1)}%</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Reports ({reports.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No reports yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      reports.map((report: any) => (
                        <TableRow key={report.id}>
                          <TableCell>
                            <Badge variant="outline">{report.reported_type}</Badge>
                          </TableCell>
                          <TableCell className="font-medium">{report.reason}</TableCell>
                          <TableCell className="max-w-xs truncate">{report.description || "-"}</TableCell>
                          <TableCell>
                            <Badge 
                              className={
                                report.status === "pending" ? "bg-yellow-500" :
                                report.status === "resolved" ? "bg-green-500" :
                                "bg-red-500"
                              }
                            >
                              {report.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {formatDistanceToNow(new Date(report.created_at), { addSuffix: true })}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem><Flag className="w-4 h-4 mr-2" />Review Report</DropdownMenuItem>
                                <DropdownMenuItem><Ban className="w-4 h-4 mr-2" />Take Action</DropdownMenuItem>
                                <DropdownMenuItem>Dismiss Report</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
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

export default UserDashboard;