import { NavLink as RouterNavLink, NavLinkProps } from "react-router-dom";
import { cn } from "@/lib/utils";

interface ArtistNavLinkProps extends NavLinkProps {
  activeClassName?: string;
}

const ArtistNavLink = ({ 
  className, 
  activeClassName = "text-primary font-semibold", 
  children, 
  ...props 
}: ArtistNavLinkProps) => {
  return (
    <RouterNavLink
      className={({ isActive }) =>
        cn(
          "text-muted-foreground hover:text-foreground transition-colors",
          className,
          isActive && activeClassName
        )
      }
      {...props}
    >
      {children}
    </RouterNavLink>
  );
};

export default ArtistNavLink;
