import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Poll {
  id: string;
  question: string;
  created_at: string;
  expires_at: string | null;
  is_active: boolean;
  artist_id: string;
  poll_options: PollOption[];
  poll_votes: PollVote[];
}

export interface PollOption {
  id: string;
  poll_id: string;
  option_text: string;
  vote_count: number;
}

export interface PollVote {
  id: string;
  poll_id: string;
  option_id: string;
  user_id: string;
}

export const useCreatePoll = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      question,
      options,
      artistId,
      expiresAt,
    }: {
      question: string;
      options: string[];
      artistId: string;
      expiresAt?: string;
    }) => {
      // Create poll
      const { data: poll, error: pollError } = await supabase
        .from("polls")
        .insert({
          question,
          artist_id: artistId,
          expires_at: expiresAt || null,
        })
        .select()
        .single();

      if (pollError) throw pollError;

      // Create poll options
      const { error: optionsError } = await supabase
        .from("poll_options")
        .insert(
          options.map((option) => ({
            poll_id: poll.id,
            option_text: option,
          }))
        );

      if (optionsError) throw optionsError;

      return poll;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["polls"] });
      toast({
        title: "Success",
        description: "Poll created successfully",
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

export const usePoll = (pollId?: string) => {
  return useQuery({
    queryKey: ["poll", pollId],
    queryFn: async () => {
      if (!pollId) return null;

      const { data, error } = await supabase
        .from("polls")
        .select(
          `
          *,
          poll_options (*),
          poll_votes (*)
        `
        )
        .eq("id", pollId)
        .single();

      if (error) throw error;
      return data as Poll;
    },
    enabled: !!pollId,
  });
};

export const useVotePoll = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      pollId,
      optionId,
      userId,
    }: {
      pollId: string;
      optionId: string;
      userId: string;
    }) => {
      const { data, error } = await supabase
        .from("poll_votes")
        .insert({
          poll_id: pollId,
          option_id: optionId,
          user_id: userId,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["polls"] });
      queryClient.invalidateQueries({ queryKey: ["communityPosts"] });
      toast({
        title: "Success",
        description: "Vote recorded successfully",
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

export const useRemoveVote = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      pollId,
      userId,
    }: {
      pollId: string;
      userId: string;
    }) => {
      const { error } = await supabase
        .from("poll_votes")
        .delete()
        .eq("poll_id", pollId)
        .eq("user_id", userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["polls"] });
      queryClient.invalidateQueries({ queryKey: ["communityPosts"] });
      toast({
        title: "Success",
        description: "Vote removed successfully",
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
