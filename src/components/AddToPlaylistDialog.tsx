import { useState } from "react";
import { ListPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePlaylists } from "@/hooks/usePlaylists";
import { useAuth } from "@/contexts/AuthContext";

interface AddToPlaylistDialogProps {
  songId: string;
  trigger?: React.ReactNode;
}

export const AddToPlaylistDialog = ({ songId, trigger }: AddToPlaylistDialogProps) => {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const { playlists, addSongToPlaylist } = usePlaylists();

  const handleAddToPlaylist = async (playlistId: string) => {
    await addSongToPlaylist.mutateAsync({ playlistId, songId });
    setOpen(false);
  };

  if (!user) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm">
            <ListPlus className="h-4 w-4 mr-2" />
            Add to Playlist
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add to Playlist</DialogTitle>
          <DialogDescription>
            Choose a playlist to add this song to
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[300px] pr-4">
          {playlists.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No playlists yet</p>
              <p className="text-sm">Create your first playlist to get started</p>
            </div>
          ) : (
            <div className="space-y-2">
              {playlists.map((playlist) => (
                <Button
                  key={playlist.id}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleAddToPlaylist(playlist.id)}
                >
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{playlist.name}</span>
                    {playlist.description && (
                      <span className="text-xs text-muted-foreground">
                        {playlist.description}
                      </span>
                    )}
                  </div>
                </Button>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
