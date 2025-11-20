import { useState } from "react";
import { Card } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Heart, MessageCircle, Share2, Pin, Trash2, Edit2, MoreVertical } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  useTogglePostLike,
  useDeletePost,
  useUpdatePost,
  usePostLikes,
} from "@/hooks/useCommunityPosts";
import {
  usePostComments,
  useCreateComment,
  useDeleteComment,
  useToggleCommentLike,
} from "@/hooks/useCommunityComments";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { useAuth } from "@/contexts/AuthContext";

interface CommunityPostCardProps {
  post: any;
  isArtist?: boolean;
}

const CommunityPostCard = ({ post, isArtist }: CommunityPostCardProps) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [showLikes, setShowLikes] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);

  const { user } = useAuth();
  const toggleLike = useTogglePostLike();
  const deletePost = useDeletePost();
  const updatePost = useUpdatePost();
  const { data: likes } = usePostLikes(post.id);
  const { data: comments } = usePostComments(post.id);
  const createComment = useCreateComment();
  const deleteComment = useDeleteComment();
  const toggleCommentLike = useToggleCommentLike();

  const likesCount = post.community_post_likes?.[0]?.count || 0;
  const commentsCount = post.community_post_comments?.[0]?.count || 0;
  const isLiked = likes?.some((like) => like.user_id === user?.id);

  const handleLike = () => {
    if (user) {
      toggleLike.mutate({ postId: post.id, userId: user.id });
    }
  };

  const handleComment = () => {
    if (user && commentText.trim()) {
      createComment.mutate(
        {
          post_id: post.id,
          user_id: user.id,
          content: commentText,
        },
        {
          onSuccess: () => setCommentText(""),
        }
      );
    }
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this post?")) {
      deletePost.mutate(post.id);
    }
  };

  const handlePin = () => {
    updatePost.mutate({
      postId: post.id,
      updates: { is_pinned: !post.is_pinned },
    });
  };

  const handleEdit = () => {
    updatePost.mutate(
      {
        postId: post.id,
        updates: { content: editContent },
      },
      {
        onSuccess: () => setIsEditing(false),
      }
    );
  };

  return (
    <>
      <Card className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex gap-3">
            <Avatar>
              <AvatarImage src={post.artist_profiles?.avatar_url} />
              <AvatarFallback>
                {post.artist_profiles?.stage_name?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold">{post.artist_profiles?.stage_name}</p>
                {post.is_pinned && (
                  <Pin className="w-4 h-4 text-primary" />
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
              </p>
            </div>
          </div>

          {isArtist && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditing(true)}>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handlePin}>
                  <Pin className="w-4 h-4 mr-2" />
                  {post.is_pinned ? "Unpin" : "Pin"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-2">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleEdit}>
                Save
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setEditContent(post.content);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <p className="whitespace-pre-wrap">{post.content}</p>
        )}

        {post.media_url && (
          <div className="rounded-lg overflow-hidden">
            {post.media_type === "image" ? (
              <img
                src={post.media_url}
                alt="Post media"
                className="w-full h-auto"
              />
            ) : (
              <video src={post.media_url} controls className="w-full h-auto" />
            )}
          </div>
        )}

        <div className="flex items-center gap-6 pt-2">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={handleLike}
          >
            <Heart
              className={`w-5 h-5 ${isLiked ? "fill-red-500 text-red-500" : ""}`}
            />
            <span
              className="cursor-pointer hover:underline"
              onClick={(e) => {
                e.stopPropagation();
                setShowLikes(true);
              }}
            >
              {likesCount}
            </span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageCircle className="w-5 h-5" />
            {commentsCount}
          </Button>

          <Button variant="ghost" size="sm" className="gap-2">
            <Share2 className="w-5 h-5" />
          </Button>
        </div>

        {showComments && (
          <div className="space-y-4 pt-4 border-t">
            <div className="flex gap-2">
              <Textarea
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="min-h-[60px]"
              />
              <Button onClick={handleComment} disabled={!commentText.trim()}>
                Post
              </Button>
            </div>

            <div className="space-y-3">
              {comments?.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={comment.profiles?.avatar_url || comment.artist_profiles?.avatar_url} />
                    <AvatarFallback>
                      {(comment.profiles?.full_name || comment.artist_profiles?.stage_name)?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="bg-muted rounded-lg p-3">
                      <p className="font-semibold text-sm">
                        {comment.profiles?.full_name || comment.artist_profiles?.stage_name}
                      </p>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>
                        {formatDistanceToNow(new Date(comment.created_at), {
                          addSuffix: true,
                        })}
                      </span>
                      <button
                        className="hover:underline"
                        onClick={() =>
                          user &&
                          toggleCommentLike.mutate({
                            commentId: comment.id,
                            userId: user.id,
                            postId: post.id,
                          })
                        }
                      >
                        Like ({comment.community_comment_likes?.[0]?.count || 0})
                      </button>
                      {(user?.id === comment.user_id || isArtist) && (
                        <button
                          className="hover:underline text-destructive"
                          onClick={() =>
                            deleteComment.mutate({
                              commentId: comment.id,
                              postId: post.id,
                            })
                          }
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      <Dialog open={showLikes} onOpenChange={setShowLikes}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Likes ({likesCount})</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {likes?.map((like) => (
              <div key={like.id} className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={like.profiles?.avatar_url} />
                  <AvatarFallback>{like.profiles?.full_name?.[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{like.profiles?.full_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(like.created_at), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CommunityPostCard;