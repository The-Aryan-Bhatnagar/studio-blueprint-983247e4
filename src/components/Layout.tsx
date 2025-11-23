import Header from "./Header";
import FullScreenPlayer from "./FullScreenPlayer";
import FloatingPlayerButton from "./FloatingPlayerButton";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 px-8 pb-24">{children}</main>
      <FloatingPlayerButton />
      <FullScreenPlayer />
    </div>
  );
};

export default Layout;
