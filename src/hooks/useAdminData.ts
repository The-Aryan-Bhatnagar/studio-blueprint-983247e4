import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// User Management - Fetch profiles with roles and last login
export const useAdminUsers = () => {
  return useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      // Fetch profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch all user roles
      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role");

      if (rolesError) throw rolesError;

      // Fetch login history (latest login per user)
      const { data: loginHistory, error: loginError } = await supabase
        .from("login_history")
        .select("user_id, logged_in_at, device_type, browser, location")
        .order("logged_in_at", { ascending: false });

      if (loginError) throw loginError;

      // Create maps for quick lookup
      const rolesMap = new Map<string, string[]>();
      roles?.forEach((r) => {
        const existing = rolesMap.get(r.user_id) || [];
        existing.push(r.role);
        rolesMap.set(r.user_id, existing);
      });

      const loginMap = new Map<string, any>();
      loginHistory?.forEach((l) => {
        if (!loginMap.has(l.user_id)) {
          loginMap.set(l.user_id, l);
        }
      });

      // Merge data
      const enrichedProfiles = profiles?.map((profile) => ({
        ...profile,
        user_roles: rolesMap.get(profile.user_id)?.map(role => ({ role })) || [],
        last_login: loginMap.get(profile.user_id) || null,
      }));

      return enrichedProfiles || [];
    },
  });
};

// Login History
export const useAdminLoginHistory = () => {
  return useQuery({
    queryKey: ["admin-login-history"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("login_history")
        .select("*")
        .order("logged_in_at", { ascending: false })
        .limit(100);

      if (error) throw error;
      return data;
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
          profiles!song_comments_user_id_fkey(full_name)
        `)
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) throw error;
      return data;
    },
  });
};

// User Location Analytics
export const useAdminUserLocations = () => {
  return useQuery({
    queryKey: ["admin-user-locations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("country, city")
        .not("country", "is", null);

      if (error) throw error;

      // Aggregate locations
      const locationMap = new Map<string, { country: string; city: string; count: number }>();
      data?.forEach((profile) => {
        const key = `${profile.country}-${profile.city}`;
        const existing = locationMap.get(key);
        if (existing) {
          existing.count++;
        } else {
          locationMap.set(key, { country: profile.country || "", city: profile.city || "", count: 1 });
        }
      });

      return Array.from(locationMap.values()).sort((a, b) => b.count - a.count);
    },
  });
};

// New Users This Week
export const useAdminNewUsersThisWeek = () => {
  return useQuery({
    queryKey: ["admin-new-users-week"],
    queryFn: async () => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      const { count, error } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .gte("created_at", weekAgo.toISOString());

      if (error) throw error;
      return count || 0;
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
