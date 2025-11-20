-- Add user email column to event_bookings for better customer tracking
ALTER TABLE public.event_bookings 
ADD COLUMN user_email TEXT;

-- Add user phone to event_bookings
ALTER TABLE public.event_bookings 
ADD COLUMN user_phone TEXT;

-- Add user name to event_bookings
ALTER TABLE public.event_bookings 
ADD COLUMN user_name TEXT;