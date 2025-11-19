import { useRef } from "react";
import { Camera } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useUploadAvatar } from "@/hooks/useProfile";
import { toast } from "@/hooks/use-toast";

interface AvatarUploadProps {
  currentAvatarUrl?: string | null;
  userName?: string;
}

const AvatarUpload = ({ currentAvatarUrl, userName }: AvatarUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadAvatar = useUploadAvatar();

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

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 2MB",
        variant: "destructive",
      });
      return;
    }

    try {
      await uploadAvatar.mutateAsync(file);
      toast({
        title: "Avatar updated",
        description: "Your profile photo has been updated",
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload avatar. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="relative inline-block">
      <Avatar className="h-24 w-24">
        <AvatarImage src={currentAvatarUrl || undefined} />
        <AvatarFallback className="text-2xl">
          {userName?.charAt(0) || "U"}
        </AvatarFallback>
      </Avatar>
      
      <Button
        size="icon"
        variant="secondary"
        className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploadAvatar.isPending}
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
  );
};

export default AvatarUpload;
