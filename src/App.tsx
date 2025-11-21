import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PlayerProvider } from "./contexts/PlayerContext";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import ArtistLayout from "./components/ArtistLayout";
import UserLayout from "./components/UserLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Discover from "./pages/Discover";
import Search from "./pages/Search";
import Library from "./pages/Library";
import Events from "./pages/Events";
import UserProfile from "./pages/UserProfile";
import UserDashboard from "./pages/user/UserDashboard";
import ArtistProfile from "./pages/ArtistProfile";
import ArtistProfilePublic from "./pages/ArtistProfilePublic";
import ArtistDashboard from "./pages/ArtistDashboard";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import ArtistLogin from "./pages/artist/ArtistLogin";
import ArtistSignup from "./pages/artist/ArtistSignup";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ArtistManagement from "./pages/admin/ArtistManagement";
import UserManagement from "./pages/admin/UserManagement";
import SongManagement from "./pages/admin/SongManagement";
import EventManagement from "./pages/admin/EventManagement";
import CommentManagement from "./pages/admin/CommentManagement";
import AnalyticsPage from "./pages/admin/AnalyticsPage";
import SettingsPage from "./pages/admin/SettingsPage";
import AdsManagement from "./pages/admin/AdsManagement";
import AdminArtistDashboard from "./pages/admin/ArtistDashboard";
import AdminUserDashboard from "./pages/admin/UserDashboard";
import AdsDashboard from "./pages/admin/AdsDashboard";
import AdminLayout from "./components/AdminLayout";
import PlaylistDetail from "./pages/PlaylistDetail";
import Community from "./pages/Community";
import SongAnalytics from "./pages/artist/SongAnalytics";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <PlayerProvider>
            <Toaster />
            <Sonner />
            <Routes>
              {/* Auth Routes - No Layout */}
              <Route path="/welcome" element={<Landing />} />
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/signup" element={<Signup />} />
              <Route path="/auth/forgot-password" element={<ForgotPassword />} />
              <Route path="/auth/reset-password" element={<ResetPassword />} />
              <Route path="/artist/login" element={<ArtistLogin />} />
              <Route path="/artist/signup" element={<ArtistSignup />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              
              {/* Admin Routes - All without sidebar layout */}
              <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/artists" element={<ProtectedRoute><AdminArtistDashboard /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute><AdminUserDashboard /></ProtectedRoute>} />
              <Route path="/admin/ads" element={<ProtectedRoute><AdsDashboard /></ProtectedRoute>} />
              <Route path="/admin/artists/manage" element={<ProtectedRoute><ArtistManagement /></ProtectedRoute>} />
              <Route path="/admin/users/manage" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
              <Route path="/admin/songs" element={<ProtectedRoute><SongManagement /></ProtectedRoute>} />
              <Route path="/admin/events" element={<ProtectedRoute><EventManagement /></ProtectedRoute>} />
              <Route path="/admin/comments" element={<ProtectedRoute><CommentManagement /></ProtectedRoute>} />
              <Route path="/admin/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
              <Route path="/admin/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
              <Route path="/admin/ads/manage" element={<ProtectedRoute><AdsManagement /></ProtectedRoute>} />
              
              {/* User Dashboard Routes - User Layout */}
              <Route path="/user/dashboard" element={<UserLayout><ProtectedRoute><UserDashboard /></ProtectedRoute></UserLayout>} />
              <Route path="/profile" element={<UserLayout><ProtectedRoute><UserProfile /></ProtectedRoute></UserLayout>} />
              
              {/* User Routes - Regular Layout with Music Player */}
              <Route path="/" element={<Layout><ProtectedRoute><Home /></ProtectedRoute></Layout>} />
              <Route path="/discover" element={<Layout><ProtectedRoute><Discover /></ProtectedRoute></Layout>} />
              <Route path="/search" element={<Layout><ProtectedRoute><Search /></ProtectedRoute></Layout>} />
              <Route path="/library" element={<Layout><ProtectedRoute><Library /></ProtectedRoute></Layout>} />
              <Route path="/playlist/:playlistId" element={<Layout><ProtectedRoute><PlaylistDetail /></ProtectedRoute></Layout>} />
              <Route path="/community" element={<Layout><ProtectedRoute><Community /></ProtectedRoute></Layout>} />
              <Route path="/events" element={<Layout><ProtectedRoute><Events /></ProtectedRoute></Layout>} />
              <Route path="/artist/:artistId" element={<Layout><ProtectedRoute><ArtistProfilePublic /></ProtectedRoute></Layout>} />
              
              {/* Artist Routes - Artist Layout (No Music Player) */}
              <Route path="/artist" element={<Layout><ProtectedRoute><ArtistProfile /></ProtectedRoute></Layout>} />
              <Route path="/artist/dashboard" element={<ArtistLayout><ProtectedRoute><ArtistDashboard /></ProtectedRoute></ArtistLayout>} />
              <Route path="/artist/dashboard/upload" element={<ArtistLayout><ProtectedRoute><ArtistDashboard /></ProtectedRoute></ArtistLayout>} />
              <Route path="/artist/dashboard/songs" element={<ArtistLayout><ProtectedRoute><ArtistDashboard /></ProtectedRoute></ArtistLayout>} />
              <Route path="/artist/dashboard/songs/:songId/analytics" element={<ArtistLayout><ProtectedRoute><SongAnalytics /></ProtectedRoute></ArtistLayout>} />
              <Route path="/artist/dashboard/community" element={<ArtistLayout><ProtectedRoute><ArtistDashboard /></ProtectedRoute></ArtistLayout>} />
              <Route path="/artist/dashboard/comments" element={<ArtistLayout><ProtectedRoute><ArtistDashboard /></ProtectedRoute></ArtistLayout>} />
              <Route path="/artist/dashboard/events" element={<ArtistLayout><ProtectedRoute><ArtistDashboard /></ProtectedRoute></ArtistLayout>} />
              <Route path="/artist/dashboard/settings" element={<ArtistLayout><ProtectedRoute><ArtistDashboard /></ProtectedRoute></ArtistLayout>} />
              
              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </PlayerProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
