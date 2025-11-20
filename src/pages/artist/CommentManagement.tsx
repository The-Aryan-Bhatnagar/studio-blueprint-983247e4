import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { MessageSquare, Trash2, Reply, Search, Music } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useArtistComments, useArtistReplyComment, useArtistDeleteComment } from "@/hooks/useArtistComments";

const CommentManagement = () => {
  const { data: comments, isLoading } = useArtistComments();
  const replyMutation = useArtistReplyComment();
  const deleteMutation = useArtistDeleteComment();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const filteredComments = comments?.filter(comment => 
    comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    comment.profile?.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    comment.song?.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleReply = async (commentId: string, songId: string) => {
    if (!replyContent.trim()) return;

    await replyMutation.mutateAsync({
      songId,
      content: replyContent,
      parentCommentId: commentId,
    });

    setReplyContent("");
    setReplyingTo(null);
  };

  const handleDelete = async (commentId: string) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      await deleteMutation.mutateAsync(commentId);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8 text-muted-foreground">Loading comments...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Comments & Replies</h2>
          <p className="text-muted-foreground">View and respond to fan comments</p>
        </div>
        <div className="text-sm text-muted-foreground">
          {comments?.length || 0} total comments
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search comments, users, or songs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {filteredComments?.length === 0 ? (
          <Card className="p-12 text-center">
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No comments yet</h3>
            <p className="text-muted-foreground">
              Comments on your songs will appear here
            </p>
          </Card>
        ) : (
          filteredComments?.map((comment) => (
            <Card key={comment.id} className="p-6">
              {/* Song Info */}
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
                <div className="w-10 h-10 rounded bg-muted flex items-center justify-center overflow-hidden">
                  {comment.song?.cover_image_url ? (
                    <img src={comment.song.cover_image_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <Music className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{comment.song?.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>

              {/* Parent Comment */}
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={comment.profile?.avatar_url || ""} />
                    <AvatarFallback>{comment.profile?.full_name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold">{comment.profile?.full_name || "Unknown User"}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(comment.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-foreground mb-3">{comment.content}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                    >
                      <Reply className="h-4 w-4 mr-2" />
                      Reply
                    </Button>
                  </div>
                </div>

                {/* Reply Form */}
                {replyingTo === comment.id && (
                  <div className="ml-14 space-y-2">
                    <Textarea
                      placeholder="Write your reply..."
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      className="min-h-[80px]"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleReply(comment.id, comment.song_id)}
                        disabled={replyMutation.isPending || !replyContent.trim()}
                      >
                        Post Reply
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
                  <div className="ml-14 space-y-4 mt-4 pt-4 border-t border-border">
                    {comment.replies.map((reply: any) => (
                      <div key={reply.id} className="flex gap-4">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={reply.profile?.avatar_url || ""} />
                          <AvatarFallback>{reply.profile?.full_name?.charAt(0) || "U"}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-semibold text-sm">{reply.profile?.full_name || "Unknown User"}</p>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(reply.id)}
                              disabled={deleteMutation.isPending}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="text-sm text-foreground mb-1">{reply.content}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(reply.created_at), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentManagement;
