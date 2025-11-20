import { useRef, useState } from "react";
import { Camera, Upload, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useUploadArtistImage } from "@/hooks/useArtistProfile";
import { toast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";

interface ArtistImageUploadProps {
  currentImageUrl?: string | null;
  artistName?: string;
  type: 'avatar' | 'cover';
  onRemove?: () => void;
}

const ArtistImageUpload = ({ currentImageUrl, artistName, type, onRemove }: ArtistImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadImage = useUploadArtistImage();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    try {
      await uploadImage.mutateAsync({ file, type });
      toast({
        title: `${type === 'avatar' ? 'Profile picture' : 'Cover image'} updated`,
        description: "Your image has been uploaded successfully",
      });
      setPreviewUrl(null);
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
      setPreviewUrl(null);
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    if (onRemove) {
      onRemove();
    }
  };

  const displayUrl = previewUrl || currentImageUrl;

  if (type === 'avatar') {
    return (
      <div className="flex items-center gap-4">
        <div className="relative inline-block">
          <Avatar className="h-24 w-24">
            <AvatarImage src={displayUrl || undefined} />
            <AvatarFallback className="text-2xl bg-muted">
              {artistName?.charAt(0) || "A"}
            </AvatarFallback>
          </Avatar>
          
          <Button
            type="button"
            size="icon"
            variant="secondary"
            className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadImage.isPending}
          >
            <Camera className="h-4 w-4" />
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Click the camera icon to upload a new profile picture
          </p>
          {displayUrl && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              className="text-destructive hover:text-destructive"
            >
              <X className="h-4 w-4 mr-2" />
              Remove
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Cover image
  return (
    <div className="space-y-4">
      <Card className="relative overflow-hidden border-border bg-muted/20">
        {displayUrl ? (
          <div className="relative aspect-[21/9] w-full">
            <img 
              src={displayUrl} 
              alt="Cover preview" 
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 flex gap-2">
              <Button
                type="button"
                size="icon"
                variant="secondary"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadImage.isPending}
              >
                <Upload className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="destructive"
                onClick={handleRemove}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="aspect-[21/9] w-full flex flex-col items-center justify-center gap-4 p-8">
            <div className="rounded-full bg-muted p-4">
              <Upload className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium mb-1">Upload cover image</p>
              <p className="text-xs text-muted-foreground">
                Click to select an image from your device
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadImage.isPending}
            >
              Choose Image
            </Button>
          </div>
        )}
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default ArtistImageUpload;
