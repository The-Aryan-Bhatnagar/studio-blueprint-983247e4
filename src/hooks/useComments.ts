import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useComments = (songId: string | undefined) => {
  return useQuery({
    queryKey: ["comments", songId],
    queryFn: async () => {
      if (!songId) return [];

      const { data, error } = await supabase
        .from("song_comments")
        .select("*")
        .eq("song_id", songId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch user profiles separately
      const userIds = [...new Set(data.map(c => c.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name, avatar_url")
        .in("user_id", userIds);

      // Map profiles to comments and organize into parent-child structure
      const commentsWithProfiles = data.map(comment => ({
        ...comment,
        profile: profiles?.find(p => p.user_id === comment.user_id),
        replies: [] as any[]
      }));

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
    enabled: !!songId,
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ 
      songId, 
      content, 
      parentCommentId 
    }: { 
      songId: string; 
      content: string; 
      parentCommentId?: string;
    }) => {
      if (!user) throw new Error("Must be logged in to comment");

      const { data, error } = await supabase
        .from("song_comments")
        .insert({
          user_id: user.id,
          song_id: songId,
          content,
          parent_comment_id: parentCommentId || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["comments", variables.songId] });
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ commentId, songId }: { commentId: string; songId: string }) => {
      const { error } = await supabase
        .from("song_comments")
        .delete()
        .eq("id", commentId);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["comments", variables.songId] });
    },
  });
};
