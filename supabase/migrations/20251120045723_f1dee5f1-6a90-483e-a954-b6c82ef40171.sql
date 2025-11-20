-- Create events table
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  artist_id UUID NOT NULL REFERENCES public.artist_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT NOT NULL,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  banner_url TEXT,
  ticket_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  total_seats INTEGER NOT NULL,
  available_seats INTEGER NOT NULL,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create event bookings table
CREATE TABLE public.event_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  booking_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  number_of_tickets INTEGER NOT NULL DEFAULT 1,
  total_amount DECIMAL(10, 2) NOT NULL,
  booking_status TEXT NOT NULL DEFAULT 'confirmed',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for events
CREATE POLICY "Anyone can view published events"
  ON public.events FOR SELECT
  USING (is_published = true);

CREATE POLICY "Artists can view their own events"
  ON public.events FOR SELECT
  USING (artist_id IN (
    SELECT id FROM public.artist_profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Artists can create their own events"
  ON public.events FOR INSERT
  WITH CHECK (artist_id IN (
    SELECT id FROM public.artist_profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Artists can update their own events"
  ON public.events FOR UPDATE
  USING (artist_id IN (
    SELECT id FROM public.artist_profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Artists can delete their own events"
  ON public.events FOR DELETE
  USING (artist_id IN (
    SELECT id FROM public.artist_profiles WHERE user_id = auth.uid()
  ));

-- RLS Policies for event bookings
CREATE POLICY "Users can view their own bookings"
  ON public.event_bookings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Artists can view bookings for their events"
  ON public.event_bookings FOR SELECT
  USING (event_id IN (
    SELECT e.id FROM public.events e
    JOIN public.artist_profiles ap ON e.artist_id = ap.id
    WHERE ap.user_id = auth.uid()
  ));

CREATE POLICY "Authenticated users can book tickets"
  ON public.event_bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Function to update available seats when booking is created
CREATE OR REPLACE FUNCTION public.update_available_seats()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.events
  SET available_seats = available_seats - NEW.number_of_tickets
  WHERE id = NEW.event_id;
  RETURN NEW;
END;
$$;

-- Trigger to update available seats
CREATE TRIGGER update_seats_on_booking
  AFTER INSERT ON public.event_bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_available_seats();

-- Function to update updated_at column for events
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();