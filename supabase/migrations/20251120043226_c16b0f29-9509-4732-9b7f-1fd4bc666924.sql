-- Create community_posts table
CREATE TABLE public.community_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  artist_id UUID NOT NULL REFERENCES public.artist_profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  media_url TEXT,
  media_type TEXT CHECK (media_type IN ('image', 'video')),
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create community_post_likes table
CREATE TABLE public.community_post_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(post_id, user_id)
);

-- Create community_post_comments table
CREATE TABLE public.community_post_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create community_comment_likes table
CREATE TABLE public.community_comment_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  comment_id UUID NOT NULL REFERENCES public.community_post_comments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(comment_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_comment_likes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for community_posts
CREATE POLICY "Anyone can view posts"
  ON public.community_posts FOR SELECT
  USING (true);

CREATE POLICY "Artists can create their own posts"
  ON public.community_posts FOR INSERT
  WITH CHECK (
    artist_id IN (
      SELECT id FROM public.artist_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Artists can update their own posts"
  ON public.community_posts FOR UPDATE
  USING (
    artist_id IN (
      SELECT id FROM public.artist_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Artists can delete their own posts"
  ON public.community_posts FOR DELETE
  USING (
    artist_id IN (
      SELECT id FROM public.artist_profiles WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for community_post_likes
CREATE POLICY "Anyone can view likes"
  ON public.community_post_likes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can like posts"
  ON public.community_post_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike their own likes"
  ON public.community_post_likes FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for community_post_comments
CREATE POLICY "Anyone can view comments"
  ON public.community_post_comments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create comments"
  ON public.community_post_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
  ON public.community_post_comments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON public.community_post_comments FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for community_comment_likes
CREATE POLICY "Anyone can view comment likes"
  ON public.community_comment_likes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can like comments"
  ON public.community_comment_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike their own comment likes"
  ON public.community_comment_likes FOR DELETE
  USING (auth.uid() = user_id);

-- Create storage bucket for community media
INSERT INTO storage.buckets (id, name, public) 
VALUES ('community-media', 'community-media', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for community media
CREATE POLICY "Anyone can view community media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'community-media');

CREATE POLICY "Artists can upload community media"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'community-media' AND
    auth.uid() IN (SELECT user_id FROM public.artist_profiles)
  );

CREATE POLICY "Artists can update their own media"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'community-media' AND
    auth.uid() IN (SELECT user_id FROM public.artist_profiles)
  );

CREATE POLICY "Artists can delete their own media"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'community-media' AND
    auth.uid() IN (SELECT user_id FROM public.artist_profiles)
  );

-- Create triggers for updated_at
CREATE TRIGGER update_community_posts_updated_at
  BEFORE UPDATE ON public.community_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_community_post_comments_updated_at
  BEFORE UPDATE ON public.community_post_comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();