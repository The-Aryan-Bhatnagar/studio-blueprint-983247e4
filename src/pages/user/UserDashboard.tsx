import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Music, Heart, ListMusic, Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const UserDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth/login");
      }
    };
    checkAuth();
  }, [navigate]);

  const { data: stats } = useQuery({
    queryKey: ["user-stats"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const [playlists, likes, follows] = await Promise.all([
        supabase.from("playlists").select("id", { count: "exact" }).eq("user_id", user.id),
        supabase.from("user_song_likes").select("id", { count: "exact" }).eq("user_id", user.id),
        supabase.from("user_follows").select("id", { count: "exact" }).eq("user_id", user.id),
      ]);

      return {
        playlists: playlists.count || 0,
        likes: likes.count || 0,
        follows: follows.count || 0,
      };
    },
  });

  const statCards = [
    {
      title: "My Playlists",
      value: stats?.playlists || 0,
      icon: ListMusic,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Liked Songs",
      value: stats?.likes || 0,
      icon: Heart,
      color: "text-pink-500",
      bgColor: "bg-pink-500/10",
    },
    {
      title: "Following",
      value: stats?.follows || 0,
      icon: Music,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h1 className="text-2xl md:text-4xl font-bold mb-1 md:mb-2">Welcome Back!</h1>
        <p className="text-sm md:text-base text-muted-foreground">Here's your music activity overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title} className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-muted-foreground mb-1">{stat.title}</p>
                <p className="text-2xl md:text-3xl font-bold">{stat.value}</p>
              </div>
              <div className={`p-3 md:p-4 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 md:w-8 md:h-8 ${stat.color}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          <Card
            className="p-4 md:p-6 cursor-pointer hover:bg-muted/50 transition-colors active:scale-[0.98]"
            onClick={() => navigate("/discover")}
          >
            <Music className="w-6 h-6 md:w-8 md:h-8 mb-2 md:mb-3 text-primary" />
            <h3 className="text-lg md:text-xl font-semibold mb-1 md:mb-2">Discover Music</h3>
            <p className="text-sm text-muted-foreground">Find new songs and artists</p>
          </Card>

          <Card
            className="p-4 md:p-6 cursor-pointer hover:bg-muted/50 transition-colors active:scale-[0.98]"
            onClick={() => navigate("/library")}
          >
            <ListMusic className="w-6 h-6 md:w-8 md:h-8 mb-2 md:mb-3 text-primary" />
            <h3 className="text-lg md:text-xl font-semibold mb-1 md:mb-2">My Library</h3>
            <p className="text-sm text-muted-foreground">Access your playlists and liked songs</p>
          </Card>

          <Card
            className="p-4 md:p-6 cursor-pointer hover:bg-muted/50 transition-colors active:scale-[0.98]"
            onClick={() => navigate("/events")}
          >
            <Calendar className="w-6 h-6 md:w-8 md:h-8 mb-2 md:mb-3 text-primary" />
            <h3 className="text-lg md:text-xl font-semibold mb-1 md:mb-2">Upcoming Events</h3>
            <p className="text-sm text-muted-foreground">Check out live events and concerts</p>
          </Card>

          <Card
            className="p-4 md:p-6 cursor-pointer hover:bg-muted/50 transition-colors active:scale-[0.98]"
            onClick={() => navigate("/profile")}
          >
            <Music className="w-6 h-6 md:w-8 md:h-8 mb-2 md:mb-3 text-primary" />
            <h3 className="text-lg md:text-xl font-semibold mb-1 md:mb-2">My Profile</h3>
            <p className="text-sm text-muted-foreground">Manage your account settings</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
