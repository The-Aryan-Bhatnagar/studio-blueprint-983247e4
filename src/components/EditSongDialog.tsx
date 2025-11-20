import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { useUpdateSong } from "@/hooks/useSongs";
import { Upload, Music, Image } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface EditSongDialogProps {
  song: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditSongDialog = ({ song, open, onOpenChange }: EditSongDialogProps) => {
  const { toast } = useToast();
  const updateSong = useUpdateSong();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    lyrics: "",
    genre: "",
    category: "",
    featured_artists: "",
    tags: "",
  });

  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (song) {
      setFormData({
        title: song.title || "",
        description: song.description || "",
        lyrics: song.lyrics || "",
        genre: song.genre || "",
        category: song.category || "",
        featured_artists: song.featured_artists?.join(", ") || "",
        tags: song.tags?.join(", ") || "",
      });
    }
  }, [song]);

  // Don't render if no song is provided
  if (!song) return null;

  const uploadFile = async (file: File, bucket: string): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = fileName;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title) {
      toast({
        title: "Missing Required Fields",
        description: "Please provide song title",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      let audioUrl = song.audio_url;
      let coverUrl = song.cover_image_url;

      // Upload new audio file if selected
      if (audioFile) {
        audioUrl = await uploadFile(audioFile, 'song-audio');
      }

      // Upload new cover image if selected
      if (coverFile) {
        coverUrl = await uploadFile(coverFile, 'song-covers');
      }

      const updates = {
        title: formData.title,
        description: formData.description,
        lyrics: formData.lyrics,
        genre: formData.genre,
        category: formData.category,
        audio_url: audioUrl,
        cover_image_url: coverUrl,
        featured_artists: formData.featured_artists ? formData.featured_artists.split(",").map(a => a.trim()) : [],
        tags: formData.tags ? formData.tags.split(",").map(t => t.trim()) : [],
      };

      await updateSong.mutateAsync({ id: song.id, updates });
      toast({
        title: "Song Updated",
        description: `${formData.title} has been updated successfully!`,
      });
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Song</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title">Song Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter song title"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="genre">Genre</Label>
              <Select value={formData.genre} onValueChange={(value) => setFormData({ ...formData, genre: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pop">Pop</SelectItem>
                  <SelectItem value="rock">Rock</SelectItem>
                  <SelectItem value="hip-hop">Hip Hop</SelectItem>
                  <SelectItem value="electronic">Electronic</SelectItem>
                  <SelectItem value="jazz">Jazz</SelectItem>
                  <SelectItem value="classical">Classical</SelectItem>
                  <SelectItem value="r&b">R&B</SelectItem>
                  <SelectItem value="country">Country</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="album">Album</SelectItem>
                  <SelectItem value="ep">EP</SelectItem>
                  <SelectItem value="remix">Remix</SelectItem>
                  <SelectItem value="cover">Cover</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter song description"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="lyrics">Lyrics</Label>
            <Textarea
              id="lyrics"
              value={formData.lyrics}
              onChange={(e) => setFormData({ ...formData, lyrics: e.target.value })}
              placeholder="Enter song lyrics"
              rows={6}
            />
          </div>

          <div>
            <Label htmlFor="featured_artists">Featured Artists</Label>
            <Input
              id="featured_artists"
              value={formData.featured_artists}
              onChange={(e) => setFormData({ ...formData, featured_artists: e.target.value })}
              placeholder="e.g., Artist 1, Artist 2"
            />
            <p className="text-sm text-muted-foreground mt-1">Separate multiple artists with commas</p>
          </div>

          <div>
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="e.g., upbeat, summer, party"
            />
            <p className="text-sm text-muted-foreground mt-1">Separate multiple tags with commas</p>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="cover">Update Cover Image</Label>
              <div className="flex items-center gap-4 mt-2">
                {(coverFile || song.cover_image_url) && (
                  <img
                    src={coverFile ? URL.createObjectURL(coverFile) : song.cover_image_url}
                    alt="Cover preview"
                    className="w-20 h-20 object-cover rounded"
                  />
                )}
                <label
                  htmlFor="cover"
                  className="flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer hover:bg-accent"
                >
                  <Image className="w-4 h-4" />
                  {coverFile ? "Change Cover" : "Upload New Cover"}
                  <input
                    id="cover"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div>
              <Label htmlFor="audio">Replace Audio File</Label>
              <div className="flex items-center gap-4 mt-2">
                <label
                  htmlFor="audio"
                  className="flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer hover:bg-accent"
                >
                  <Music className="w-4 h-4" />
                  {audioFile ? audioFile.name : "Upload New Audio"}
                  <input
                    id="audio"
                    type="file"
                    accept="audio/*"
                    onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                </label>
                {audioFile && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setAudioFile(null)}
                  >
                    Remove
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={uploading}>
              {uploading ? "Updating..." : "Update Song"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditSongDialog;
