import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useTransparentLogo } from "@/hooks/useTransparentLogo";
import { supabase } from "@/integrations/supabase/client";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const logo = useTransparentLogo();

  const { phone, email, type, recordLogin } = (location.state as {
    phone?: string;
    email?: string;
    type?: string;
    recordLogin?: boolean;
  }) || {};

  useEffect(() => {
    if (!phone && !email) {
      navigate("/auth/login");
    }
  }, [phone, email, navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const recordLoginHistory = async (userId: string) => {
    try {
      const userAgent = navigator.userAgent;
      const isMobile = /Mobile|Android|iPhone|iPad/.test(userAgent);
      const isTablet = /iPad|Tablet/.test(userAgent);
      const deviceType = isMobile ? (isTablet ? "tablet" : "mobile") : "desktop";
      
      let browser = "Unknown";
      if (userAgent.includes("Chrome")) browser = "Chrome";
      else if (userAgent.includes("Firefox")) browser = "Firefox";
      else if (userAgent.includes("Safari")) browser = "Safari";
      else if (userAgent.includes("Edge")) browser = "Edge";
      
      await supabase.from("login_history").insert({
        user_id: userId,
        device_type: deviceType,
        browser: browser,
        ip_address: null,
        location: null,
      });
    } catch (err) {
      console.error("Failed to record login history:", err);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (phone) {
        const { data, error } = await supabase.auth.verifyOtp({
          phone,
          token: otp,
          type: "sms",
        });

        if (error) throw error;

        if (recordLogin && data.user) {
          await recordLoginHistory(data.user.id);
        }

        toast({
          title: "Verification Successful",
          description: "Welcome to GreenBox!",
        });
        navigate("/");
      } else if (email) {
        const { data, error } = await supabase.auth.verifyOtp({
          email,
          token: otp,
          type: "email",
        });

        if (error) throw error;

        toast({
          title: "Email Verified",
          description: "Your email has been verified. Welcome to GreenBox!",
        });
        navigate("/");
      }
    } catch (error: any) {
      toast({
        title: "Verification Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);

    try {
      if (phone) {
        const { error } = await supabase.auth.signInWithOtp({ phone });
        if (error) throw error;
      } else if (email) {
        const { error } = await supabase.auth.resend({
          type: "signup",
          email,
        });
        if (error) throw error;
      }

      toast({
        title: "Code Resent",
        description: `A new verification code has been sent to your ${phone ? "phone" : "email"}`,
      });
      setCountdown(60);
    } catch (error: any) {
      toast({
        title: "Failed to Resend",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-8">
        <div className="flex items-center justify-center gap-3 mb-8">
          <img src={logo} alt="GreenBox Logo" className="w-16 h-16 object-contain" />
          <span className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            GreenBox
          </span>
        </div>

        <h1 className="text-2xl font-bold mb-2 text-center">Verify Your {phone ? "Phone" : "Email"}</h1>
        <p className="text-muted-foreground text-center mb-6">
          Enter the verification code sent to{" "}
          <span className="font-medium text-foreground">{phone || email}</span>
        </p>

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <Label htmlFor="otp">Verification Code</Label>
            <Input
              id="otp"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Enter 6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              className="text-center text-2xl tracking-widest"
              maxLength={6}
              required
            />
          </div>

          <Button type="submit" disabled={loading || otp.length < 6} className="w-full bg-gradient-primary">
            {loading ? "Verifying..." : "Verify"}
          </Button>

          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Didn't receive the code?
            </p>
            <Button
              type="button"
              variant="link"
              onClick={handleResend}
              disabled={resendLoading || countdown > 0}
              className="text-primary"
            >
              {countdown > 0 ? `Resend in ${countdown}s` : resendLoading ? "Sending..." : "Resend Code"}
            </Button>
          </div>
        </form>

        <Button
          variant="ghost"
          className="w-full mt-4"
          onClick={() => navigate("/auth/login")}
        >
          Back to Login
        </Button>
      </Card>
    </div>
  );
};

export default VerifyOtp;
