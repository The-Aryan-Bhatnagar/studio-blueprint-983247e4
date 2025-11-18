import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, Music, Calendar, MessageSquare, TrendingUp, Shield, Upload, Image, Video } from "lucide-react";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your platform</p>
          </div>
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-primary" />
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Users</p>
                <p className="text-3xl font-bold">12,543</p>
                <p className="text-xs text-green-500 mt-1">+12% this month</p>
              </div>
              <Users className="w-10 h-10 text-primary" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Artists</p>
                <p className="text-3xl font-bold">342</p>
                <p className="text-xs text-green-500 mt-1">+8% this month</p>
              </div>
              <Music className="w-10 h-10 text-primary" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Songs</p>
                <p className="text-3xl font-bold">4,821</p>
                <p className="text-xs text-green-500 mt-1">+15% this month</p>
              </div>
              <TrendingUp className="w-10 h-10 text-primary" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Active Events</p>
                <p className="text-3xl font-bold">28</p>
                <p className="text-xs text-blue-500 mt-1">6 this week</p>
              </div>
              <Calendar className="w-10 h-10 text-primary" />
            </div>
          </Card>
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="artists" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="media">Media Upload</TabsTrigger>
            <TabsTrigger value="artists">Manage Artists</TabsTrigger>
            <TabsTrigger value="songs">Manage Songs</TabsTrigger>
            <TabsTrigger value="users">Manage Users</TabsTrigger>
            <TabsTrigger value="events">Manage Events</TabsTrigger>
          </TabsList>

          <TabsContent value="media">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Upload Media Content</h3>
              <p className="text-muted-foreground mb-6">
                Add images, videos, and other media for the platform
              </p>
              
              <div className="space-y-6">
                {/* Image Upload */}
                <div className="space-y-3">
                  <Label htmlFor="image-upload" className="text-base font-semibold flex items-center gap-2">
                    <Image className="w-5 h-5" />
                    Upload Images
                  </Label>
                  <div className="flex items-center gap-4">
                    <Input 
                      id="image-upload" 
                      type="file" 
                      accept="image/*"
                      multiple
                      className="flex-1"
                    />
                    <Button>Upload Images</Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Supported formats: JPG, PNG, WEBP (Max 5MB each)
                  </p>
                </div>

                {/* Video Upload */}
                <div className="space-y-3">
                  <Label htmlFor="video-upload" className="text-base font-semibold flex items-center gap-2">
                    <Video className="w-5 h-5" />
                    Upload Videos
                  </Label>
                  <div className="flex items-center gap-4">
                    <Input 
                      id="video-upload" 
                      type="file" 
                      accept="video/*"
                      className="flex-1"
                    />
                    <Button>Upload Video</Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Supported formats: MP4, WEBM (Max 100MB)
                  </p>
                </div>

                {/* Audio Upload */}
                <div className="space-y-3">
                  <Label htmlFor="audio-upload" className="text-base font-semibold flex items-center gap-2">
                    <Music className="w-5 h-5" />
                    Upload Audio Files
                  </Label>
                  <div className="flex items-center gap-4">
                    <Input 
                      id="audio-upload" 
                      type="file" 
                      accept="audio/*"
                      multiple
                      className="flex-1"
                    />
                    <Button>Upload Audio</Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Supported formats: MP3, WAV, M4A (Max 20MB each)
                  </p>
                </div>

                {/* Recent Uploads */}
                <div className="mt-8">
                  <h4 className="text-lg font-semibold mb-4">Recent Uploads</h4>
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                        <div className="flex items-center gap-4">
                          <Upload className="w-8 h-8 text-primary" />
                          <div>
                            <p className="font-semibold">media-file-{i}.jpg</p>
                            <p className="text-sm text-muted-foreground">Uploaded 2 hours ago</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">View</Button>
                          <Button size="sm" variant="destructive">Delete</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="artists">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Artist Management</h3>
              <p className="text-muted-foreground mb-4">
                Approve, manage, or remove artist profiles
              </p>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary" />
                      <div>
                        <p className="font-semibold">Artist {i}</p>
                        <p className="text-sm text-muted-foreground">Pending approval</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">View</Button>
                      <Button size="sm">Approve</Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="songs">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Song Management</h3>
              <p className="text-muted-foreground mb-4">
                Review and manage uploaded songs
              </p>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                    <div className="flex items-center gap-4">
                      <Music className="w-10 h-10 text-primary" />
                      <div>
                        <p className="font-semibold">Song Title {i}</p>
                        <p className="text-sm text-muted-foreground">By Artist Name</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Edit</Button>
                      <Button size="sm" variant="destructive">Remove</Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">User Management</h3>
              <p className="text-muted-foreground mb-4">
                Manage user accounts and permissions
              </p>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                    <div className="flex items-center gap-4">
                      <Users className="w-10 h-10 text-primary" />
                      <div>
                        <p className="font-semibold">User {i}</p>
                        <p className="text-sm text-muted-foreground">user{i}@email.com</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">View</Button>
                      <Button size="sm" variant="destructive">Suspend</Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="events">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Event Management</h3>
              <p className="text-muted-foreground mb-4">
                Manage upcoming and past events
              </p>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                    <div className="flex items-center gap-4">
                      <Calendar className="w-10 h-10 text-primary" />
                      <div>
                        <p className="font-semibold">Event {i}</p>
                        <p className="text-sm text-muted-foreground">Upcoming on Dec {i + 15}, 2024</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Edit</Button>
                      <Button size="sm" variant="destructive">Cancel</Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
