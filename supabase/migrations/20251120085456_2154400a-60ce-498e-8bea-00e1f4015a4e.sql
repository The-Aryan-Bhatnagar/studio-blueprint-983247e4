-- Create community post analytics table
CREATE TABLE IF NOT EXISTS public.community_post_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  total_views INTEGER DEFAULT 0,
  total_likes INTEGER DEFAULT 0,
  total_comments INTEGER DEFAULT 0,
  views_last_7_days INTEGER DEFAULT 0,
  views_last_30_days INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(post_id)
);

-- Enable RLS
ALTER TABLE public.community_post_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for community_post_analytics
CREATE POLICY "Anyone can view post analytics"
  ON public.community_post_analytics
  FOR SELECT
  USING (true);

CREATE POLICY "Artists can view analytics for their posts"
  ON public.community_post_analytics
  FOR SELECT
  USING (
    post_id IN (
      SELECT cp.id 
      FROM community_posts cp
      JOIN artist_profiles ap ON cp.artist_id = ap.id
      WHERE ap.user_id = auth.uid()
    )
  );

-- Create trigger to auto-create analytics when post is created
CREATE OR REPLACE FUNCTION public.create_post_analytics()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.community_post_analytics (post_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$;

CREATE TRIGGER create_post_analytics_trigger
  AFTER INSERT ON public.community_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.create_post_analytics();

-- Update likes count trigger
CREATE OR REPLACE FUNCTION public.update_post_likes_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.community_post_analytics
    SET total_likes = total_likes + 1
    WHERE post_id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.community_post_analytics
    SET total_likes = total_likes - 1
    WHERE post_id = OLD.post_id;
    RETURN OLD;
  END IF;
END;
$$;

CREATE TRIGGER update_post_likes_count_trigger
  AFTER INSERT OR DELETE ON public.community_post_likes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_post_likes_count();

-- Update comments count trigger
CREATE OR REPLACE FUNCTION public.update_post_comments_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.community_post_analytics
    SET total_comments = total_comments + 1
    WHERE post_id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.community_post_analytics
    SET total_comments = total_comments - 1
    WHERE post_id = OLD.post_id;
    RETURN OLD;
  END IF;
END;
$$;

CREATE TRIGGER update_post_comments_count_trigger
  AFTER INSERT OR DELETE ON public.community_post_comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_post_comments_count();

-- Add updated_at trigger
CREATE TRIGGER update_community_post_analytics_updated_at
  BEFORE UPDATE ON public.community_post_analytics
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add is_featured column to events table
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- Add is_popular column to community_posts table
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS is_popular BOOLEAN DEFAULT false;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_community_post_analytics_post_id ON public.community_post_analytics(post_id);
CREATE INDEX IF NOT EXISTS idx_events_is_featured ON public.events(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_community_posts_is_popular ON public.community_posts(is_popular) WHERE is_popular = true;
CREATE INDEX IF NOT EXISTS idx_community_posts_is_pinned ON public.community_posts(is_pinned) WHERE is_pinned = true;