import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, BarChart3 } from "lucide-react";
import { useCommunityPosts } from "@/hooks/useCommunityPosts";
import { useArtistProfile } from "@/hooks/useArtistProfile";
import CreatePostDialog from "@/components/CreatePostDialog";
import CreatePollDialog from "@/components/CreatePollDialog";
import CommunityPostCard from "@/components/CommunityPostCard";

const CommunityManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [createPollOpen, setCreatePollOpen] = useState(false);
  const [pollId, setPollId] = useState<string | null>(null);

  const { data: artistProfile } = useArtistProfile();
  const { data: posts, isLoading } = useCommunityPosts(artistProfile?.id);

  const filteredPosts = posts?.filter((post) =>
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Community Posts</h2>
          <p className="text-muted-foreground">
            Manage your community posts and engage with your fans
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setCreatePollOpen(true)} variant="outline">
            <BarChart3 className="w-4 h-4 mr-2" />
            Create Poll
          </Button>
          <Button onClick={() => setCreatePostOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Post
          </Button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search your posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">
          Loading posts...
        </div>
      ) : filteredPosts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">
              No posts yet. Create your first post to connect with your fans!
            </p>
            <Button onClick={() => setCreatePostOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Post
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {filteredPosts.map((post) => (
            <CommunityPostCard key={post.id} post={post} isArtist={true} />
          ))}
        </div>
      )}

      {artistProfile && (
        <>
          <CreatePostDialog
            open={createPostOpen}
            onOpenChange={setCreatePostOpen}
            artistId={artistProfile.id}
          />
          <CreatePollDialog
            open={createPollOpen}
            onOpenChange={setCreatePollOpen}
            artistId={artistProfile.id}
            onPollCreated={(id) => {
              setPollId(id);
              // Optionally create a post with the poll
            }}
          />
        </>
      )}
    </div>
  );
};

export default CommunityManagement;