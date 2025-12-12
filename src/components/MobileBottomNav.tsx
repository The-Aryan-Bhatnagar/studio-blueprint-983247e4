import { Home, Music, Users, Calendar } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const MobileBottomNav = () => {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Music, label: "Library", path: "/library" },
    { icon: Users, label: "Community", path: "/community" },
    { icon: Calendar, label: "Events", path: "/events" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-[60px] bg-card border-t border-border z-50 flex items-center justify-around px-4">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={cn(
            "flex items-center justify-center w-12 h-12 rounded-full transition-all",
            location.pathname === item.path
              ? "text-primary bg-primary/10"
              : "text-muted-foreground hover:text-foreground"
          )}
          aria-label={item.label}
        >
          <item.icon className="w-6 h-6" />
        </Link>
      ))}
    </nav>
  );
};

export default MobileBottomNav;
