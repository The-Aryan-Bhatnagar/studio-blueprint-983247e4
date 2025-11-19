import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export const usePlaylists = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: playlists = [], isLoading } = useQuery({
    queryKey: ["playlists", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("playlists")
        .select("*, playlist_songs(count)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const createPlaylist = useMutation({
    mutationFn: async (data: { name: string; description?: string; is_public?: boolean }) => {
      if (!user) throw new Error("User not authenticated");

      const { data: playlist, error } = await supabase
        .from("playlists")
        .insert({
          user_id: user.id,
          name: data.name,
          description: data.description,
          is_public: data.is_public || false,
        })
        .select()
        .single();

      if (error) throw error;
      return playlist;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playlists"] });
      toast({
        title: "Playlist created",
        description: "Your playlist has been created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create playlist",
        variant: "destructive",
      });
    },
  });

  const updatePlaylist = useMutation({
    mutationFn: async (data: {
      id: string;
      name?: string;
      description?: string;
      is_public?: boolean;
    }) => {
      const { error } = await supabase
        .from("playlists")
        .update({
          name: data.name,
          description: data.description,
          is_public: data.is_public,
        })
        .eq("id", data.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playlists"] });
      toast({
        title: "Playlist updated",
        description: "Your playlist has been updated successfully",
      });
    },
  });

  const deletePlaylist = useMutation({
    mutationFn: async (playlistId: string) => {
      const { error } = await supabase
        .from("playlists")
        .delete()
        .eq("id", playlistId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playlists"] });
      toast({
        title: "Playlist deleted",
        description: "Your playlist has been deleted",
      });
    },
  });

  const addSongToPlaylist = useMutation({
    mutationFn: async (data: { playlistId: string; songId: string }) => {
      const { error } = await supabase
        .from("playlist_songs")
        .insert({
          playlist_id: data.playlistId,
          song_id: data.songId,
        });

      if (error) {
        if (error.code === "23505") {
          throw new Error("Song already in playlist");
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playlists"] });
      queryClient.invalidateQueries({ queryKey: ["playlist-songs"] });
      toast({
        title: "Added to playlist",
        description: "Song has been added to your playlist",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add song to playlist",
        variant: "destructive",
      });
    },
  });

  const removeSongFromPlaylist = useMutation({
    mutationFn: async (data: { playlistId: string; songId: string }) => {
      const { error } = await supabase
        .from("playlist_songs")
        .delete()
        .eq("playlist_id", data.playlistId)
        .eq("song_id", data.songId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playlists"] });
      queryClient.invalidateQueries({ queryKey: ["playlist-songs"] });
      toast({
        title: "Removed from playlist",
        description: "Song has been removed from your playlist",
      });
    },
  });

  return {
    playlists,
    isLoading,
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
    addSongToPlaylist,
    removeSongFromPlaylist,
  };
};

export const usePlaylistSongs = (playlistId: string) => {
  return useQuery({
    queryKey: ["playlist-songs", playlistId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("playlist_songs")
        .select(`
          *,
          songs (
            *,
            artist_profiles (
              stage_name,
              avatar_url
            ),
            song_analytics (
              total_plays,
              total_likes
            )
          )
        `)
        .eq("playlist_id", playlistId)
        .order("added_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!playlistId,
  });
};
