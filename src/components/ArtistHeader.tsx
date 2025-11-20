import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { User, LogOut, Music2, Mic2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useArtistProfile } from "@/hooks/useArtistProfile";
import { cn } from "@/lib/utils";

const ArtistHeader = () => {
  const { user, signOut } = useAuth();
  const { data: artistProfile } = useArtistProfile();

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/artist/login";
  };

  const getNameColorClass = (theme: string | null) => {
    switch (theme) {
      case 'gold':
        return 'text-[hsl(var(--artist-name-gold))]';
      case 'neon':
        return 'text-[hsl(var(--artist-name-neon))]';
      case 'gradient':
        return 'bg-gradient-to-r from-[hsl(var(--artist-name-gold))] to-[hsl(var(--artist-name-neon))] bg-clip-text text-transparent';
      case 'white':
      default:
        return 'text-[hsl(var(--artist-name-white))]';
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
      <div className="flex items-center justify-between px-8 py-4">
        {/* Logo */}
        <div className="flex-1">
          <Link to="/artist/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Mic2 className="w-6 h-6 text-white" />
            </div>
          </Link>
        </div>

        {/* Artist Name - Center */}
        {artistProfile && (
          <div className="flex-1 flex justify-center">
            <h2 className={cn(
              "text-3xl font-bold transition-all duration-300",
              getNameColorClass(artistProfile.name_color_theme)
            )}>
              {artistProfile.stage_name}
            </h2>
          </div>
        )}

        {/* User Actions */}
        <div className="flex-1 flex justify-end">
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
      </div>
    </header>
  );
};

export default ArtistHeader;
