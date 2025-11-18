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
import { Upload, Calendar, MessageCircle } from "lucide-react";
import { Switch } from "@/components/ui/switch";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.audio_url) {
      toast({
        title: "Missing Required Fields",
        description: "Please provide song title and audio file",
        variant: "destructive",
      });
      return;
    }

    const songData = {
      ...formData,
      featured_artists: formData.featured_artists ? formData.featured_artists.split(",").map(a => a.trim()) : [],
      tags: formData.tags ? formData.tags.split(",").map(t => t.trim()) : [],
      scheduled_release_at: formData.is_scheduled && formData.scheduled_release_at ? new Date(formData.scheduled_release_at).toISOString() : null,
    };

    try {
      await createSong.mutateAsync(songData);
      toast({
        title: "Song Uploaded Successfully",
        description: `${formData.title} has been saved as ${formData.is_draft ? "draft" : "published"}!`,
      });
      navigate("/artist/dashboard/songs");
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">Upload New Song</h1>
        <p className="text-muted-foreground">Share your music with the world</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6 border-border">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Upload className="w-5 h-5 text-primary" />
            Basic Information
          </h2>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="audio_url">Audio File URL *</Label>
              <Input
                id="audio_url"
                placeholder="https://example.com/song.mp3"
                value={formData.audio_url}
                onChange={(e) => setFormData({ ...formData, audio_url: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="cover_image_url">Cover Image URL</Label>
              <Input
                id="cover_image_url"
                placeholder="https://example.com/cover.jpg"
                value={formData.cover_image_url}
                onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value })}
              />
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
            type="submit"
            className="bg-gradient-primary"
            disabled={createSong.isPending}
            onClick={() => setFormData({ ...formData, is_draft: false, is_published: !formData.is_scheduled })}
          >
            {formData.is_scheduled ? "Schedule Song" : "Publish Now"}
          </Button>
          <Button
            type="submit"
            variant="outline"
            disabled={createSong.isPending}
            onClick={() => setFormData({ ...formData, is_draft: true, is_published: false })}
          >
            Save as Draft
          </Button>
          <Button type="button" variant="ghost" onClick={() => navigate("/artist/dashboard")}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SongUpload;