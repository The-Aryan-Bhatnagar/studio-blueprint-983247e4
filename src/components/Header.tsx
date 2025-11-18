import { Home, Mic2, Calendar, Users, Search as SearchIcon, Music, Upload, Bell, User } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { icon: Music, label: "Library", path: "/library" },
    { icon: Users, label: "Community", path: "/community" },
    { icon: Calendar, label: "Events", path: "/events" },
  ];

  const artistItems = [
    { icon: Mic2, label: "Artist", path: "/artist" },
    { icon: Upload, label: "Dashboard", path: "/artist/dashboard" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-card border-b border-border px-6 flex items-center gap-6 z-50">
      {/* Logo - Links to Discover */}
      <Link to="/discover" className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
          <Music className="w-6 h-6" />
        </div>
      </Link>

      {/* Home Button */}
      <Link
        to="/"
        className={cn(
          "flex items-center justify-center w-10 h-10 rounded-full transition-all",
          location.pathname === "/"
            ? "bg-secondary text-primary"
            : "bg-background/50 text-muted-foreground hover:bg-secondary"
        )}
      >
        <Home className="w-5 h-5" />
      </Link>

      {/* Search Bar */}
      <div className="flex-1 max-w-xl relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="What do you want to play?"
          className="w-full pl-10 bg-background/50 border-0 rounded-full h-10"
          onFocus={() => navigate("/search")}
        />
      </div>

      {/* GreenBox Brand Name */}
      <div className="flex-1 flex justify-center">
        <h1 className="text-2xl font-bold text-foreground">GreenBox</h1>
      </div>

      {/* Navigation Items */}
      <nav className="flex items-center gap-2">
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

      {/* Divider */}
      <div className="h-6 w-px bg-border hidden xl:block" />

      {/* Artist Section */}
      <nav className="hidden xl:flex items-center gap-2">
        {artistItems.map((item) => (
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
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Right Actions */}
      <div className="flex items-center gap-2 ml-auto">
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="w-5 h-5" />
        </Button>
        <Link to="/profile">
          <Button variant="ghost" size="icon" className="rounded-full">
            <User className="w-5 h-5" />
          </Button>
        </Link>
      </div>
    </header>
  );
};

export default Header;
