import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { User, LogOut, Music2, Mic2, LayoutDashboard, Upload, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import ArtistNavLink from "./ArtistNavLink";

const ArtistHeader = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/artist/login";
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
      <div className="flex items-center justify-between px-8 py-4">
        {/* Logo & Branding */}
        <div className="flex items-center gap-8">
          <Link to="/artist/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Mic2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Artist Portal</h1>
              <p className="text-xs text-muted-foreground">Creator Dashboard</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <ArtistNavLink to="/artist/dashboard" end className="flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </ArtistNavLink>
            <ArtistNavLink to="/artist/dashboard/upload" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload
            </ArtistNavLink>
            <ArtistNavLink to="/artist/dashboard/songs" className="flex items-center gap-2">
              <Music2 className="w-4 h-4" />
              My Songs
            </ArtistNavLink>
            <ArtistNavLink to="/artist/dashboard/settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </ArtistNavLink>
          </nav>
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link to="/discover" className="cursor-pointer flex items-center gap-2">
                    <Music2 className="w-4 h-4" />
                    Switch to Listener App
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="default">
              <Link to="/artist/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default ArtistHeader;
