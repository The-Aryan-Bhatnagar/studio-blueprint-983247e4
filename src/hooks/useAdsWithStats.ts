import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

export interface AdWithStats {
  id: string;
  title: string;
  image_url: string;
  link_url: string | null;
  position: string;
  priority: string;
  is_active: boolean;
  start_date: string | null;
  end_date: string | null;
  total_impressions: number;
  total_clicks: number;
  mobile_views: number;
  web_views: number;
  tablet_views: number;
  created_at: string;
}

export interface AdStats {
  totalAds: number;
  activeAds: number;
  totalImpressions: number;
  totalClicks: number;
  averageCtr: number;
  mobileViews: number;
  webViews: number;
  tabletViews: number;
}

export const useAdsWithStats = () => {
  const [realtimeAds, setRealtimeAds] = useState<AdWithStats[]>([]);

  const { data: ads = [], isLoading, refetch } = useQuery({
    queryKey: ["ads-with-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ads")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as AdWithStats[];
    },
  });

  // Subscribe to realtime updates
  useEffect(() => {
    const channel = supabase
      .channel("ads-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "ads",
        },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  useEffect(() => {
    setRealtimeAds(ads);
  }, [ads]);

  const stats: AdStats = {
    totalAds: realtimeAds.length,
    activeAds: realtimeAds.filter((ad) => ad.is_active).length,
    totalImpressions: realtimeAds.reduce((sum, ad) => sum + (ad.total_impressions || 0), 0),
    totalClicks: realtimeAds.reduce((sum, ad) => sum + (ad.total_clicks || 0), 0),
    averageCtr:
      realtimeAds.reduce((sum, ad) => sum + (ad.total_impressions || 0), 0) > 0
        ? (realtimeAds.reduce((sum, ad) => sum + (ad.total_clicks || 0), 0) /
            realtimeAds.reduce((sum, ad) => sum + (ad.total_impressions || 0), 0)) *
          100
        : 0,
    mobileViews: realtimeAds.reduce((sum, ad) => sum + (ad.mobile_views || 0), 0),
    webViews: realtimeAds.reduce((sum, ad) => sum + (ad.web_views || 0), 0),
    tabletViews: realtimeAds.reduce((sum, ad) => sum + (ad.tablet_views || 0), 0),
  };

  return { ads: realtimeAds, stats, isLoading, refetch };
};
