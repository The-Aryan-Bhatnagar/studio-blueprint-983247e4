import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Check } from "lucide-react";
import { useVotePoll, useRemoveVote, type Poll } from "@/hooks/usePolls";
import { supabase } from "@/integrations/supabase/client";

interface PollCardProps {
  poll: Poll;
}

const PollCard = ({ poll }: PollCardProps) => {
  const [userId, setUserId] = useState<string | null>(null);
  const votePoll = useVotePoll();
  const removeVote = useRemoveVote();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id || null);
    });
  }, []);

  const userVote = poll.poll_votes.find((vote) => vote.user_id === userId);
  const totalVotes = poll.poll_options.reduce(
    (sum, option) => sum + option.vote_count,
    0
  );
  const hasExpired = poll.expires_at && new Date(poll.expires_at) < new Date();
  const canVote = !hasExpired && poll.is_active && userId;

  const handleVote = async (optionId: string) => {
    if (!userId) return;

    if (userVote) {
      // Change vote
      await removeVote.mutateAsync({ pollId: poll.id, userId });
    }
    
    await votePoll.mutateAsync({
      pollId: poll.id,
      optionId,
      userId,
    });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="font-semibold text-lg mb-4">{poll.question}</h3>

        <div className="space-y-3">
          {poll.poll_options.map((option) => {
            const percentage =
              totalVotes > 0 ? (option.vote_count / totalVotes) * 100 : 0;
            const isSelected = userVote?.option_id === option.id;

            return (
              <div key={option.id}>
                <Button
                  variant={isSelected ? "default" : "outline"}
                  className="w-full justify-between mb-2"
                  onClick={() => canVote && handleVote(option.id)}
                  disabled={!canVote || votePoll.isPending || removeVote.isPending}
                >
                  <span className="flex items-center gap-2">
                    {isSelected && <Check className="w-4 h-4" />}
                    {option.option_text}
                  </span>
                  <span className="text-sm">
                    {option.vote_count} {option.vote_count === 1 ? "vote" : "votes"}
                  </span>
                </Button>
                {(userVote || hasExpired) && (
                  <Progress value={percentage} className="h-2" />
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-4 text-sm text-muted-foreground">
          <p>Total votes: {totalVotes}</p>
          {poll.expires_at && (
            <p>
              {hasExpired
                ? "Poll has ended"
                : `Expires: ${new Date(poll.expires_at).toLocaleString()}`}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PollCard;
