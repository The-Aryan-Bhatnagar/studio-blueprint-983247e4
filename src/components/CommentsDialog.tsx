import { useState } from "react";
import { MessageSquare, Trash2, Send, Reply } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useComments, useCreateComment, useDeleteComment } from "@/hooks/useComments";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

interface CommentsDialogProps {
  songId: string;
  songTitle: string;
}

const CommentsDialog = ({ songId, songTitle }: CommentsDialogProps) => {
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const { user } = useAuth();
  const { data: comments, isLoading } = useComments(songId);
  const createComment = useCreateComment();
  const deleteComment = useDeleteComment();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to comment on songs",
        variant: "destructive",
      });
      return;
    }

    if (!comment.trim()) return;

    try {
      await createComment.mutateAsync({ songId, content: comment.trim() });
      setComment("");
      toast({
        title: "Comment posted",
        description: "Your comment has been added",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post comment",
        variant: "destructive",
      });
    }
  };

  const handleReply = async (parentCommentId: string) => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to reply to comments",
        variant: "destructive",
      });
      return;
    }

    if (!replyContent.trim()) return;

    try {
      await createComment.mutateAsync({ 
        songId, 
        content: replyContent.trim(),
        parentCommentId 
      });
      setReplyContent("");
      setReplyingTo(null);
      toast({
        title: "Reply posted",
        description: "Your reply has been added",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post reply",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      await deleteComment.mutateAsync({ commentId, songId });
      toast({
        title: "Comment deleted",
        description: "Your comment has been removed",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete comment",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <MessageSquare className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Comments - {songTitle}</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 flex-1">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={user ? "Add a comment..." : "Login to comment"}
              disabled={!user}
              className="flex-1 min-h-[80px]"
            />
            <Button type="submit" disabled={!comment.trim() || createComment.isPending}>
              <Send className="h-4 w-4" />
            </Button>
          </form>

          <ScrollArea className="flex-1 h-[400px]">
            {isLoading ? (
              <p className="text-muted-foreground text-center py-8">Loading comments...</p>
            ) : comments?.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No comments yet. Be the first to comment!
              </p>
            ) : (
              <div className="space-y-4">
                {comments?.map((comment) => (
                  <div key={comment.id} className="space-y-3">
                    <div className="flex gap-3 p-3 rounded-lg bg-muted/50">
                      <Avatar>
                        <AvatarImage src={comment.profile?.avatar_url || undefined} />
                        <AvatarFallback>
                          {comment.profile?.full_name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium">{comment.profile?.full_name || "Anonymous"}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                            </span>
                            {user?.id === comment.user_id && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => handleDelete(comment.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                        <p className="text-sm mb-2">{comment.content}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-xs"
                          onClick={() => setReplyingTo(comment.id)}
                        >
                          <Reply className="h-3 w-3 mr-1" />
                          Reply
                        </Button>
                      </div>
                    </div>

                    {/* Reply form */}
                    {replyingTo === comment.id && (
                      <div className="ml-12 flex gap-2">
                        <Textarea
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          placeholder="Write a reply..."
                          className="flex-1 min-h-[60px]"
                          autoFocus
                        />
                        <div className="flex flex-col gap-1">
                          <Button 
                            size="sm"
                            onClick={() => handleReply(comment.id)}
                            disabled={!replyContent.trim() || createComment.isPending}
                          >
                            <Send className="h-3 w-3" />
                          </Button>
                          <Button 
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setReplyingTo(null);
                              setReplyContent("");
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="ml-12 space-y-3">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="flex gap-3 p-3 rounded-lg bg-muted/30">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={reply.profile?.avatar_url || undefined} />
                              <AvatarFallback className="text-xs">
                                {reply.profile?.full_name?.charAt(0) || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <p className="font-medium text-sm">{reply.profile?.full_name || "Anonymous"}</p>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-muted-foreground">
                                    {formatDistanceToNow(new Date(reply.created_at), { addSuffix: true })}
                                  </span>
                                  {user?.id === reply.user_id && (
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-5 w-5"
                                      onClick={() => handleDelete(reply.id)}
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                              <p className="text-sm">{reply.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentsDialog;
