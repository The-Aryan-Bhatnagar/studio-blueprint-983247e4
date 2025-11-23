import { useState } from "react";
import { Plus, ListPlus } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { usePlaylists } from "@/hooks/usePlaylists";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

interface AddToPlaylistDialogProps {
  songId: string;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const AddToPlaylistDialog = ({ songId, trigger, open: externalOpen, onOpenChange }: AddToPlaylistDialogProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  
  const { user } = useAuth();
  const { playlists, addSongToPlaylist, createPlaylist } = usePlaylists();

  // Use external open state if provided, otherwise use internal
  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  const handleAddToPlaylist = async (playlistId: string) => {
    try {
      await addSongToPlaylist.mutateAsync({ playlistId, songId });
      setOpen(false);
    } catch (error) {
      console.error("Error adding to playlist:", error);
    }
  };

  const handleCreateAndAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newPlaylist = await createPlaylist.mutateAsync({
        name,
        description,
        is_public: isPublic,
      });
      await addSongToPlaylist.mutateAsync({ 
        playlistId: newPlaylist.id, 
        songId 
      });
      setName("");
      setDescription("");
      setIsPublic(false);
      setShowCreateForm(false);
      setOpen(false);
      toast({
        title: "Success",
        description: "Playlist created and song added",
      });
    } catch (error) {
      console.error("Error creating playlist:", error);
    }
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add to Playlist</DialogTitle>
          <DialogDescription>
            {showCreateForm ? "Create a new playlist" : "Choose a playlist or create a new one"}
          </DialogDescription>
        </DialogHeader>
        
        {!showCreateForm ? (
          <>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => setShowCreateForm(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Playlist
            </Button>
            
            {playlists.length > 0 && (
              <>
                <Separator />
                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-2">
                    {playlists.map((playlist) => (
                      <Button
                        key={playlist.id}
                        variant="outline"
                        className="w-full justify-start h-auto py-3"
                        onClick={() => handleAddToPlaylist(playlist.id)}
                        disabled={addSongToPlaylist.isPending}
                      >
                        <div className="flex flex-col items-start">
                          <span className="font-medium">{playlist.name}</span>
                          {playlist.description && (
                            <span className="text-xs text-muted-foreground line-clamp-1">
                              {playlist.description}
                            </span>
                          )}
                        </div>
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </>
            )}

            {playlists.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No playlists yet</p>
                <p className="text-sm">Create your first playlist above</p>
              </div>
            )}
          </>
        ) : (
          <form onSubmit={handleCreateAndAdd} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Playlist Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My Awesome Playlist"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your playlist..."
                rows={3}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="public"
                checked={isPublic}
                onCheckedChange={setIsPublic}
              />
              <Label htmlFor="public">Make playlist public</Label>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setShowCreateForm(false)}
              >
                Back
              </Button>
              <Button 
                type="submit" 
                className="flex-1"
                disabled={createPlaylist.isPending}
              >
                Create & Add Song
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
