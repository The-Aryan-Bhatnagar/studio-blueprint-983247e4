-- Fix search_path for handle_new_follower function
CREATE OR REPLACE FUNCTION public.handle_new_follower()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.notifications (
    user_id,
    type,
    title,
    message,
    link,
    metadata
  )
  VALUES (
    (SELECT user_id FROM public.artist_profiles WHERE id = NEW.artist_id),
    'follow',
    'New Follower',
    'You have a new follower!',
    '/artist/' || NEW.artist_id,
    jsonb_build_object(
      'artist_id', NEW.artist_id,
      'follower_id', NEW.user_id
    )
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public';