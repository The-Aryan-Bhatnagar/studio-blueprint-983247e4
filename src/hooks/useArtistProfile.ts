import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useArtistProfile = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["artistProfile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from("artist_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};

export const useUpdateArtistProfile = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (updates: any) => {
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("artist_profiles")
        .update(updates)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["artistProfile"] });
    },
  });
};

export const useUploadArtistImage = () => {
  const { user } = useAuth();
  const updateProfile = useUpdateArtistProfile();

  return useMutation({
    mutationFn: async ({ file, type }: { file: File; type: 'avatar' | 'cover' }) => {
      if (!user) throw new Error("Not authenticated");

      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${type}-${Date.now()}.${fileExt}`;
      const bucketName = type === 'avatar' ? 'avatars' : 'event-banners';

      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

      const updateField = type === 'avatar' ? 'avatar_url' : 'cover_image_url';
      await updateProfile.mutateAsync({ [updateField]: publicUrl });
      return publicUrl;
    },
  });
};