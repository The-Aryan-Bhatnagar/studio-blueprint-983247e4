import { supabase } from "@/integrations/supabase/client";
import { useCallback, useRef } from "react";

type DeviceType = 'mobile' | 'tablet' | 'desktop';

const getDeviceType = (): DeviceType => {
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
};

export const useAdTracking = () => {
  const trackedViews = useRef<Set<string>>(new Set());

  const trackView = useCallback(async (adId: string) => {
    // Prevent duplicate tracking in same session
    if (trackedViews.current.has(adId)) return;
    trackedViews.current.add(adId);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      await supabase.from("ad_analytics").insert({
        ad_id: adId,
        event_type: 'view',
        device_type: getDeviceType(),
        user_id: user?.id || null,
        user_agent: navigator.userAgent,
        referrer: document.referrer || null,
      });
    } catch (error) {
      console.error("Error tracking ad view:", error);
    }
  }, []);

  const trackClick = useCallback(async (adId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      await supabase.from("ad_analytics").insert({
        ad_id: adId,
        event_type: 'click',
        device_type: getDeviceType(),
        user_id: user?.id || null,
        user_agent: navigator.userAgent,
        referrer: document.referrer || null,
      });
    } catch (error) {
      console.error("Error tracking ad click:", error);
    }
  }, []);

  return { trackView, trackClick };
};
