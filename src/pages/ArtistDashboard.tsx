import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ArtistDashboardHome from "./artist/ArtistDashboardHome";
import SongUpload from "./artist/SongUpload";
import SongManagement from "./artist/SongManagement";
import ArtistSettings from "./artist/ArtistSettings";

const ArtistDashboard = () => {
  const { user, loading, isArtist } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Determine active tab from URL
  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes("/upload")) return "upload";
    if (path.includes("/songs")) return "songs";
    if (path.includes("/settings")) return "settings";
    return "overview";
  };

  useEffect(() => {
    if (!loading && !user) {
      navigate("/artist/login");
    } else if (!loading && user && !isArtist) {
      navigate("/");
    }
  }, [user, loading, isArtist, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user || !isArtist) {
    return null;
  }

  const handleTabChange = (value: string) => {
    const routes = {
      overview: "/artist/dashboard",
      upload: "/artist/dashboard/upload",
      songs: "/artist/dashboard/songs",
      settings: "/artist/dashboard/settings",
    };
    navigate(routes[value as keyof typeof routes]);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Artist Dashboard</h1>
        <p className="text-muted-foreground">Manage your music and connect with your audience</p>
      </div>

      <Tabs value={getActiveTab()} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="upload">Upload Song</TabsTrigger>
          <TabsTrigger value="songs">My Songs</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <ArtistDashboardHome />
        </TabsContent>

        <TabsContent value="upload">
          <SongUpload />
        </TabsContent>

        <TabsContent value="songs">
          <SongManagement />
        </TabsContent>

        <TabsContent value="settings">
          <ArtistSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ArtistDashboard;