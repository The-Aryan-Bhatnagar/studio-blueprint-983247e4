import Header from "./Header";
import FullScreenPlayer from "./FullScreenPlayer";
import { MiniPlayer } from "./player/MiniPlayer";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 px-8 pb-32">{children}</main>
      <MiniPlayer />
      <FullScreenPlayer />
    </div>
  );
};

export default Layout;
