import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { processLogoImage } from "@/utils/processLogo";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import logo from "@/assets/greenbox-logo.png";

const ProcessLogo = () => {
  const [processing, setProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const process = async () => {
      try {
        console.log("Starting logo processing...");
        const processedDataUrl = await processLogoImage(logo);
        
        // Store in localStorage for use across the app
        localStorage.setItem('greenbox-logo-transparent', processedDataUrl);
        
        console.log("Logo processed successfully!");
        
        // Redirect to home after 2 seconds
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } catch (err) {
        console.error("Failed to process logo:", err);
        setError("Failed to process logo. Using original instead.");
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } finally {
        setProcessing(false);
      }
    };

    process();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="p-8 max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <img src={logo} alt="GreenBox Logo" className="w-32 h-32 object-contain" />
        </div>
        
        {processing ? (
          <>
            <div className="flex justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">Processing Logo</h2>
              <p className="text-muted-foreground">
                Removing background from logo...
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                This may take a moment
              </p>
            </div>
          </>
        ) : error ? (
          <div>
            <h2 className="text-xl font-bold mb-2 text-destructive">Error</h2>
            <p className="text-muted-foreground">{error}</p>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-bold mb-2 text-primary">Success!</h2>
            <p className="text-muted-foreground">Logo processed successfully</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ProcessLogo;
