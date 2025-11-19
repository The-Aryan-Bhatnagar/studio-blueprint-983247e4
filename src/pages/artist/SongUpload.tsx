import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useCreateSong } from "@/hooks/useSongs";
import { useNavigate } from "react-router-dom";
import { Upload, Calendar, MessageCircle, Music, Image } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";

const SongUpload = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const createSong = useCreateSong();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    lyrics: "",
    audio_url: "",
    cover_image_url: "",
    genre: "",
    category: "",
    featured_artists: "",
    tags: "",
    comment_limit_type: "unlimited",
    comment_limit_count: 0,
    is_scheduled: false,
    scheduled_release_at: "",
    is_draft: true,
    is_published: false,
  });

  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const uploadFile = async (file: File, bucket: string): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = fileName;

    const { error: uploadError, data } = await supabase.storage
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

  const handleSubmit = async (e: React.FormEvent, isDraft: boolean) => {
    e.preventDefault();

    if (!formData.title || (!formData.audio_url && !audioFile)) {
      toast({
        title: "Missing Required Fields",
        description: "Please provide song title and audio file",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      let audioUrl = formData.audio_url;
      let coverUrl = formData.cover_image_url;

      // Upload audio file if selected
      if (audioFile) {
        audioUrl = await uploadFile(audioFile, 'song-audio');
      }

      // Upload cover image if selected
      if (coverFile) {
        coverUrl = await uploadFile(coverFile, 'song-covers');
      }

      const songData = {
        ...formData,
        audio_url: audioUrl,
        cover_image_url: coverUrl,
        featured_artists: formData.featured_artists ? formData.featured_artists.split(",").map(a => a.trim()) : [],
        tags: formData.tags ? formData.tags.split(",").map(t => t.trim()) : [],
        scheduled_release_at: formData.is_scheduled && formData.scheduled_release_at ? new Date(formData.scheduled_release_at).toISOString() : null,
        is_draft: isDraft,
        is_published: !isDraft && !formData.is_scheduled,
      };

      await createSong.mutateAsync(songData);
      toast({
        title: "Song Uploaded Successfully",
        description: `${formData.title} has been saved as ${isDraft ? "draft" : "published"}!`,
      });
      navigate("/artist/dashboard/songs");
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">Upload New Song</h1>
        <p className="text-muted-foreground">Share your music with the world</p>
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        <Card className="p-6 border-border">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Upload className="w-5 h-5 text-primary" />
            Basic Information
          </h2>
          
          <div className="space-y-4">
          <div>
              <Label htmlFor="audio_file" className="flex items-center gap-2">
                <Music className="w-4 h-4 text-primary" />
                Audio File *
              </Label>
              <Input
                id="audio_file"
                type="file"
                accept="audio/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setAudioFile(file);
                    setFormData({ ...formData, audio_url: "" });
                  }
                }}
                className="cursor-pointer"
              />
              {audioFile && (
                <p className="text-sm text-muted-foreground mt-1">
                  Selected: {audioFile.name}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="cover_file" className="flex items-center gap-2">
                <Image className="w-4 h-4 text-primary" />
                Cover Image
              </Label>
              <Input
                id="cover_file"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setCoverFile(file);
                    setFormData({ ...formData, cover_image_url: "" });
                  }
                }}
                className="cursor-pointer"
              />
              {coverFile && (
                <p className="text-sm text-muted-foreground mt-1">
                  Selected: {coverFile.name}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="title">Song Title *</Label>
              <Input
                id="title"
                placeholder="Enter song title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="genre">Genre</Label>
                <Select value={formData.genre} onValueChange={(value) => setFormData({ ...formData, genre: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select genre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="punjabi">Punjabi</SelectItem>
                    <SelectItem value="bollywood">Bollywood</SelectItem>
                    <SelectItem value="indie">Indie</SelectItem>
                    <SelectItem value="pop">Pop</SelectItem>
                    <SelectItem value="hip-hop">Hip Hop</SelectItem>
                    <SelectItem value="rock">Rock</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  placeholder="e.g., Single, Album"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="featured_artists">Featured Artists</Label>
              <Input
                id="featured_artists"
                placeholder="Comma separated (Artist 1, Artist 2)"
                value={formData.featured_artists}
                onChange={(e) => setFormData({ ...formData, featured_artists: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                placeholder="Comma separated (love, party, trending)"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Tell us about your song..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="lyrics">Lyrics</Label>
              <Textarea
                id="lyrics"
                placeholder="Enter lyrics (optional)"
                value={formData.lyrics}
                onChange={(e) => setFormData({ ...formData, lyrics: e.target.value })}
                rows={6}
              />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-border">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            Comment Settings
          </h2>

          <div className="space-y-4">
            <div>
              <Label>Comment Limit Type</Label>
              <Select
                value={formData.comment_limit_type}
                onValueChange={(value) => setFormData({ ...formData, comment_limit_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unlimited">Unlimited Comments</SelectItem>
                  <SelectItem value="followers">Only Followers</SelectItem>
                  <SelectItem value="subscribers">Only Subscribers</SelectItem>
                  <SelectItem value="custom">Custom Limit</SelectItem>
                  <SelectItem value="none">No Comments</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.comment_limit_type === "custom" && (
              <div>
                <Label htmlFor="comment_limit_count">Maximum Comments</Label>
                <Input
                  id="comment_limit_count"
                  type="number"
                  min="0"
                  value={formData.comment_limit_count}
                  onChange={(e) => setFormData({ ...formData, comment_limit_count: parseInt(e.target.value) })}
                />
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6 border-border">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Release Schedule
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Schedule Release</Label>
                <p className="text-sm text-muted-foreground">Set a future date and time for release</p>
              </div>
              <Switch
                checked={formData.is_scheduled}
                onCheckedChange={(checked) => setFormData({ ...formData, is_scheduled: checked })}
              />
            </div>

            {formData.is_scheduled && (
              <div>
                <Label htmlFor="scheduled_release_at">Release Date & Time</Label>
                <Input
                  id="scheduled_release_at"
                  type="datetime-local"
                  value={formData.scheduled_release_at}
                  onChange={(e) => setFormData({ ...formData, scheduled_release_at: e.target.value })}
                />
              </div>
            )}
          </div>
        </Card>

        <div className="flex gap-3">
          <Button
            type="button"
            className="bg-gradient-primary"
            disabled={uploading || createSong.isPending}
            onClick={(e) => handleSubmit(e as any, false)}
          >
            {uploading ? "Uploading..." : formData.is_scheduled ? "Schedule Song" : "Publish Now"}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={uploading || createSong.isPending}
            onClick={(e) => handleSubmit(e as any, true)}
          >
            {uploading ? "Uploading..." : "Save as Draft"}
          </Button>
          <Button 
            type="button" 
            variant="ghost" 
            disabled={uploading}
            onClick={() => navigate("/artist/dashboard")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SongUpload;