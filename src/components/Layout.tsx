import Header from "./Header";
import MusicPlayer from "./MusicPlayer";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 px-8 pb-32">{children}</main>
      <MusicPlayer />
    </div>
  );
};

export default Layout;
