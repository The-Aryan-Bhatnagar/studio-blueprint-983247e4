import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useTransparentLogo } from "@/hooks/useTransparentLogo";
import { supabase } from "@/integrations/supabase/client";

const ArtistSignup = () => {
  const [name, setName] = useState("");
  const [stageName, setStageName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const logo = useTransparentLogo();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Sign up the user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            stage_name: stageName,
            full_name: name,
          },
        },
      });

      if (signUpError) throw signUpError;
      if (!authData.user) throw new Error("No user returned from signup");

      // Create artist profile
      const { error: profileError } = await supabase
        .from("artist_profiles")
        .insert({
          user_id: authData.user.id,
          stage_name: stageName,
        });

      if (profileError) throw profileError;

      // Assign artist role
      const { error: roleError } = await supabase
        .from("user_roles")
        .insert({
          user_id: authData.user.id,
          role: "artist",
        });

      if (roleError) throw roleError;

      toast({
        title: "Account Created Successfully!",
        description: "Welcome to the Artist Portal. You can now login.",
      });

      navigate("/artist/login");
    } catch (error: any) {
      toast({
        title: "Signup Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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

        <h1 className="text-2xl font-bold mb-2 text-center">Become an Artist</h1>
        <p className="text-muted-foreground text-center mb-6">
          Create your artist profile
        </p>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="stageName">Stage Name</Label>
            <Input
              id="stageName"
              type="text"
              placeholder="Your artist name"
              value={stageName}
              onChange={(e) => setStageName(e.target.value)}
              required
            />
          </div>

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
            {isLoading ? "Creating Account..." : "Create Artist Account"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an artist account?{" "}
          <Link to="/artist/login" className="text-primary hover:underline">
            Login
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default ArtistSignup;
