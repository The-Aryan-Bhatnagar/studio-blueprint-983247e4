import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// User Management
export const useAdminUsers = () => {
  return useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select(`
          *,
          user_roles(role)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return profiles;
    },
  });
};

// Artist Management
export const useAdminArtists = () => {
  return useQuery({
    queryKey: ["admin-artists"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("artist_profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

// Song Management
export const useAdminSongs = () => {
  return useQuery({
    queryKey: ["admin-songs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("songs")
        .select(`
          *,
          artist_profiles(stage_name),
          song_analytics(total_plays, total_likes, total_comments)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

// Events Management
export const useAdminEvents = () => {
  return useQuery({
    queryKey: ["admin-events"],
    queryFn: async () => {
      const { data, error} = await supabase
        .from("events")
        .select(`
          *,
          artist_profiles(stage_name)
        `)
        .order("event_date", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

// Playlists
export const useAdminPlaylists = () => {
  return useQuery({
    queryKey: ["admin-playlists"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("playlists")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

// Reports
export const useAdminReports = () => {
  return useQuery({
    queryKey: ["admin-reports"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

// Community Posts
export const useAdminCommunityPosts = () => {
  return useQuery({
    queryKey: ["admin-community-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("community_posts")
        .select(`
          *,
          artist_profiles(stage_name),
          community_post_analytics(total_likes, total_comments)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

// Comments
export const useAdminComments = () => {
  return useQuery({
    queryKey: ["admin-comments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("song_comments")
        .select(`
          *,
          songs(title),
          profiles(full_name)
        `)
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) throw error;
      return data;
    },
  });
};

// Ads
export const useAdminAds = () => {
  return useQuery({
    queryKey: ["admin-ads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ads")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

// Analytics
export const useAdminAnalytics = () => {
  return useQuery({
    queryKey: ["admin-analytics"],
    queryFn: async () => {
      const [usersCount, artistsCount, songsCount, eventsCount, playsData] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("artist_profiles").select("*", { count: "exact", head: true }),
        supabase.from("songs").select("*", { count: "exact", head: true }),
        supabase.from("events").select("*", { count: "exact", head: true }),
        supabase.from("play_history").select("*", { count: "exact", head: true }),
      ]);

      return {
        totalUsers: usersCount.count || 0,
        totalArtists: artistsCount.count || 0,
        totalSongs: songsCount.count || 0,
        totalEvents: eventsCount.count || 0,
        totalPlays: playsData.count || 0,
      };
    },
  });
};

// Update Report Status
export const useUpdateReport = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, status, action_taken, admin_notes }: { 
      id: string; 
      status: string; 
      action_taken?: string;
      admin_notes?: string;
    }) => {
      const { error } = await supabase
        .from("reports")
        .update({ status, action_taken, admin_notes, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-reports"] });
      toast({
        title: "Report Updated",
        description: "Report status has been updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// Delete Content
export const useDeleteContent = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ table, id }: { table: string; id: string }) => {
      const { error } = await supabase
        .from(table as any)
        .delete()
        .eq("id", id);

      if (error) throw error;
      return { table };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [`admin-${data.table}`] as any });
      toast({
        title: "Deleted",
        description: "Content has been deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
