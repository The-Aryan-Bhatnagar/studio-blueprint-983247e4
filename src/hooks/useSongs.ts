import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useArtistProfile } from "./useArtistProfile";

export const useSongs = () => {
  const { data: artistProfile } = useArtistProfile();

  return useQuery({
    queryKey: ["songs", artistProfile?.id],
    queryFn: async () => {
      if (!artistProfile) return [];

      const { data, error } = await supabase
        .from("songs")
        .select(`
          *,
          song_analytics (*)
        `)
        .eq("artist_id", artistProfile.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!artistProfile,
  });
};

export const useCreateSong = () => {
  const queryClient = useQueryClient();
  const { data: artistProfile } = useArtistProfile();

  return useMutation({
    mutationFn: async (songData: any) => {
      if (!artistProfile) throw new Error("Artist profile not found");

      const { data, error } = await supabase
        .from("songs")
        .insert({
          ...songData,
          artist_id: artistProfile.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["songs"] });
    },
  });
};

export const useUpdateSong = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { data, error } = await supabase
        .from("songs")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["songs"] });
    },
  });
};

export const useDeleteSong = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("songs")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["songs"] });
    },
  });
};