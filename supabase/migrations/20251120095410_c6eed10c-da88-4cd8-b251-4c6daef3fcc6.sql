-- Add city and country to profiles table
ALTER TABLE public.profiles 
ADD COLUMN city TEXT,
ADD COLUMN country TEXT;

-- Update the handle_new_user_profile function to include city and country
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Only create profile if email is confirmed or if using phone auth
  IF NEW.email_confirmed_at IS NOT NULL OR NEW.phone IS NOT NULL THEN
    -- Skip profile creation for artists (they have stage_name in metadata)
    -- Artist profiles are created separately after verification
    IF NEW.raw_user_meta_data->>'stage_name' IS NULL THEN
      INSERT INTO public.profiles (user_id, full_name, phone_number, city, country)
      VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'phone_number', ''),
        COALESCE(NEW.raw_user_meta_data->>'city', ''),
        COALESCE(NEW.raw_user_meta_data->>'country', '')
      )
      ON CONFLICT (user_id) DO NOTHING;
    END IF;
  END IF;
  RETURN NEW;
END;
$function$;