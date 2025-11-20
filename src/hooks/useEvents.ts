import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "./use-toast";

export interface Event {
  id: string;
  artist_id: string;
  title: string;
  description: string | null;
  location: string;
  event_date: string;
  banner_url: string | null;
  ticket_price: number;
  total_seats: number;
  available_seats: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  artist_profiles?: {
    stage_name: string;
    avatar_url: string | null;
  };
}

export interface EventBooking {
  id: string;
  event_id: string;
  user_id: string;
  booking_date: string;
  number_of_tickets: number;
  total_amount: number;
  booking_status: string;
  created_at: string;
}

// Fetch all published events
export const useEvents = () => {
  return useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select(`
          *,
          artist_profiles!inner(stage_name, avatar_url)
        `)
        .eq("is_published", true)
        .gte("event_date", new Date().toISOString())
        .order("event_date", { ascending: true });

      if (error) throw error;
      return data as Event[];
    },
  });
};

// Fetch artist's events
export const useArtistEvents = (artistId?: string) => {
  return useQuery({
    queryKey: ["artist-events", artistId],
    queryFn: async () => {
      if (!artistId) return [];

      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("artist_id", artistId)
        .order("event_date", { ascending: false });

      if (error) throw error;
      return data as Event[];
    },
    enabled: !!artistId,
  });
};

// Fetch single event
export const useEvent = (eventId?: string) => {
  return useQuery({
    queryKey: ["event", eventId],
    queryFn: async () => {
      if (!eventId) return null;

      const { data, error } = await supabase
        .from("events")
        .select(`
          *,
          artist_profiles!inner(stage_name, avatar_url)
        `)
        .eq("id", eventId)
        .single();

      if (error) throw error;
      return data as Event;
    },
    enabled: !!eventId,
  });
};

// Create event
export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (event: Omit<Event, "id" | "created_at" | "updated_at" | "artist_profiles">) => {
      const { data, error } = await supabase
        .from("events")
        .insert(event)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["artist-events"] });
      toast({
        title: "Success",
        description: "Event created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// Update event
export const useUpdateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Event> & { id: string }) => {
      const { data, error } = await supabase
        .from("events")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["artist-events"] });
      queryClient.invalidateQueries({ queryKey: ["event"] });
      toast({
        title: "Success",
        description: "Event updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// Delete event
export const useDeleteEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventId: string) => {
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", eventId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["artist-events"] });
      toast({
        title: "Success",
        description: "Event deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// Book event tickets
export const useBookEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (booking: Omit<EventBooking, "id" | "booking_date" | "created_at">) => {
      const { data, error } = await supabase
        .from("event_bookings")
        .insert(booking)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["event"] });
      queryClient.invalidateQueries({ queryKey: ["user-bookings"] });
      toast({
        title: "Success",
        description: "Tickets booked successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// Fetch user's bookings
export const useUserBookings = () => {
  return useQuery({
    queryKey: ["user-bookings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("event_bookings")
        .select(`
          *,
          events!inner(
            *,
            artist_profiles!inner(stage_name)
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

// Fetch event bookings for artist
export const useEventBookings = (eventId?: string) => {
  return useQuery({
    queryKey: ["event-bookings", eventId],
    queryFn: async () => {
      if (!eventId) return [];

      const { data, error } = await supabase
        .from("event_bookings")
        .select("*")
        .eq("event_id", eventId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as EventBooking[];
    },
    enabled: !!eventId,
  });
};
