import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useArtistProfile, useUpdateArtistProfile } from "@/hooks/useArtistProfile";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { User, Music, LogOut } from "lucide-react";

const ArtistSettings = () => {
  const { data: artistProfile, isLoading } = useArtistProfile();
  const updateProfile = useUpdateArtistProfile();
  const { toast } = useToast();
  const { signOut } = useAuth();

  const [formData, setFormData] = useState({
    stage_name: "",
    bio: "",
    avatar_url: "",
    cover_image_url: "",
    instagram_url: "",
    youtube_url: "",
    spotify_url: "",
    apple_music_url: "",
  });

  useEffect(() => {
    if (artistProfile) {
      setFormData({
        stage_name: artistProfile.stage_name || "",
        bio: artistProfile.bio || "",
        avatar_url: artistProfile.avatar_url || "",
        cover_image_url: artistProfile.cover_image_url || "",
        instagram_url: artistProfile.instagram_url || "",
        youtube_url: artistProfile.youtube_url || "",
        spotify_url: artistProfile.spotify_url || "",
        apple_music_url: artistProfile.apple_music_url || "",
      });
    }
  }, [artistProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateProfile.mutateAsync(formData);
      toast({
        title: "Profile Updated",
        description: "Your artist profile has been saved successfully",
      });
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your artist profile and social links</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6 border-border">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Basic Information
          </h2>

          <div className="space-y-4">
            <div>
              <Label htmlFor="stage_name">Stage Name *</Label>
              <Input
                id="stage_name"
                value={formData.stage_name}
                onChange={(e) => setFormData({ ...formData, stage_name: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell your fans about yourself..."
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="avatar_url">Profile Picture URL</Label>
              <Input
                id="avatar_url"
                placeholder="https://example.com/avatar.jpg"
                value={formData.avatar_url}
                onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
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
          </div>
        </Card>

        <Card className="p-6 border-border">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Music className="w-5 h-5 text-primary" />
            Social Media Links
          </h2>

          <div className="space-y-4">
            <div>
              <Label htmlFor="instagram_url">Instagram</Label>
              <Input
                id="instagram_url"
                placeholder="https://instagram.com/username"
                value={formData.instagram_url}
                onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="youtube_url">YouTube</Label>
              <Input
                id="youtube_url"
                placeholder="https://youtube.com/@channel"
                value={formData.youtube_url}
                onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="spotify_url">Spotify</Label>
              <Input
                id="spotify_url"
                placeholder="https://open.spotify.com/artist/..."
                value={formData.spotify_url}
                onChange={(e) => setFormData({ ...formData, spotify_url: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="apple_music_url">Apple Music</Label>
              <Input
                id="apple_music_url"
                placeholder="https://music.apple.com/artist/..."
                value={formData.apple_music_url}
                onChange={(e) => setFormData({ ...formData, apple_music_url: e.target.value })}
              />
            </div>
          </div>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" className="bg-gradient-primary" disabled={updateProfile.isPending}>
            Save Changes
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={signOut}
            className="ml-auto"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ArtistSettings;