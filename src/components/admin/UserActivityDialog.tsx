import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Music, Heart, ListMusic, Clock, Play, Calendar, Globe, Phone, Mail, User } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

interface UserActivityDialogProps {
  user: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UserActivityDialog = ({ user, open, onOpenChange }: UserActivityDialogProps) => {
  // Fetch user's playlists
  const { data: playlists = [] } = useQuery({
    queryKey: ["admin-user-playlists", user?.user_id],
    queryFn: async () => {
      if (!user?.user_id) return [];
      const { data, error } = await supabase
        .from("playlists")
        .select("*, playlist_songs(count)")
        .eq("user_id", user.user_id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user?.user_id && open,
  });

  // Fetch user's liked songs
  const { data: likedSongs = [] } = useQuery({
    queryKey: ["admin-user-likes", user?.user_id],
    queryFn: async () => {
      if (!user?.user_id) return [];
      const { data, error } = await supabase
        .from("user_song_likes")
        .select(`
          *,
          songs(title, cover_image_url, artist_profiles(stage_name))
        `)
        .eq("user_id", user.user_id)
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data;
    },
    enabled: !!user?.user_id && open,
  });

  // Fetch user's play history
  const { data: playHistory = [] } = useQuery({
    queryKey: ["admin-user-plays", user?.user_id],
    queryFn: async () => {
      if (!user?.user_id) return [];
      const { data, error } = await supabase
        .from("play_history")
        .select(`
          *,
          songs(title, cover_image_url, artist_profiles(stage_name))
        `)
        .eq("user_id", user.user_id)
        .order("played_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data;
    },
    enabled: !!user?.user_id && open,
  });

  // Fetch user's login history
  const { data: loginHistory = [] } = useQuery({
    queryKey: ["admin-user-logins", user?.user_id],
    queryFn: async () => {
      if (!user?.user_id) return [];
      const { data, error } = await supabase
        .from("login_history")
        .select("*")
        .eq("user_id", user.user_id)
        .order("logged_in_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data;
    },
    enabled: !!user?.user_id && open,
  });

  if (!user) return null;

  const calculateAge = (dob: string) => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {user.avatar_url ? (
              <img src={user.avatar_url} alt={user.full_name} className="w-12 h-12 rounded-full object-cover" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-6 h-6 text-primary" />
              </div>
            )}
            <div>
              <div className="text-xl">{user.full_name || "Unknown User"}</div>
              <div className="text-sm text-muted-foreground font-normal">User Activity Details</div>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* User Info Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-b">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span className="truncate">{user.email || "No email"}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Phone className="w-4 h-4 text-muted-foreground" />
            <span>{user.phone_number || "No phone"}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Globe className="w-4 h-4 text-muted-foreground" />
            <span>{user.city && user.country ? `${user.city}, ${user.country}` : "No location"}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span>
              {user.date_of_birth 
                ? `${format(new Date(user.date_of_birth), "MMM d, yyyy")} (${calculateAge(user.date_of_birth)} yrs)`
                : "No DOB"}
            </span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 py-4">
          <Card className="p-3">
            <div className="flex items-center gap-2">
              <ListMusic className="w-5 h-5 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">{playlists.length}</div>
                <div className="text-xs text-muted-foreground">Playlists</div>
              </div>
            </div>
          </Card>
          <Card className="p-3">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              <div>
                <div className="text-2xl font-bold">{likedSongs.length}</div>
                <div className="text-xs text-muted-foreground">Liked Songs</div>
              </div>
            </div>
          </Card>
          <Card className="p-3">
            <div className="flex items-center gap-2">
              <Play className="w-5 h-5 text-green-500" />
              <div>
                <div className="text-2xl font-bold">{playHistory.length}</div>
                <div className="text-xs text-muted-foreground">Plays</div>
              </div>
            </div>
          </Card>
          <Card className="p-3">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-500" />
              <div>
                <div className="text-2xl font-bold">{loginHistory.length}</div>
                <div className="text-xs text-muted-foreground">Logins</div>
              </div>
            </div>
          </Card>
        </div>

        <Tabs defaultValue="playlists" className="flex-1">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="playlists">Playlists</TabsTrigger>
            <TabsTrigger value="likes">Liked Songs</TabsTrigger>
            <TabsTrigger value="history">Play History</TabsTrigger>
            <TabsTrigger value="logins">Login History</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[300px] mt-4">
            <TabsContent value="playlists" className="mt-0">
              {playlists.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No playlists created</div>
              ) : (
                <div className="space-y-2">
                  {playlists.map((playlist: any) => (
                    <div key={playlist.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <ListMusic className="w-8 h-8 text-primary" />
                      <div className="flex-1">
                        <div className="font-medium">{playlist.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {playlist.playlist_songs?.[0]?.count || 0} songs • 
                          {playlist.is_public ? " Public" : " Private"}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(playlist.created_at), { addSuffix: true })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="likes" className="mt-0">
              {likedSongs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No liked songs</div>
              ) : (
                <div className="space-y-2">
                  {likedSongs.map((like: any) => (
                    <div key={like.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      {like.songs?.cover_image_url ? (
                        <img src={like.songs.cover_image_url} alt={like.songs.title} className="w-10 h-10 rounded object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                          <Music className="w-5 h-5 text-primary" />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="font-medium">{like.songs?.title || "Unknown Song"}</div>
                        <div className="text-sm text-muted-foreground">
                          {like.songs?.artist_profiles?.stage_name || "Unknown Artist"}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(like.created_at), { addSuffix: true })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="history" className="mt-0">
              {playHistory.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No play history</div>
              ) : (
                <div className="space-y-2">
                  {playHistory.map((play: any) => (
                    <div key={play.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      {play.songs?.cover_image_url ? (
                        <img src={play.songs.cover_image_url} alt={play.songs.title} className="w-10 h-10 rounded object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                          <Music className="w-5 h-5 text-primary" />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="font-medium">{play.songs?.title || "Unknown Song"}</div>
                        <div className="text-sm text-muted-foreground">
                          {play.songs?.artist_profiles?.stage_name || "Unknown Artist"}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(play.played_at), { addSuffix: true })}
                        </div>
                        <Badge variant="outline" className="text-xs">{play.device_type || "unknown"}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="logins" className="mt-0">
              {loginHistory.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No login history</div>
              ) : (
                <div className="space-y-2">
                  {loginHistory.map((login: any) => (
                    <div key={login.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <Clock className="w-8 h-8 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="font-medium">
                          {format(new Date(login.logged_in_at), "MMM d, yyyy 'at' h:mm a")}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {login.device_type} • {login.browser} {login.location && `• ${login.location}`}
                        </div>
                      </div>
                      <Badge variant="outline">{login.device_type}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default UserActivityDialog;