import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate, useLocation } from "react-router-dom";
import { Music } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const email = location.state?.email;
  const phone = location.state?.phone;
  const type = location.state?.type || "signup";

  useEffect(() => {
    if (!email && !phone) {
      navigate("/auth/signup");
    }
  }, [email, phone, navigate]);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a 6-digit code",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      let error;
      
      if (email) {
        const result = await supabase.auth.verifyOtp({
          email: email,
          token: otp,
          type: "signup",
        });
        error = result.error;
      } else if (phone) {
        const result = await supabase.auth.verifyOtp({
          phone: phone,
          token: otp,
          type: "sms",
        });
        error = result.error;
      }

      if (error) throw error;

      toast({
        title: "Verification Successful",
        description: "Welcome to GreenBox!",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Verification Failed",
        description: error.message || "Invalid or expired code",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      if (email) {
        const { error } = await supabase.auth.resend({
          type: "signup",
          email: email,
        });
        if (error) throw error;
      } else if (phone) {
        const { error } = await supabase.auth.signInWithOtp({
          phone: phone,
        });
        if (error) throw error;
      }

      toast({
        title: "Code Resent",
        description: "A new verification code has been sent",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-8">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Music className="w-7 h-7" />
          </div>
          <span className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            GreenBox
          </span>
        </div>

        <h1 className="text-2xl font-bold mb-2 text-center">Verify Your Account</h1>
        <p className="text-muted-foreground text-center mb-6">
          Enter the 6-digit code sent to {email || phone}
        </p>

        <div className="space-y-6">
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => setOtp(value)}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <Button
            onClick={handleVerify}
            disabled={loading || otp.length !== 6}
            className="w-full bg-gradient-primary"
          >
            {loading ? "Verifying..." : "Verify"}
          </Button>

          <div className="text-center">
            <Button
              variant="link"
              onClick={handleResend}
              disabled={resending}
              className="text-sm"
            >
              {resending ? "Sending..." : "Resend Code"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default VerifyOTP;
