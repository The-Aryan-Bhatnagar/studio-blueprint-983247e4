import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useTransparentLogo } from "@/hooks/useTransparentLogo";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const ArtistLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isArtist, loading } = useAuth();
  const logo = useTransparentLogo();

  // Redirect if already logged in as artist
  useEffect(() => {
    if (!loading && user && isArtist) {
      navigate("/artist/dashboard");
    }
  }, [user, isArtist, loading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Wait a moment for auth state to update
    setTimeout(async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .eq("role", "artist")
          .maybeSingle();
        
        if (roleData) {
          toast({
            title: "Artist Login Successful",
            description: "Welcome to your dashboard!",
          });
          navigate("/artist/dashboard");
        } else {
          toast({
            title: "Access Denied",
            description: "You don't have artist access. Please sign up as an artist.",
            variant: "destructive",
          });
          await supabase.auth.signOut();
        }
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-8">
        <div className="flex items-center justify-center gap-3 mb-8">
          <img src={logo} alt="GreenBox Logo" className="w-16 h-16 object-contain" />
          <span className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Artist Portal
          </span>
        </div>

        <h1 className="text-2xl font-bold mb-2 text-center">Artist Login</h1>
        <p className="text-muted-foreground text-center mb-6">
          Access your artist dashboard
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="artist@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full bg-gradient-primary" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login as Artist"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Not registered as an artist?{" "}
          <Link to="/artist/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default ArtistLogin;
