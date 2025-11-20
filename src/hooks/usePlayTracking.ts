import { useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export const usePlayTracking = () => {
  const trackedSongs = useRef<Set<string>>(new Set());
  const playTimers = useRef<Map<string, number>>(new Map());

  const startTracking = useCallback((
    songId: string, 
    trafficSource?: string
  ) => {
    // Clear any existing timer for this song
    const existingTimer = playTimers.current.get(songId);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    // If already tracked in this session, don't track again
    if (trackedSongs.current.has(songId)) {
      return;
    }

    // Set a timer for 30 seconds
    const timer = setTimeout(async () => {
      try {
        // Call edge function to increment play count
        const { error } = await supabase.functions.invoke('increment-play-count', {
          body: { 
            song_id: songId,
            traffic_source: trafficSource || 'direct',
          },
        });

        if (error) {
          console.error('Error tracking play:', error);
        } else {
          // Mark as tracked for this session
          trackedSongs.current.add(songId);
          console.log(`Play tracked for song: ${songId}, source: ${trafficSource || 'direct'}`);
        }
      } catch (error) {
        console.error('Error tracking play:', error);
      } finally {
        // Clean up timer
        playTimers.current.delete(songId);
      }
    }, 30000); // 30 seconds

    playTimers.current.set(songId, timer as unknown as number);
  }, []);

  const stopTracking = useCallback((songId: string) => {
    // Clear the timer if user stops playing before 30 seconds
    const timer = playTimers.current.get(songId);
    if (timer) {
      clearTimeout(timer);
      playTimers.current.delete(songId);
    }
  }, []);

  const resetTracking = useCallback(() => {
    // Clear all timers
    playTimers.current.forEach((timer) => clearTimeout(timer));
    playTimers.current.clear();
    trackedSongs.current.clear();
  }, []);

  return {
    startTracking,
    stopTracking,
    resetTracking,
  };
};
