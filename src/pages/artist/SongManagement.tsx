import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useSongs, useDeleteSong, useUpdateSong } from "@/hooks/useSongs";
import { Edit, Trash2, BarChart3, Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import EditSongDialog from "@/components/EditSongDialog";
import { useState } from "react";

const SongManagement = () => {
  const { data: songs, isLoading } = useSongs();
  const deleteSong = useDeleteSong();
  const updateSong = useUpdateSong();
  const { toast } = useToast();
  const [editingSong, setEditingSong] = useState<any>(null);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      await deleteSong.mutateAsync(id);
      toast({
        title: "Song Deleted",
        description: `${title} has been removed`,
      });
    } catch (error: any) {
      toast({
        title: "Delete Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handlePublish = async (id: string, title: string) => {
    try {
      // Get song and artist info
      const song = songs?.find(s => s.id === id);
      if (!song) throw new Error('Song not found');

      // Publish the song
      await updateSong.mutateAsync({
        id,
        updates: { is_published: true, is_draft: false, published_at: new Date().toISOString() },
      });

      // Auto-post to community
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: artistProfile } = await supabase
          .from('artist_profiles')
          .select('id, stage_name')
          .eq('user_id', user.id)
          .single();

        if (artistProfile) {
          await supabase.from('community_posts').insert({
            artist_id: artistProfile.id,
            content: `🎵 New Release Alert! "${title}" is now available! Check it out now!`,
            media_type: 'image',
            media_url: song.cover_image_url,
          });

          // Notify followers
          const { data: followers } = await supabase
            .from('user_follows')
            .select('user_id')
            .eq('artist_id', artistProfile.id);

          if (followers && followers.length > 0) {
            const notifications = followers.map(follower => ({
              user_id: follower.user_id,
              type: 'new_release',
              title: 'New Song Release',
              message: `${artistProfile.stage_name} just released "${title}"!`,
              link: `/artist/${artistProfile.id}`,
              metadata: {
                song_id: id,
                artist_id: artistProfile.id,
              },
            }));

            await supabase.from('notifications').insert(notifications);
          }
        }
      }

      toast({
        title: "Song Published",
        description: `${title} is now live and your followers have been notified!`,
      });
    } catch (error: any) {
      toast({
        title: "Publish Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-muted-foreground">Loading your songs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">My Songs</h1>
          <p className="text-muted-foreground">Manage all your uploaded tracks</p>
        </div>
        <Link to="/artist/dashboard/upload">
          <Button className="bg-gradient-primary">Upload New Song</Button>
        </Link>
      </div>

      {!songs || songs.length === 0 ? (
        <Card className="p-12 text-center border-border">
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <Play className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">No songs yet</h3>
            <p className="text-muted-foreground">Start sharing your music by uploading your first song</p>
            <Link to="/artist/dashboard/upload">
              <Button className="bg-gradient-primary">Upload Your First Song</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <Card className="border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Song</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Plays</TableHead>
                <TableHead>Likes</TableHead>
                <TableHead>Comments</TableHead>
                <TableHead>Release</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {songs.map((song) => {
                const analytics = song.song_analytics;
                return (
                  <TableRow key={song.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {song.cover_image_url && (
                          <img src={song.cover_image_url} alt={song.title} className="w-10 h-10 rounded object-cover" />
                        )}
                        <div>
                          <p className="font-medium">{song.title}</p>
                          <p className="text-sm text-muted-foreground">{song.genre}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {song.is_published ? (
                        <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Published</Badge>
                      ) : song.is_scheduled ? (
                        <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">Scheduled</Badge>
                      ) : (
                        <Badge variant="outline">Draft</Badge>
                      )}
                    </TableCell>
                    <TableCell>{analytics?.total_plays?.toLocaleString() || 0}</TableCell>
                    <TableCell>{analytics?.total_likes?.toLocaleString() || 0}</TableCell>
                    <TableCell>{analytics?.total_comments?.toLocaleString() || 0}</TableCell>
                    <TableCell>
                      {song.is_scheduled && song.scheduled_release_at
                        ? new Date(song.scheduled_release_at).toLocaleDateString()
                        : song.published_at
                        ? new Date(song.published_at).toLocaleDateString()
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {!song.is_published && !song.is_scheduled && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handlePublish(song.id, song.title)}
                            title="Publish song"
                          >
                            <Play className="w-4 h-4" />
                          </Button>
                        )}
                        <Link to={`/artist/dashboard/songs/${song.id}/analytics`}>
                          <Button size="sm" variant="ghost" title="View analytics">
                            <BarChart3 className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          title="Edit song"
                          onClick={() => setEditingSong(song)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(song.id, song.title)}
                          title="Delete song"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}

      <EditSongDialog
        song={editingSong}
        open={!!editingSong}
        onOpenChange={(open) => !open && setEditingSong(null)}
      />
    </div>
  );
};

export default SongManagement;