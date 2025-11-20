import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useCreatePost } from "@/hooks/useCommunityPosts";
import { supabase } from "@/integrations/supabase/client";
import { Image, Video, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  artistId: string;
}

const CreatePostDialog = ({ open, onOpenChange, artistId }: CreatePostDialogProps) => {
  const [content, setContent] = useState("");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);
  const [uploading, setUploading] = useState(false);
  
  const createPost = useCreatePost();
  const { toast } = useToast();

  const handleMediaUpload = async (file: File, type: "image" | "video") => {
    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${artistId}-${Date.now()}.${fileExt}`;
      const filePath = `${type}s/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("community-media")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("community-media")
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast({
        title: "Content required",
        description: "Please add some content to your post",
        variant: "destructive",
      });
      return;
    }

    let mediaUrl: string | undefined;
    if (mediaFile && mediaType) {
      mediaUrl = await handleMediaUpload(mediaFile, mediaType) || undefined;
    }

    createPost.mutate(
      {
        artist_id: artistId,
        content,
        media_url: mediaUrl,
        media_type: mediaType || undefined,
      },
      {
        onSuccess: () => {
          setContent("");
          setMediaFile(null);
          setMediaType(null);
          onOpenChange(false);
        },
      }
    );
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "video") => {
    const file = e.target.files?.[0];
    if (file) {
      setMediaFile(file);
      setMediaType(type);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="content">Post Content</Label>
            <Textarea
              id="content"
              placeholder="Share something with your fans..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[120px]"
            />
          </div>

          {mediaFile && (
            <div className="p-4 border rounded-lg bg-muted">
              <p className="text-sm text-muted-foreground">
                Selected: {mediaFile.name} ({mediaType})
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setMediaFile(null);
                  setMediaType(null);
                }}
              >
                Remove
              </Button>
            </div>
          )}

          <div className="flex gap-2">
            <div>
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileSelect(e, "image")}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById("image-upload")?.click()}
                disabled={!!mediaFile}
              >
                <Image className="w-4 h-4 mr-2" />
                Add Image
              </Button>
            </div>

            <div>
              <Input
                id="video-upload"
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => handleFileSelect(e, "video")}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById("video-upload")?.click()}
                disabled={!!mediaFile}
              >
                <Video className="w-4 h-4 mr-2" />
                Add Video
              </Button>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={createPost.isPending || uploading}
            >
              {(createPost.isPending || uploading) && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Post
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostDialog;