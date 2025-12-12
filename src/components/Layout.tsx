import Header from "./Header";
import MusicPlayer from "./MusicPlayer";
import MobileBottomNav from "./MobileBottomNav";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 px-4 md:px-8 pb-40 md:pb-32">{children}</main>
      <MusicPlayer />
      <MobileBottomNav />
    </div>
  );
};

export default Layout;
