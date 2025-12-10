import { ReactNode, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, LayoutDashboard, User, LogOut, Menu, X } from "lucide-react";
import { useTransparentLogo } from "@/hooks/useTransparentLogo";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface UserLayoutProps {
  children: ReactNode;
}

const UserLayout = ({ children }: UserLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const logo = useTransparentLogo();
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out successfully",
        description: "See you soon!",
      });
      navigate("/auth/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const menuItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: LayoutDashboard, label: "Dashboard", path: "/user/dashboard" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleNavigate = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const SidebarContent = () => (
    <>
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => handleNavigate(item.path)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive(item.path)
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 z-50 flex items-center justify-between p-4 bg-card border-b border-border">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2">
          <img src={logo} alt="GreenBox Logo" className="w-8 h-8 object-contain" />
          <span className="font-bold text-lg">Dashboard</span>
        </div>
        <div className="w-10" /> {/* Spacer for centering */}
      </header>

      {/* Mobile Drawer */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-72 p-0 flex flex-col">
          <SheetHeader className="p-6 border-b border-border">
            <SheetTitle className="flex items-center gap-3">
              <img src={logo} alt="GreenBox Logo" className="w-10 h-10 object-contain" />
              <span>Dashboard</span>
            </SheetTitle>
          </SheetHeader>
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-card border-r border-border flex-col shrink-0">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <img src={logo} alt="GreenBox Logo" className="w-10 h-10 object-contain" />
            <h1 className="text-xl font-bold">Dashboard</h1>
          </div>
        </div>
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
};

export default UserLayout;
