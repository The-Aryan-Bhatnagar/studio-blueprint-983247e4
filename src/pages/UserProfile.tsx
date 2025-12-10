import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { User, Mail, Phone, LogOut, Camera } from "lucide-react";
import AvatarUpload from "@/components/AvatarUpload";

const UserProfile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        navigate("/auth/login");
        return;
      }

      setUser(authUser);

      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", authUser.id)
        .single();

      if (error && error.code !== "PGRST116") throw error;

      if (profileData) {
        setProfile(profileData);
        setFullName(profileData.full_name || "");
        setPhoneNumber(profileData.phone_number || "");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          phone_number: phoneNumber,
        })
        .eq("user_id", user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged Out",
        description: "You have been logged out successfully",
      });
      navigate("/auth/login");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32 px-4 md:px-6 py-4 md:py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl md:text-4xl font-bold mb-4 md:mb-8">My Account</h1>

        {/* Profile Picture Section */}
        <Card className="p-4 md:p-8 mb-4 md:mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 mb-4 md:mb-6">
            <AvatarUpload
              currentAvatarUrl={profile?.avatar_url}
              userName={fullName}
            />
            <div className="text-center sm:text-left">
              <h2 className="text-xl md:text-2xl font-bold">{fullName || "User"}</h2>
              <p className="text-sm md:text-base text-muted-foreground break-all">{user?.email}</p>
            </div>
          </div>
        </Card>

        {/* Profile Information */}
        <Card className="p-4 md:p-8 mb-4 md:mb-6">
          <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6">Profile Information</h3>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <Label htmlFor="fullName" className="flex items-center gap-2 text-sm md:text-base">
                <User className="w-4 h-4" />
                Full Name
              </Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="email" className="flex items-center gap-2 text-sm md:text-base">
                <Mail className="w-4 h-4" />
                Email
              </Label>
              <Input
                id="email"
                value={user?.email || ""}
                disabled
                className="bg-muted mt-1.5"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Email cannot be changed
              </p>
            </div>

            <div>
              <Label htmlFor="phone" className="flex items-center gap-2 text-sm md:text-base">
                <Phone className="w-4 h-4" />
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1234567890"
                className="mt-1.5"
              />
            </div>

            <Button type="submit" disabled={saving} className="w-full bg-gradient-primary">
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </Card>

        {/* Account Actions */}
        <Card className="p-4 md:p-8">
          <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6">Account Actions</h3>
          <div className="space-y-3 md:space-y-4">
            <Button
              variant="outline"
              className="w-full justify-start text-sm md:text-base"
              onClick={() => navigate("/auth/forgot-password")}
            >
              Change Password
            </Button>
            <Button
              variant="destructive"
              className="w-full justify-start text-sm md:text-base"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;
