import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useArtistFollow = (artistId: string | undefined) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: isFollowing, isLoading } = useQuery({
    queryKey: ["artist-follow", artistId, user?.id],
    queryFn: async () => {
      if (!user || !artistId) return false;

      const { data, error } = await supabase
        .from("user_follows")
        .select("id")
        .eq("user_id", user.id)
        .eq("artist_id", artistId)
        .maybeSingle();

      if (error) throw error;
      return !!data;
    },
    enabled: !!user && !!artistId,
  });

  const toggleFollow = useMutation({
    mutationFn: async () => {
      if (!user || !artistId) throw new Error("Must be logged in");

      if (isFollowing) {
        const { error } = await supabase
          .from("user_follows")
          .delete()
          .eq("user_id", user.id)
          .eq("artist_id", artistId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("user_follows")
          .insert({
            user_id: user.id,
            artist_id: artistId,
          });

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["artist-follow", artistId] });
      queryClient.invalidateQueries({ queryKey: ["public-artists"] });
      queryClient.invalidateQueries({ queryKey: ["artist-profile", artistId] });
    },
  });

  return {
    isFollowing: isFollowing ?? false,
    isLoading,
    toggleFollow: toggleFollow.mutateAsync,
    isPending: toggleFollow.isPending,
  };
};

export const useArtistPublicProfile = (artistId: string | undefined) => {
  return useQuery({
    queryKey: ["artist-profile", artistId],
    queryFn: async () => {
      if (!artistId) return null;

      const { data, error } = await supabase
        .from("artist_profiles")
        .select("*")
        .eq("id", artistId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!artistId,
  });
};

export const useArtistSongs = (artistId: string | undefined) => {
  return useQuery({
    queryKey: ["artist-songs", artistId],
    queryFn: async () => {
      if (!artistId) return [];

      const { data, error } = await supabase
        .from("songs")
        .select(`
          *,
          song_analytics (
            total_plays,
            total_likes
          )
        `)
        .eq("artist_id", artistId)
        .eq("is_published", true)
        .eq("is_draft", false)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!artistId,
  });
};
