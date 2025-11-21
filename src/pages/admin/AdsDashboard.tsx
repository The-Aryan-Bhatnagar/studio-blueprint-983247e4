import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Eye, MousePointerClick, DollarSign, TrendingUp, ArrowLeft, Search, MoreVertical, Plus, Edit, Trash2, PlayCircle, PauseCircle, BarChart3, Target, Calendar, MapPin, Users } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useAdminAds } from "@/hooks/useAdminData";
import { useTransparentLogo } from "@/hooks/useTransparentLogo";

const AdsDashboard = () => {
  const navigate = useNavigate();
  const { data: ads, isLoading } = useAdminAds();
  const logo = useTransparentLogo();

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
              <h1 className="text-3xl font-bold">Ads Management Dashboard</h1>
              <p className="text-muted-foreground">Monitor and manage advertising campaigns</p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Impressions</CardTitle>
              <Eye className="w-5 h-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">1.2M</div>
              <p className="text-xs text-emerald-500 mt-1">+22.5% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Clicks</CardTitle>
              <MousePointerClick className="w-5 h-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">48,234</div>
              <p className="text-xs text-emerald-500 mt-1">+18.3% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Ad Revenue</CardTitle>
              <DollarSign className="w-5 h-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">$28,450</div>
              <p className="text-xs text-emerald-500 mt-1">+12.7% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Average CTR</CardTitle>
              <TrendingUp className="w-5 h-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">4.02%</div>
              <p className="text-xs text-emerald-500 mt-1">+2.1% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different sections */}
        <Tabs defaultValue="campaigns" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="campaigns">Ad Campaigns</TabsTrigger>
            <TabsTrigger value="create">Create Ad</TabsTrigger>
            <TabsTrigger value="placements">Ad Placements</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          {/* Ad Campaigns Tab */}
          <TabsContent value="campaigns" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>All Ad Campaigns</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search campaigns..." className="pl-8 w-[300px]" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Campaign Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Impressions</TableHead>
                      <TableHead>Clicks</TableHead>
                      <TableHead>CTR</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Summer Festival Promo</TableCell>
                      <TableCell><Badge variant="outline">Banner</Badge></TableCell>
                      <TableCell>245K</TableCell>
                      <TableCell>9.8K</TableCell>
                      <TableCell>4.0%</TableCell>
                      <TableCell>$4,890</TableCell>
                      <TableCell><Badge className="bg-emerald-500">Active</Badge></TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem><Edit className="w-4 h-4 mr-2" />Edit Campaign</DropdownMenuItem>
                            <DropdownMenuItem><BarChart3 className="w-4 h-4 mr-2" />View Analytics</DropdownMenuItem>
                            <DropdownMenuItem><PauseCircle className="w-4 h-4 mr-2" />Pause Campaign</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive"><Trash2 className="w-4 h-4 mr-2" />Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">New Album Launch</TableCell>
                      <TableCell><Badge variant="outline">Video</Badge></TableCell>
                      <TableCell>189K</TableCell>
                      <TableCell>7.2K</TableCell>
                      <TableCell>3.8%</TableCell>
                      <TableCell>$3,600</TableCell>
                      <TableCell><Badge className="bg-emerald-500">Active</Badge></TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem><Edit className="w-4 h-4 mr-2" />Edit Campaign</DropdownMenuItem>
                            <DropdownMenuItem><BarChart3 className="w-4 h-4 mr-2" />View Analytics</DropdownMenuItem>
                            <DropdownMenuItem><PauseCircle className="w-4 h-4 mr-2" />Pause Campaign</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive"><Trash2 className="w-4 h-4 mr-2" />Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Artist Spotlight</TableCell>
                      <TableCell><Badge variant="outline">Audio</Badge></TableCell>
                      <TableCell>156K</TableCell>
                      <TableCell>5.9K</TableCell>
                      <TableCell>3.8%</TableCell>
                      <TableCell>$2,950</TableCell>
                      <TableCell><Badge className="bg-yellow-500">Paused</Badge></TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem><PlayCircle className="w-4 h-4 mr-2" />Resume Campaign</DropdownMenuItem>
                            <DropdownMenuItem><Edit className="w-4 h-4 mr-2" />Edit Campaign</DropdownMenuItem>
                            <DropdownMenuItem><BarChart3 className="w-4 h-4 mr-2" />View Analytics</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive"><Trash2 className="w-4 h-4 mr-2" />Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Create Ad Tab */}
          <TabsContent value="create" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Create New Ad Campaign</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="campaign-name">Campaign Name</Label>
                    <Input id="campaign-name" placeholder="Enter campaign name" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="ad-type">Ad Type</Label>
                    <Select>
                      <SelectTrigger id="ad-type">
                        <SelectValue placeholder="Select ad type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="banner">Banner Image</SelectItem>
                        <SelectItem value="video">Video Ad</SelectItem>
                        <SelectItem value="audio">Audio Ad</SelectItem>
                        <SelectItem value="fullscreen">Full-screen Popup</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Enter ad description" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="website-link">Website Link</Label>
                    <Input id="website-link" placeholder="https://..." />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="placement">Ad Placement</Label>
                    <Select>
                      <SelectTrigger id="placement">
                        <SelectValue placeholder="Select placement" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="home-banner">Home Page Banner</SelectItem>
                        <SelectItem value="artist-profile">Artist Profile Banner</SelectItem>
                        <SelectItem value="song-page">Song Page Ad</SelectItem>
                        <SelectItem value="playlist">Playlist Page Ad</SelectItem>
                        <SelectItem value="community">Community Page Ad</SelectItem>
                        <SelectItem value="audio-between">Audio Between Songs</SelectItem>
                        <SelectItem value="video-before">Video Before Music</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-date">Start Date</Label>
                    <Input id="start-date" type="date" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="end-date">End Date</Label>
                    <Input id="end-date" type="date" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="impressions">Target Impressions</Label>
                    <Input id="impressions" type="number" placeholder="100000" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="age-target">Age Target</Label>
                    <Select>
                      <SelectTrigger id="age-target">
                        <SelectValue placeholder="All ages" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Ages</SelectItem>
                        <SelectItem value="18-24">18-24</SelectItem>
                        <SelectItem value="25-34">25-34</SelectItem>
                        <SelectItem value="35-44">35-44</SelectItem>
                        <SelectItem value="45+">45+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location-target">Location Target</Label>
                    <Input id="location-target" placeholder="All locations" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category-target">Category Target</Label>
                  <Select>
                    <SelectTrigger id="category-target">
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="pop">Pop</SelectItem>
                      <SelectItem value="rock">Rock</SelectItem>
                      <SelectItem value="hiphop">Hip Hop</SelectItem>
                      <SelectItem value="electronic">Electronic</SelectItem>
                      <SelectItem value="rnb">R&B</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ad-file">Upload Ad File</Label>
                  <Input id="ad-file" type="file" accept="image/*,video/*,audio/*" />
                </div>

                <div className="flex gap-4">
                  <Button className="flex-1"><Plus className="w-4 h-4 mr-2" />Create Campaign</Button>
                  <Button variant="outline">Save as Draft</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Ad Placements Tab */}
          <TabsContent value="placements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Ad Placement Controls</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">Home Page Banner</CardTitle>
                        <Badge className="bg-emerald-500">Active</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">Top banner on home page</p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline"><Edit className="w-3 h-3 mr-1" />Configure</Button>
                        <Button size="sm" variant="outline"><BarChart3 className="w-3 h-3 mr-1" />Stats</Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">Artist Profile Banner</CardTitle>
                        <Badge className="bg-emerald-500">Active</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">Banner on artist profile pages</p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline"><Edit className="w-3 h-3 mr-1" />Configure</Button>
                        <Button size="sm" variant="outline"><BarChart3 className="w-3 h-3 mr-1" />Stats</Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">Audio Ads Between Songs</CardTitle>
                        <Badge variant="secondary">Inactive</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">Play ads between songs</p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline"><Edit className="w-3 h-3 mr-1" />Configure</Button>
                        <Button size="sm" variant="outline"><BarChart3 className="w-3 h-3 mr-1" />Stats</Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">Full-screen Popup</CardTitle>
                        <Badge className="bg-emerald-500">Active</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">Full-screen interstitial ads</p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline"><Edit className="w-3 h-3 mr-1" />Configure</Button>
                        <Button size="sm" variant="outline"><BarChart3 className="w-3 h-3 mr-1" />Stats</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Average CPM</CardTitle>
                  <DollarSign className="w-5 h-5 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">$23.75</div>
                  <p className="text-xs text-emerald-500 mt-1">+5.2% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Average CPC</CardTitle>
                  <MousePointerClick className="w-5 h-5 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">$0.59</div>
                  <p className="text-xs text-emerald-500 mt-1">-3.1% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                  <DollarSign className="w-5 h-5 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">$128,450</div>
                  <p className="text-xs text-emerald-500 mt-1">+18.7% from last month</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Campaign Performance Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Campaign</TableHead>
                      <TableHead>Impressions</TableHead>
                      <TableHead>Clicks</TableHead>
                      <TableHead>CTR</TableHead>
                      <TableHead>CPM</TableHead>
                      <TableHead>CPC</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>ROI</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Summer Festival Promo</TableCell>
                      <TableCell>245K</TableCell>
                      <TableCell>9.8K</TableCell>
                      <TableCell>4.0%</TableCell>
                      <TableCell>$19.96</TableCell>
                      <TableCell>$0.50</TableCell>
                      <TableCell>$4,890</TableCell>
                      <TableCell className="text-emerald-500">+245%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">New Album Launch</TableCell>
                      <TableCell>189K</TableCell>
                      <TableCell>7.2K</TableCell>
                      <TableCell>3.8%</TableCell>
                      <TableCell>$19.05</TableCell>
                      <TableCell>$0.50</TableCell>
                      <TableCell>$3,600</TableCell>
                      <TableCell className="text-emerald-500">+180%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Smart Ad Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Auto-rotation</h4>
                    <p className="text-sm text-muted-foreground">Automatically rotate ads based on performance</p>
                  </div>
                  <Badge className="bg-emerald-500">Enabled</Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Frequency Capping</h4>
                    <p className="text-sm text-muted-foreground">Limit ad impressions per user</p>
                  </div>
                  <Badge className="bg-emerald-500">Enabled</Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">A/B Testing</h4>
                    <p className="text-sm text-muted-foreground">Test multiple ad variations</p>
                  </div>
                  <Badge variant="secondary">Disabled</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdsDashboard;
