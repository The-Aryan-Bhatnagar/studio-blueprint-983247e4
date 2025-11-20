import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useArtistProfile } from "./useArtistProfile";
import { useToast } from "@/hooks/use-toast";

export const useArtistComments = () => {
  const { data: artistProfile } = useArtistProfile();
  const { toast } = useToast();

  return useQuery({
    queryKey: ["artistComments", artistProfile?.id],
    queryFn: async () => {
      if (!artistProfile) return [];

      // Get all songs by this artist
      const { data: songs, error: songsError } = await supabase
        .from("songs")
        .select("id, title, cover_image_url")
        .eq("artist_id", artistProfile.id);

      if (songsError) throw songsError;

      const songIds = songs?.map(s => s.id) || [];
      if (songIds.length === 0) return [];

      // Get all comments for these songs
      const { data: comments, error: commentsError } = await supabase
        .from("song_comments")
        .select("*")
        .in("song_id", songIds)
        .order("created_at", { ascending: false });

      if (commentsError) throw commentsError;

      // Fetch user profiles
      const userIds = [...new Set(comments?.map(c => c.user_id) || [])];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name, avatar_url")
        .in("user_id", userIds);

      // Map comments with profiles and song info
      const commentsWithData = comments?.map(comment => {
        const song = songs?.find(s => s.id === comment.song_id);
        const profile = profiles?.find(p => p.user_id === comment.user_id);
        return {
          ...comment,
          song,
          profile,
          replies: [] as any[]
        };
      }) || [];

      // Organize into parent-child structure
      const parentComments = commentsWithData.filter(c => !c.parent_comment_id);
      const replies = commentsWithData.filter(c => c.parent_comment_id);

      // Attach replies to parents
      replies.forEach(reply => {
        const parent = parentComments.find(p => p.id === reply.parent_comment_id);
        if (parent) {
          parent.replies.push(reply);
        }
      });

      // Sort replies
      parentComments.forEach(parent => {
        parent.replies.sort((a, b) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      });

      return parentComments;
    },
    enabled: !!artistProfile,
  });
};

export const useArtistReplyComment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: artistProfile } = useArtistProfile();

  return useMutation({
    mutationFn: async ({ 
      songId, 
      content, 
      parentCommentId 
    }: { 
      songId: string; 
      content: string; 
      parentCommentId: string;
    }) => {
      if (!artistProfile) throw new Error("Artist profile not found");

      const { data, error } = await supabase
        .from("song_comments")
        .insert({
          user_id: artistProfile.user_id,
          song_id: songId,
          content,
          parent_comment_id: parentCommentId,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["artistComments"] });
      toast({ title: "Reply posted successfully" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to post reply", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });
};

export const useArtistDeleteComment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (commentId: string) => {
      const { error } = await supabase
        .from("song_comments")
        .delete()
        .eq("id", commentId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["artistComments"] });
      toast({ title: "Comment deleted successfully" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to delete comment", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });
};
