-- Add tracking columns to ads table
ALTER TABLE public.ads 
ADD COLUMN IF NOT EXISTS total_impressions integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_clicks integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS mobile_views integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS web_views integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS tablet_views integer DEFAULT 0;

-- Create ad_analytics table for detailed tracking
CREATE TABLE IF NOT EXISTS public.ad_analytics (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ad_id uuid NOT NULL REFERENCES public.ads(id) ON DELETE CASCADE,
  event_type text NOT NULL, -- 'view' or 'click'
  device_type text, -- 'mobile', 'tablet', 'desktop'
  user_id uuid,
  ip_address text,
  user_agent text,
  referrer text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on ad_analytics
ALTER TABLE public.ad_analytics ENABLE ROW LEVEL SECURITY;

-- Policy to allow inserting analytics (anyone can track)
CREATE POLICY "Anyone can insert ad analytics"
ON public.ad_analytics
FOR INSERT
WITH CHECK (true);

-- Policy for admins to view all analytics
CREATE POLICY "Admins can view all ad analytics"
ON public.ad_analytics
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Enable realtime for ads table
ALTER PUBLICATION supabase_realtime ADD TABLE public.ads;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ad_analytics;

-- Create function to increment ad stats
CREATE OR REPLACE FUNCTION public.increment_ad_stats()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.event_type = 'view' THEN
    UPDATE public.ads
    SET total_impressions = total_impressions + 1,
        mobile_views = CASE WHEN NEW.device_type = 'mobile' THEN mobile_views + 1 ELSE mobile_views END,
        web_views = CASE WHEN NEW.device_type = 'desktop' THEN web_views + 1 ELSE web_views END,
        tablet_views = CASE WHEN NEW.device_type = 'tablet' THEN tablet_views + 1 ELSE tablet_views END
    WHERE id = NEW.ad_id;
  ELSIF NEW.event_type = 'click' THEN
    UPDATE public.ads
    SET total_clicks = total_clicks + 1
    WHERE id = NEW.ad_id;
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger for auto-updating ad stats
CREATE TRIGGER on_ad_analytics_insert
  AFTER INSERT ON public.ad_analytics
  FOR EACH ROW
  EXECUTE FUNCTION public.increment_ad_stats();