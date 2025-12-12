import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import CommunityPostCard from "@/components/CommunityPostCard";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

const Community = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();

  // Get artists that the user follows
  const { data: followedArtists } = useQuery({
    queryKey: ["followed-artists", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("user_follows")
        .select("artist_id")
        .eq("user_id", user.id);

      if (error) throw error;
      return data.map(f => f.artist_id);
    },
    enabled: !!user,
  });

  // Get all posts from followed artists
  const { data: allPosts, isLoading } = useQuery({
    queryKey: ["community-feed", followedArtists],
    queryFn: async () => {
      if (!followedArtists || followedArtists.length === 0) return [];

      const { data, error } = await supabase
        .from("community_posts")
        .select(`
          *,
          artist_profiles!inner(
            id,
            stage_name,
            avatar_url
          ),
          community_post_likes(count),
          community_post_comments(count)
        `)
        .in("artist_id", followedArtists)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!followedArtists && followedArtists.length > 0,
  });

  const filteredPosts = allPosts?.filter((post) =>
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-xl md:text-3xl font-bold mb-1 md:mb-2">Community</h1>
        <p className="text-xs md:text-base text-muted-foreground">
          See what your favorite artists are sharing
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-2.5 md:top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-9 md:h-10 text-sm"
        />
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">
          Loading posts...
        </div>
      ) : !followedArtists || followedArtists.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">
              Follow artists to see their community posts here!
            </p>
          </CardContent>
        </Card>
      ) : filteredPosts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No posts found. Your favorite artists haven't posted yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {filteredPosts.map((post) => (
            <CommunityPostCard key={post.id} post={post} isArtist={false} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Community;
