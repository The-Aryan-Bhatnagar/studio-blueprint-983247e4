import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { CalendarIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTransparentLogo } from "@/hooks/useTransparentLogo";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState<Date>();
  const [loading, setLoading] = useState(false);
  const [signupMethod, setSignupMethod] = useState<"email" | "phone">("email");
  const navigate = useNavigate();
  const { toast } = useToast();
  const logo = useTransparentLogo();

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.length < 6) {
      toast({
        title: "Invalid Password",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone_number: phone,
            city: city,
            country: country,
            date_of_birth: dateOfBirth?.toISOString().split('T')[0],
          },
          emailRedirectTo: `${window.location.origin}/auth/verify-otp`,
        },
      });

      if (error) throw error;

      // Always show verification message for new signups
      toast({
        title: "Verification Email Sent",
        description: "Please check your email for the 6-digit verification code",
      });
      navigate("/auth/verify-otp", { state: { email, type: "signup" } });
    } catch (error: any) {
      toast({
        title: "Signup Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone,
        options: {
          data: {
            full_name: fullName,
            city: city,
            country: country,
            date_of_birth: dateOfBirth?.toISOString().split('T')[0],
          },
        },
      });

      if (error) throw error;

      toast({
        title: "Verification Code Sent",
        description: "Please check your phone for the OTP",
      });
      navigate("/auth/verify-otp", { state: { phone, type: "signup" } });
    } catch (error: any) {
      toast({
        title: "Signup Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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

        <h1 className="text-2xl font-bold mb-2 text-center">Create Account</h1>
        <p className="text-muted-foreground text-center mb-6">
          Sign up to start listening
        </p>

        <Tabs value={signupMethod} onValueChange={(v) => setSignupMethod(v as "email" | "phone")} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="phone">Phone</TabsTrigger>
          </TabsList>

          <TabsContent value="email">
            <form onSubmit={handleEmailSignup} className="space-y-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    type="text"
                    placeholder="Your city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    type="text"
                    placeholder="Your country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="dob">Date of Birth</Label>
                <div className="flex gap-2">
                  <Input
                    id="dob"
                    type="date"
                    value={dateOfBirth ? format(dateOfBirth, "yyyy-MM-dd") : ""}
                    onChange={(e) => {
                      const date = e.target.value ? new Date(e.target.value) : undefined;
                      setDateOfBirth(date);
                    }}
                    max={format(new Date(), "yyyy-MM-dd")}
                    min="1900-01-01"
                    className="flex-1"
                    required
                  />
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className={cn(
                          !dateOfBirth && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dateOfBirth}
                        onSelect={setDateOfBirth}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        defaultMonth={dateOfBirth || new Date(2000, 0)}
                        captionLayout="dropdown-buttons"
                        fromYear={1900}
                        toYear={new Date().getFullYear()}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number (Optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1234567890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full bg-gradient-primary">
                {loading ? "Creating Account..." : "Sign Up with Email"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="phone">
            <form onSubmit={handlePhoneSignup} className="space-y-4">
              <div>
                <Label htmlFor="fullNamePhone">Full Name</Label>
                <Input
                  id="fullNamePhone"
                  type="text"
                  placeholder="Your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cityPhone">City</Label>
                  <Input
                    id="cityPhone"
                    type="text"
                    placeholder="Your city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="countryPhone">Country</Label>
                  <Input
                    id="countryPhone"
                    type="text"
                    placeholder="Your country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="dobPhone">Date of Birth</Label>
                <div className="flex gap-2">
                  <Input
                    id="dobPhone"
                    type="date"
                    value={dateOfBirth ? format(dateOfBirth, "yyyy-MM-dd") : ""}
                    onChange={(e) => {
                      const date = e.target.value ? new Date(e.target.value) : undefined;
                      setDateOfBirth(date);
                    }}
                    max={format(new Date(), "yyyy-MM-dd")}
                    min="1900-01-01"
                    className="flex-1"
                    required
                  />
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className={cn(
                          !dateOfBirth && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dateOfBirth}
                        onSelect={setDateOfBirth}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        defaultMonth={dateOfBirth || new Date(2000, 0)}
                        captionLayout="dropdown-buttons"
                        fromYear={1900}
                        toYear={new Date().getFullYear()}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div>
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="+1234567890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Include country code (e.g., +1 for US)
                </p>
              </div>

              <Button type="submit" disabled={loading} className="w-full bg-gradient-primary">
                {loading ? "Sending Code..." : "Sign Up with Phone"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link to="/auth/login" className="text-primary hover:underline">
            Login
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default Signup;
