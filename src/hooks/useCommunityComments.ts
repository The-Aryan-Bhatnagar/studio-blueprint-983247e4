import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const usePostComments = (postId: string) => {
  return useQuery({
    queryKey: ["postComments", postId],
    queryFn: async () => {
      const { data: comments, error } = await supabase
        .from("community_post_comments")
        .select(`
          *,
          community_comment_likes(count)
        `)
        .eq("post_id", postId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch user profiles separately
      const userIds = comments?.map((c) => c.user_id) || [];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name, avatar_url")
        .in("user_id", userIds);

      const { data: artistProfiles } = await supabase
        .from("artist_profiles")
        .select("user_id, stage_name, avatar_url")
        .in("user_id", userIds);

      // Merge the data and organize into parent-child structure
      const commentsWithProfiles = comments?.map((comment) => {
        const profile = profiles?.find((p) => p.user_id === comment.user_id);
        const artistProfile = artistProfiles?.find((a) => a.user_id === comment.user_id);
        return {
          ...comment,
          profiles: profile || null,
          artist_profiles: artistProfile || null,
          replies: [] as any[],
        };
      }) || [];

      // Organize comments: separate parent comments and replies
      const parentComments = commentsWithProfiles.filter(c => !c.parent_comment_id);
      const replies = commentsWithProfiles.filter(c => c.parent_comment_id);

      // Attach replies to their parent comments
      replies.forEach(reply => {
        const parent = parentComments.find(p => p.id === reply.parent_comment_id);
        if (parent) {
          parent.replies.push(reply);
        }
      });

      // Sort replies by created_at ascending (oldest first)
      parentComments.forEach(parent => {
        parent.replies.sort((a, b) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      });

      return parentComments;
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
      parent_comment_id?: string;
    }) => {
      const { data, error } = await supabase
        .from("community_post_comments")
        .insert({
          post_id: comment.post_id,
          user_id: comment.user_id,
          content: comment.content,
          parent_comment_id: comment.parent_comment_id || null,
        })
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