import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, X, Share, Plus } from "lucide-react";
import { usePWAInstall } from "@/hooks/usePWAInstall";

export function PWAInstallPrompt() {
  const { isInstallable, isInstalled, isIOS, triggerInstall } = usePWAInstall();
  const [showPrompt, setShowPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if user dismissed the prompt before
    const wasDismissed = localStorage.getItem("pwa-install-dismissed");
    if (wasDismissed) {
      const dismissedTime = parseInt(wasDismissed, 10);
      // Show again after 7 days
      if (Date.now() - dismissedTime < 7 * 24 * 60 * 60 * 1000) {
        setDismissed(true);
        return;
      }
    }

    // Show prompt after 3 seconds if installable and not dismissed
    const timer = setTimeout(() => {
      if ((isInstallable || isIOS) && !isInstalled && !dismissed) {
        setShowPrompt(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [isInstallable, isInstalled, isIOS, dismissed]);

  const handleDismiss = () => {
    setShowPrompt(false);
    setDismissed(true);
    localStorage.setItem("pwa-install-dismissed", Date.now().toString());
  };

  const handleInstall = async () => {
    const success = await triggerInstall();
    if (success) {
      setShowPrompt(false);
    }
  };

  if (!showPrompt || isInstalled) return null;

  return (
    <Card className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-80 p-4 z-50 bg-card border-primary/20 shadow-lg animate-in slide-in-from-bottom-5">
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted transition-colors"
      >
        <X className="w-4 h-4 text-muted-foreground" />
      </button>

      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Download className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">Install GreenBoxx</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Add to your home screen for the best experience
          </p>
        </div>
      </div>

      {isIOS ? (
        <div className="mt-4 space-y-2">
          <p className="text-xs text-muted-foreground">
            Tap <Share className="w-3 h-3 inline mx-1" /> then "Add to Home Screen" <Plus className="w-3 h-3 inline mx-1" />
          </p>
        </div>
      ) : (
        <Button onClick={handleInstall} className="w-full mt-4" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Install Now
        </Button>
      )}
    </Card>
  );
}
