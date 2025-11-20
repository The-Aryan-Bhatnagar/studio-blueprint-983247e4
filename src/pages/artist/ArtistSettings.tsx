import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useArtistProfile, useUpdateArtistProfile } from "@/hooks/useArtistProfile";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { User, Music, LogOut, Link2, ExternalLink, Copy, Check } from "lucide-react";
import ArtistImageUpload from "@/components/ArtistImageUpload";

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
  const [copied, setCopied] = useState(false);

  const profileUrl = artistProfile ? `${window.location.origin}/artist/${artistProfile.id}` : "";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    toast({
      title: "Link Copied!",
      description: "Your artist profile link has been copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

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

      {/* Smart Link Generator */}
      <Card className="p-6 border-border bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="flex items-start gap-4 mb-4">
          <div className="p-3 rounded-lg bg-primary/10">
            <Link2 className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-2">Your Artist Profile Link</h2>
            <p className="text-muted-foreground text-sm mb-4">
              Share this link with your fans to showcase your music, events, and community posts
            </p>
            
            <div className="flex gap-2 mb-4">
              <Input
                value={profileUrl}
                readOnly
                className="flex-1 bg-background"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={copyToClipboard}
                className="shrink-0"
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => window.open(profileUrl, '_blank')}
                className="shrink-0"
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 text-sm">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Music className="w-4 h-4" />
                <span>Shows all your songs</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Link2 className="w-4 h-4" />
                <span>Social media links</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <User className="w-4 h-4" />
                <span>Community posts</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6 border-border">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Basic Information
          </h2>

          <div className="space-y-6">
            <div>
              <Label className="mb-4 block">Profile Picture</Label>
              <ArtistImageUpload
                currentImageUrl={formData.avatar_url}
                artistName={formData.stage_name}
                type="avatar"
                onRemove={() => setFormData({ ...formData, avatar_url: "" })}
              />
            </div>

            <div>
              <Label className="mb-4 block">Cover Image</Label>
              <ArtistImageUpload
                currentImageUrl={formData.cover_image_url}
                artistName={formData.stage_name}
                type="cover"
                onRemove={() => setFormData({ ...formData, cover_image_url: "" })}
              />
            </div>

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