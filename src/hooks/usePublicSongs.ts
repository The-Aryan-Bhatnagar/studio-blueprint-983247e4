import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const usePublicSongs = () => {
  return useQuery({
    queryKey: ["public-songs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("songs")
        .select(`
          *,
          artist_profiles (
            id,
            stage_name,
            avatar_url,
            bio
          ),
          song_analytics (
            total_plays,
            total_likes
          )
        `)
        .eq("is_published", true)
        .eq("is_draft", false)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

export const usePublicArtists = () => {
  return useQuery({
    queryKey: ["public-artists"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("artist_profiles")
        .select("*")
        .order("total_followers", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};
