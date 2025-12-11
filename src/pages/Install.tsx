import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Download, Smartphone, Zap, Wifi, Share, Plus, MoreVertical, ArrowLeft, Check } from "lucide-react";
import { useTransparentLogo } from "@/hooks/useTransparentLogo";
import { usePWAInstall } from "@/hooks/usePWAInstall";

const Install = () => {
  const logo = useTransparentLogo();
  const { isInstallable, isInstalled, isIOS, triggerInstall } = usePWAInstall();

  const benefits = [
    { icon: Zap, title: "Lightning Fast", description: "Instant loading with no browser delays" },
    { icon: Wifi, title: "Works Offline", description: "Access your music even without internet" },
    { icon: Smartphone, title: "Native Feel", description: "Full-screen experience like a real app" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/welcome" className="flex items-center gap-3">
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            <img src={logo} alt="GreenBoxx Logo" className="w-10 h-10 object-contain" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              GreenBoxx
            </span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-2xl">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary to-accent p-1">
            <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
              <img src={logo} alt="GreenBoxx" className="w-16 h-16 object-contain" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">Install GreenBoxx</h1>
          <p className="text-lg text-muted-foreground">
            Get the full app experience on your device
          </p>
        </div>

        {/* Already Installed */}
        {isInstalled && (
          <Card className="p-6 mb-8 bg-primary/10 border-primary/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Check className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Already Installed!</h3>
                <p className="text-sm text-muted-foreground">
                  GreenBoxx is ready on your home screen
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Benefits */}
        <div className="grid gap-4 mb-12">
          {benefits.map((benefit) => (
            <Card key={benefit.title} className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <benefit.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Install Instructions */}
        {!isInstalled && (
          <div className="space-y-8">
            {/* Android / Chrome */}
            {isInstallable && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Download className="w-5 h-5 text-primary" />
                  One-Tap Install
                </h2>
                <p className="text-muted-foreground mb-4">
                  Click the button below to install GreenBoxx instantly.
                </p>
                <Button onClick={triggerInstall} size="lg" className="w-full">
                  <Download className="w-5 h-5 mr-2" />
                  Install GreenBoxx
                </Button>
              </Card>
            )}

            {/* iOS Instructions */}
            {isIOS && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-primary" />
                  Install on iPhone/iPad
                </h2>
                <ol className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold flex-shrink-0">
                      1
                    </span>
                    <div>
                      <p className="font-medium">Tap the Share button</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        Look for <Share className="w-4 h-4" /> at the bottom of Safari
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold flex-shrink-0">
                      2
                    </span>
                    <div>
                      <p className="font-medium">Scroll and tap "Add to Home Screen"</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        Look for <Plus className="w-4 h-4" /> Add to Home Screen
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold flex-shrink-0">
                      3
                    </span>
                    <div>
                      <p className="font-medium">Tap "Add" to confirm</p>
                      <p className="text-sm text-muted-foreground">
                        GreenBoxx will appear on your home screen
                      </p>
                    </div>
                  </li>
                </ol>
              </Card>
            )}

            {/* Android Chrome Instructions (fallback) */}
            {!isIOS && !isInstallable && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-primary" />
                  Install on Android
                </h2>
                <ol className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold flex-shrink-0">
                      1
                    </span>
                    <div>
                      <p className="font-medium">Tap the menu button</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        Look for <MoreVertical className="w-4 h-4" /> in Chrome
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold flex-shrink-0">
                      2
                    </span>
                    <div>
                      <p className="font-medium">Tap "Install app" or "Add to Home screen"</p>
                      <p className="text-sm text-muted-foreground">
                        This option may vary by browser
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold flex-shrink-0">
                      3
                    </span>
                    <div>
                      <p className="font-medium">Tap "Install" to confirm</p>
                      <p className="text-sm text-muted-foreground">
                        GreenBoxx will be added to your home screen
                      </p>
                    </div>
                  </li>
                </ol>
              </Card>
            )}
          </div>
        )}

        {/* Back to app */}
        <div className="text-center mt-12">
          <Link to="/welcome">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to GreenBoxx
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Install;
