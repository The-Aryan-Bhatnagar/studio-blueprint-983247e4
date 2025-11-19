import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useSongLikes = (songId?: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Check if current song is liked
  const { data: isLiked } = useQuery({
    queryKey: ["song-like", songId, user?.id],
    queryFn: async () => {
      if (!user || !songId) return false;

      const { data, error } = await supabase
        .from("user_song_likes")
        .select("id")
        .eq("user_id", user.id)
        .eq("song_id", songId)
        .maybeSingle();

      if (error) throw error;
      return !!data;
    },
    enabled: !!user && !!songId,
  });

  // Toggle like
  const toggleLike = useMutation({
    mutationFn: async () => {
      if (!user || !songId) throw new Error("Must be logged in");

      if (isLiked) {
        // Unlike
        const { error } = await supabase
          .from("user_song_likes")
          .delete()
          .eq("user_id", user.id)
          .eq("song_id", songId);

        if (error) throw error;
      } else {
        // Like
        const { error } = await supabase
          .from("user_song_likes")
          .insert({
            user_id: user.id,
            song_id: songId,
          });

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["song-like", songId] });
      queryClient.invalidateQueries({ queryKey: ["liked-songs"] });
      queryClient.invalidateQueries({ queryKey: ["public-songs"] });
    },
  });

  return {
    isLiked: isLiked || false,
    toggleLike: toggleLike.mutate,
    isLoading: toggleLike.isPending,
  };
};

export const useLikedSongs = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["liked-songs", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("user_song_likes")
        .select(`
          created_at,
          songs (
            *,
            artist_profiles (
              id,
              stage_name,
              avatar_url
            ),
            song_analytics (
              total_plays,
              total_likes
            )
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data.map(item => item.songs);
    },
    enabled: !!user,
  });
};
