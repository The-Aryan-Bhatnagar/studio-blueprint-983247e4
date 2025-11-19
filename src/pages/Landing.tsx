import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Music, Headphones, Radio, Users } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Music className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              GreenBox
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/auth/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/auth/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          Your Music, Your Way
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Discover, stream, and share music with a community of passionate listeners. 
          Experience the future of music streaming.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/auth/signup">
            <Button size="lg" className="w-full sm:w-auto">
              Get Started Free
            </Button>
          </Link>
          <Link to="/auth/login">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Sign In
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Headphones className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Unlimited Streaming</h3>
            <p className="text-muted-foreground">
              Listen to millions of songs, albums, and playlists without limits
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
              <Radio className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Discover New Music</h3>
            <p className="text-muted-foreground">
              Find your next favorite artist with personalized recommendations
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Community Driven</h3>
            <p className="text-muted-foreground">
              Connect with other music lovers and share your passion
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to start listening?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Join thousands of music lovers already enjoying GreenBox
          </p>
          <Link to="/auth/signup">
            <Button size="lg">Create Your Free Account</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 GreenBox. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
