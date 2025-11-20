import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const usePostComments = (postId: string) => {
  return useQuery({
    queryKey: ["postComments", postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("community_post_comments")
        .select(`
          *,
          profiles!inner(
            full_name,
            avatar_url
          ),
          artist_profiles(
            stage_name,
            avatar_url
          ),
          community_comment_likes(count)
        `)
        .eq("post_id", postId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (comment: {
      post_id: string;
      user_id: string;
      content: string;
    }) => {
      const { data, error } = await supabase
        .from("community_post_comments")
        .insert(comment)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["postComments", variables.post_id] });
      queryClient.invalidateQueries({ queryKey: ["communityPosts"] });
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to add comment", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });
};

export const useUpdateComment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      commentId,
      content,
      postId,
    }: {
      commentId: string;
      content: string;
      postId: string;
    }) => {
      const { data, error } = await supabase
        .from("community_post_comments")
        .update({ content })
        .eq("id", commentId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["postComments", variables.postId] });
      toast({ title: "Comment updated successfully!" });
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ commentId, postId }: { commentId: string; postId: string }) => {
      const { error } = await supabase
        .from("community_post_comments")
        .delete()
        .eq("id", commentId);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["postComments", variables.postId] });
      queryClient.invalidateQueries({ queryKey: ["communityPosts"] });
      toast({ title: "Comment deleted successfully!" });
    },
  });
};

export const useToggleCommentLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      commentId,
      userId,
      postId,
    }: {
      commentId: string;
      userId: string;
      postId: string;
    }) => {
      // Check if already liked
      const { data: existingLike } = await supabase
        .from("community_comment_likes")
        .select()
        .eq("comment_id", commentId)
        .eq("user_id", userId)
        .single();

      if (existingLike) {
        // Unlike
        const { error } = await supabase
          .from("community_comment_likes")
          .delete()
          .eq("comment_id", commentId)
          .eq("user_id", userId);
        if (error) throw error;
      } else {
        // Like
        const { error } = await supabase
          .from("community_comment_likes")
          .insert({ comment_id: commentId, user_id: userId });
        if (error) throw error;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["postComments", variables.postId] });
    },
  });
};