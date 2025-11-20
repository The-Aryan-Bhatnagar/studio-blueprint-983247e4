import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Plus } from "lucide-react";
import Layout from "@/components/Layout";
import { useCommunityPosts } from "@/hooks/useCommunityPosts";
import { useArtistProfile } from "@/hooks/useArtistProfile";
import CreatePostDialog from "@/components/CreatePostDialog";
import CommunityPostCard from "@/components/CommunityPostCard";

const Community = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [createPostOpen, setCreatePostOpen] = useState(false);

  const { data: posts, isLoading } = useCommunityPosts();
  const { data: artistProfile } = useArtistProfile();

  const isArtist = !!artistProfile;

  const filteredPosts = posts?.filter(
    (post) =>
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.artist_profiles?.stage_name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="mb-6 flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              {isArtist && (
                <Button onClick={() => setCreatePostOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Post
                </Button>
              )}
            </div>

            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading posts...
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No posts found
              </div>
            ) : (
              <div className="space-y-6">
                {filteredPosts.map((post) => (
                  <CommunityPostCard
                    key={post.id}
                    post={post}
                    isArtist={isArtist && post.artist_id === artistProfile?.id}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Trending Artists</h3>
                <div className="space-y-4">
                  {[
                    { name: "Diljit Dosanjh", followers: "2.5M", image: "/placeholder.svg" },
                    { name: "Badshah", followers: "1.8M", image: "/placeholder.svg" },
                    { name: "Neha Kakkar", followers: "1.2M", image: "/placeholder.svg" },
                  ].map((artist) => (
                    <div key={artist.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={artist.image} />
                          <AvatarFallback>{artist.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{artist.name}</p>
                          <p className="text-xs text-muted-foreground">{artist.followers} followers</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">Follow</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Join Premium</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Get exclusive content and early access to new releases
                </p>
                <Button className="w-full">Upgrade Now</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {isArtist && artistProfile && (
        <CreatePostDialog
          open={createPostOpen}
          onOpenChange={setCreatePostOpen}
          artistId={artistProfile.id}
        />
      )}
    </Layout>
  );
};

export default Community;