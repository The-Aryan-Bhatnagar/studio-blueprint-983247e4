import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { useAdTracking } from "@/hooks/useAdTracking";

interface Ad {
  id: string;
  image_url: string;
  link_url: string | null;
  title: string;
}

const AdsBannerCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { trackView, trackClick } = useAdTracking();

  const { data: ads = [] } = useQuery({
    queryKey: ["banner-ads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ads")
        .select("*")
        .eq("is_active", true)
        .in("position", ["fullscreen", "banner", "hero"])
        .order("priority", { ascending: false })
        .limit(4);

      if (error) throw error;
      return data as Ad[];
    },
  });

  const nextSlide = useCallback(() => {
    if (ads.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % ads.length);
    }
  }, [ads.length]);

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (ads.length <= 1) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [ads.length, nextSlide]);

  // Track view when ad becomes visible
  useEffect(() => {
    if (ads.length > 0 && ads[currentIndex]) {
      trackView(ads[currentIndex].id);
    }
  }, [currentIndex, ads, trackView]);

  const handleAdClick = (ad: Ad) => {
    trackClick(ad.id);
    if (ad.link_url) {
      window.open(ad.link_url, "_blank", "noopener,noreferrer");
    }
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Fallback content when no ads are available
  if (ads.length === 0) {
    return (
      <section className="w-full mb-6 md:mb-10">
        <div className="relative w-full h-[220px] sm:h-[280px] md:h-[320px] lg:h-[380px] rounded-[20px] overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/20 shadow-xl">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-6">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2">
                Ad Space Available
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base">
                Contact admin to display your ads here
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full mb-6 md:mb-10">
      <div className="relative w-full h-[220px] sm:h-[280px] md:h-[320px] lg:h-[380px] rounded-[20px] overflow-hidden shadow-xl">
        {/* Slides */}
        <div className="relative w-full h-full">
          {ads.map((ad, index) => (
            <div
              key={ad.id}
              onClick={() => handleAdClick(ad)}
              className={cn(
                "absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out cursor-pointer",
                index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
              )}
            >
              <img
                src={ad.image_url}
                alt={ad.title}
                className="w-full h-full object-cover"
              />
              {/* Gradient overlay for better visibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            </div>
          ))}
        </div>

        {/* Dot indicators */}
        {ads.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {ads.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  goToSlide(index);
                }}
                className={cn(
                  "w-2.5 h-2.5 rounded-full transition-all duration-300",
                  index === currentIndex
                    ? "bg-white w-6"
                    : "bg-white/50 hover:bg-white/75"
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AdsBannerCarousel;
