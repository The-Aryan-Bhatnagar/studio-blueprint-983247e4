import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Music, Megaphone, ChevronRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useTransparentLogo } from "@/hooks/useTransparentLogo";

const AdminDashboard = () => {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const logo = useTransparentLogo();

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate("/admin/login");
    }
  }, [isAdmin, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const dashboardSections = [
    {
      icon: Music,
      title: "Artist",
      description: "Manage artists and their content",
      path: "/admin/artists",
      iconBg: "bg-blue-500",
    },
    {
      icon: Users,
      title: "User",
      description: "Monitor user activities and sessions",
      path: "/admin/users",
      iconBg: "bg-purple-500",
    },
    {
      icon: Megaphone,
      title: "Ads Management",
      description: "Control advertising campaigns and metrics",
      path: "/admin/ads",
      iconBg: "bg-emerald-500",
    },
  ];

  return (
    <div className="min-h-screen bg-background p-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <img src={logo} alt="GREENBOXX Logo" className="w-14 h-14 object-contain" />
          <h1 className="text-5xl font-bold text-primary">GREENBOXX Admin</h1>
        </div>
        <p className="text-muted-foreground text-lg">Select a dashboard to manage</p>
      </div>

      {/* Dashboard Cards */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardSections.map((section) => (
          <Card
            key={section.path}
            className="hover:shadow-lg transition-all cursor-pointer group"
            onClick={() => navigate(section.path)}
          >
            <CardHeader className="space-y-4">
              <div className={`w-20 h-20 ${section.iconBg} rounded-2xl flex items-center justify-center mx-auto`}>
                <section.icon className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl text-center">{section.title}</CardTitle>
              <CardDescription className="text-center">{section.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button
                variant="link"
                className="w-full text-primary group-hover:translate-x-1 transition-transform"
              >
                Open Dashboard
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
