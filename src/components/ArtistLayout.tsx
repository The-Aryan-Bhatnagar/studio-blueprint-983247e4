import ArtistHeader from "./ArtistHeader";

interface ArtistLayoutProps {
  children: React.ReactNode;
}

const ArtistLayout = ({ children }: ArtistLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <ArtistHeader />
      <main className="pt-24 px-8 pb-16 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
};

export default ArtistLayout;
