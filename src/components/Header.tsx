import { Home, Calendar, Users, Search as SearchIcon, Music, Bell, User, LogOut, Heart, ListMusic, Settings, Mic2, Menu, X } from "lucide-react";
import { useTransparentLogo } from "@/hooks/useTransparentLogo";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { NotificationBell } from "@/components/NotificationBell";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const logo = useTransparentLogo();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { icon: Music, label: "Library", path: "/library" },
    { icon: Users, label: "Community", path: "/community" },
    { icon: Calendar, label: "Events", path: "/events" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-card/95 backdrop-blur-md border-b-2 border-border shadow-sm px-4 md:px-6 flex items-center gap-2 md:gap-6 z-50">
      {/* Mobile Menu */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64">
          <nav className="flex flex-col gap-4 mt-8">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                location.pathname === "/"
                  ? "bg-secondary text-primary"
                  : "text-muted-foreground hover:bg-secondary/50"
              )}
            >
              <Home className="w-5 h-5" />
              <span>Home</span>
            </Link>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                  location.pathname === item.path
                    ? "bg-secondary text-primary"
                    : "text-muted-foreground hover:bg-secondary/50"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      
      {/* Logo - Links to Discover */}
      <Link to="/discover" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
        <img 
          src={logo} 
          alt="GreenBox Logo" 
          className="w-14 h-14 md:w-20 md:h-20 object-contain drop-shadow-2xl" 
        />
      </Link>

      {/* Home Button - Desktop Only */}
      <Link
        to="/"
        className={cn(
          "hidden md:flex items-center justify-center w-10 h-10 rounded-full transition-all",
          location.pathname === "/"
            ? "bg-secondary text-primary"
            : "bg-background/50 text-muted-foreground hover:bg-secondary"
        )}
      >
        <Home className="w-5 h-5" />
      </Link>

      {/* Search Bar */}
      <div className="hidden sm:flex flex-1 max-w-xl relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="What do you want to play?"
          className="w-full pl-10 bg-background/50 border-0 rounded-full h-10"
          onFocus={() => navigate("/search")}
        />
      </div>

      {/* Search Icon - Mobile Only */}
      <Button
        variant="ghost"
        size="icon"
        className="sm:hidden"
        onClick={() => navigate("/search")}
      >
        <SearchIcon className="h-5 w-5" />
      </Button>

      {/* GreenBox Brand Name - Desktop Only */}
      <div className="hidden lg:flex flex-1 justify-center">
        <h1 className="text-2xl font-bold text-primary">GreenBox</h1>
      </div>

      {/* Navigation Items - Desktop Only */}
      <nav className="hidden md:flex items-center gap-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
              location.pathname === item.path
                ? "bg-secondary text-primary"
                : "text-muted-foreground hover:bg-secondary/50"
            )}
          >
            <item.icon className="w-4 h-4" />
            <span className="hidden lg:inline">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Right Actions */}
      <div className="flex items-center gap-2 ml-auto">
        <ThemeToggle />
        {user && <NotificationBell />}
        
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => navigate("/profile")}>
                <User className="w-4 h-4 mr-2" />
                My Account
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/library")}>
                <ListMusic className="w-4 h-4 mr-2" />
                My Playlists
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/library")}>
                <Heart className="w-4 h-4 mr-2" />
                My Liked Songs
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/profile")}>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/artist/login")}>
                <Mic2 className="w-4 h-4 mr-2" />
                Are you an artist?
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut} className="text-destructive">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button 
            onClick={() => navigate("/auth/login")} 
            variant="default"
            className="rounded-full text-xs md:text-sm px-3 md:px-4"
          >
            Login
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
