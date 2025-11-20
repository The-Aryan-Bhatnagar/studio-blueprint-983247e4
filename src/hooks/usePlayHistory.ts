import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfDay, endOfDay } from "date-fns";

export interface PlayHistoryStats {
  totalPlays: number;
  uniqueListeners: number;
  deviceStats: { type: string; count: number; percentage: number }[];
  countryStats: { country: string; count: number; percentage: number }[];
  cityStats: { city: string; count: number }[];
  trafficStats: { source: string; count: number; percentage: number }[];
  ageGroupStats: { range: string; count: number; percentage: number }[];
}

export const usePlayHistory = (
  songId: string,
  startDate?: Date,
  endDate?: Date
) => {
  return useQuery({
    queryKey: ["playHistory", songId, startDate, endDate],
    queryFn: async (): Promise<PlayHistoryStats> => {
      // Build query with date filters
      let query = supabase
        .from("play_history")
        .select("*")
        .eq("song_id", songId);

      if (startDate) {
        query = query.gte("played_at", startOfDay(startDate).toISOString());
      }
      if (endDate) {
        query = query.lte("played_at", endOfDay(endDate).toISOString());
      }

      const { data: plays, error } = await query;

      if (error) throw error;

      const totalPlays = plays?.length || 0;
      const uniqueListeners = new Set(
        plays?.filter((p) => p.user_id).map((p) => p.user_id)
      ).size;

      // Calculate device stats
      const deviceCounts: Record<string, number> = {};
      plays?.forEach((play) => {
        const device = play.device_type || "Unknown";
        deviceCounts[device] = (deviceCounts[device] || 0) + 1;
      });

      const deviceStats = Object.entries(deviceCounts)
        .map(([type, count]) => ({
          type,
          count,
          percentage: totalPlays > 0 ? Math.round((count / totalPlays) * 100) : 0,
        }))
        .sort((a, b) => b.count - a.count);

      // Calculate country stats
      const countryCounts: Record<string, number> = {};
      plays?.forEach((play) => {
        if (play.country) {
          countryCounts[play.country] = (countryCounts[play.country] || 0) + 1;
        }
      });

      const countryStats = Object.entries(countryCounts)
        .map(([country, count]) => ({
          country,
          count,
          percentage: totalPlays > 0 ? Math.round((count / totalPlays) * 100) : 0,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Calculate city stats
      const cityCounts: Record<string, number> = {};
      plays?.forEach((play) => {
        if (play.city) {
          cityCounts[play.city] = (cityCounts[play.city] || 0) + 1;
        }
      });

      const cityStats = Object.entries(cityCounts)
        .map(([city, count]) => ({
          city,
          count,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Calculate traffic source stats
      const trafficCounts: Record<string, number> = {};
      plays?.forEach((play) => {
        const source = play.traffic_source || "direct";
        trafficCounts[source] = (trafficCounts[source] || 0) + 1;
      });

      const trafficStats = Object.entries(trafficCounts)
        .map(([source, count]) => ({
          source,
          count,
          percentage: totalPlays > 0 ? Math.round((count / totalPlays) * 100) : 0,
        }))
        .sort((a, b) => b.count - a.count);

      // Calculate age group stats
      const ageGroupCounts: Record<string, number> = {};
      plays?.forEach((play) => {
        if (play.user_age_group) {
          ageGroupCounts[play.user_age_group] =
            (ageGroupCounts[play.user_age_group] || 0) + 1;
        }
      });

      const ageGroupStats = Object.entries(ageGroupCounts)
        .map(([range, count]) => ({
          range,
          count,
          percentage: totalPlays > 0 ? Math.round((count / totalPlays) * 100) : 0,
        }))
        .sort((a, b) => {
          // Sort by age range
          const order = ["18-24", "25-34", "35-44", "45+"];
          return order.indexOf(a.range) - order.indexOf(b.range);
        });

      return {
        totalPlays,
        uniqueListeners,
        deviceStats,
        countryStats,
        cityStats,
        trafficStats,
        ageGroupStats,
      };
    },
    enabled: !!songId,
  });
};