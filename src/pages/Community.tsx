import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, MessageCircle, Share2, Search, Send } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Community = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [newPost, setNewPost] = useState("");
  const [activeComments, setActiveComments] = useState<number | null>(null);
  const [commentText, setCommentText] = useState("");

  const posts = [
    {
      id: 1,
      artist: "Honey Singh",
      avatar: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop",
      content: "Just dropped my new single 'Desi Kalakaar'! What do you all think? 🎵✨",
      image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&h=400&fit=crop",
      likes: 15234,
      comments: 892,
      time: "2 hours ago",
    },
    {
      id: 2,
      artist: "Badshah",
      avatar: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100&h=100&fit=crop",
      content: "Working on our next album in the studio. Can't wait to share it with you all! 🎸🔥",
      likes: 12341,
      comments: 456,
      time: "5 hours ago",
    },
    {
      id: 3,
      artist: "Diljit Dosanjh",
      avatar: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=100&h=100&fit=crop",
      content: "Thank you for 1M streams on 'Born to Shine'! You guys are amazing! 🙏💜",
      image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&h=400&fit=crop",
      likes: 25678,
      comments: 1234,
      time: "1 day ago",
    },
  ];

  const handleCreatePost = () => {
    if (newPost.trim()) {
      toast({
        title: "Post Created",
        description: "Your post has been shared with the community!",
      });
      setNewPost("");
    }
  };

  const handleComment = (postId: number) => {
    if (commentText.trim()) {
      toast({
        title: "Comment Added",
        description: "Your comment has been posted!",
      });
      setCommentText("");
      setActiveComments(null);
    }
  };

  const handleLike = (postId: number) => {
    toast({
      title: "Post Liked",
      description: "You liked this post!",
    });
  };

  const filteredPosts = posts.filter((post) =>
    post.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-32">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Community</h1>
        <p className="text-muted-foreground text-lg mb-6">
          Connect with artists and fans around the world
        </p>

        <div className="relative max-w-2xl">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            placeholder="Search artists or posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs defaultValue="feed" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="feed">Feed</TabsTrigger>
          <TabsTrigger value="create">Create Post</TabsTrigger>
        </TabsList>

        <TabsContent value="feed">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <Card key={post.id} className="p-6 bg-card border-border">
                    <div className="flex items-start gap-4 mb-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={post.avatar} />
                        <AvatarFallback>{post.artist[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-foreground">{post.artist}</h3>
                          <span className="text-sm text-muted-foreground">{post.time}</span>
                        </div>
                        <p className="text-muted-foreground mt-2">{post.content}</p>
                      </div>
                    </div>

                    {post.image && (
                      <div className="rounded-lg overflow-hidden mb-4">
                        <img
                          src={post.image}
                          alt="Post content"
                          className="w-full h-64 object-cover"
                        />
                      </div>
                    )}

                    <div className="flex items-center gap-6 pt-4 border-t border-border">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2 hover:text-red-500"
                        onClick={() => handleLike(post.id)}
                      >
                        <Heart className="w-4 h-4" />
                        <span>{post.likes.toLocaleString()}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2"
                        onClick={() => setActiveComments(activeComments === post.id ? null : post.id)}
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>{post.comments}</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-2 ml-auto">
                        <Share2 className="w-4 h-4" />
                        <span>Share</span>
                      </Button>
                    </div>

                    {activeComments === post.id && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <div className="flex gap-3 mb-4">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback>U</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 flex gap-2">
                            <Input
                              placeholder="Write a comment..."
                              value={commentText}
                              onChange={(e) => setCommentText(e.target.value)}
                            />
                            <Button
                              size="sm"
                              onClick={() => handleComment(post.id)}
                              className="bg-gradient-primary"
                            >
                              <Send className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback>M</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="bg-secondary p-3 rounded-lg">
                                <p className="font-semibold text-sm mb-1">Music Fan</p>
                                <p className="text-sm">Amazing track! 🔥</p>
                              </div>
                              <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                                <button className="hover:text-foreground">Like</button>
                                <button className="hover:text-foreground">Reply</button>
                                <span>2 hours ago</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </Card>
                ))
              ) : (
                <Card className="p-12 text-center">
                  <p className="text-muted-foreground">No posts found matching your search.</p>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              <Card className="p-6 bg-card border-border">
                <h3 className="font-bold text-lg mb-4">Trending Artists</h3>
                <div className="space-y-4">
                  {["Honey Singh", "Badshah", "Diljit Dosanjh", "Neha Kakkar"].map((artist, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback>{artist[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{artist}</p>
                        <p className="text-xs text-muted-foreground">
                          {(Math.random() * 3 + 1).toFixed(1)}M followers
                        </p>
                      </div>
                      <Button size="sm" variant="secondary">Follow</Button>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6 bg-gradient-primary">
                <h3 className="font-bold text-lg mb-2">Join Premium</h3>
                <p className="text-sm mb-4 opacity-90">
                  Get exclusive access to artist content
                </p>
                <Button variant="secondary" className="w-full">
                  Upgrade Now
                </Button>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="create">
          <div className="max-w-2xl mx-auto">
            <Card className="p-8 bg-card border-border">
              <h2 className="text-2xl font-bold mb-6">Create a Post</h2>
              <div className="space-y-4">
                <Textarea
                  placeholder="What's on your mind?"
                  rows={6}
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                />
                <div className="flex gap-4">
                  <Button variant="outline" className="flex-1">
                    Add Image
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Add Video
                  </Button>
                </div>
                <Button
                  onClick={handleCreatePost}
                  className="w-full bg-gradient-primary hover:shadow-glow"
                >
                  Share Post
                </Button>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Community;
