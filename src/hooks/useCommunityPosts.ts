import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { postContentSchema } from "@/lib/validations";

export const useCommunityPosts = (artistId?: string) => {
  return useQuery({
    queryKey: ["communityPosts", artistId],
    queryFn: async () => {
      let query = supabase
        .from("community_posts")
        .select(`
          *,
          artist_profiles!inner(
            id,
            stage_name,
            avatar_url
          ),
          community_post_likes(count),
          community_post_comments(count)
        `)
        .order("is_pinned", { ascending: false })
        .order("created_at", { ascending: false });

      if (artistId) {
        query = query.eq("artist_id", artistId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (post: {
      artist_id: string;
      content: string;
      media_url?: string;
      media_type?: "image" | "video";
    }) => {
      // Validate content
      const validation = postContentSchema.safeParse({ content: post.content });
      if (!validation.success) {
        throw new Error(validation.error.errors[0].message);
      }

      const { data, error } = await supabase
        .from("community_posts")
        .insert(post)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communityPosts"] });
      toast({ title: "Post created successfully!" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to create post", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      postId,
      updates,
    }: {
      postId: string;
      updates: {
        content?: string;
        media_url?: string;
        media_type?: "image" | "video";
        is_pinned?: boolean;
        is_popular?: boolean;
      };
    }) => {
      // Validate content if it's being updated
      if (updates.content) {
        const validation = postContentSchema.safeParse({ content: updates.content });
        if (!validation.success) {
          throw new Error(validation.error.errors[0].message);
        }
      }

      const { data, error } = await supabase
        .from("community_posts")
        .update(updates)
        .eq("id", postId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communityPosts"] });
      toast({ title: "Post updated successfully!" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to update post", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (postId: string) => {
      const { error } = await supabase
        .from("community_posts")
        .delete()
        .eq("id", postId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communityPosts"] });
      toast({ title: "Post deleted successfully!" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to delete post", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });
};

export const useTogglePostLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, userId }: { postId: string; userId: string }) => {
      // Check if already liked
      const { data: existingLike } = await supabase
        .from("community_post_likes")
        .select()
        .eq("post_id", postId)
        .eq("user_id", userId)
        .single();

      if (existingLike) {
        // Unlike
        const { error } = await supabase
          .from("community_post_likes")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", userId);
        if (error) throw error;
      } else {
        // Like
        const { error } = await supabase
          .from("community_post_likes")
          .insert({ post_id: postId, user_id: userId });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communityPosts"] });
      queryClient.invalidateQueries({ queryKey: ["postLikes"] });
    },
  });
};

export const usePostLikes = (postId: string) => {
  return useQuery({
    queryKey: ["postLikes", postId],
    queryFn: async () => {
      const { data: likes, error } = await supabase
        .from("community_post_likes")
        .select("*")
        .eq("post_id", postId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch user profiles separately
      const userIds = likes?.map((l) => l.user_id) || [];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name, avatar_url")
        .in("user_id", userIds);

      // Merge the data
      return likes?.map((like) => {
        const profile = profiles?.find((p) => p.user_id === like.user_id);
        return {
          ...like,
          profiles: profile || null,
        };
      });
    },
  });
};