-- Add is_pinned to songs
ALTER TABLE public.songs ADD COLUMN is_pinned boolean DEFAULT false;

-- Add is_pinned to events
ALTER TABLE public.events ADD COLUMN is_pinned boolean DEFAULT false;

-- Create polls table
CREATE TABLE public.polls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  expires_at timestamp with time zone,
  is_active boolean DEFAULT true,
  artist_id uuid REFERENCES public.artist_profiles(id) ON DELETE CASCADE NOT NULL
);

-- Create poll_options table
CREATE TABLE public.poll_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id uuid REFERENCES public.polls(id) ON DELETE CASCADE NOT NULL,
  option_text text NOT NULL,
  vote_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create poll_votes table
CREATE TABLE public.poll_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id uuid REFERENCES public.polls(id) ON DELETE CASCADE NOT NULL,
  option_id uuid REFERENCES public.poll_options(id) ON DELETE CASCADE NOT NULL,
  user_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  UNIQUE(poll_id, user_id)
);

-- Add poll_id to community_posts
ALTER TABLE public.community_posts ADD COLUMN poll_id uuid REFERENCES public.polls(id) ON DELETE SET NULL;

-- Enable RLS
ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_votes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for polls
CREATE POLICY "Anyone can view polls"
  ON public.polls FOR SELECT
  USING (true);

CREATE POLICY "Artists can create their own polls"
  ON public.polls FOR INSERT
  WITH CHECK (artist_id IN (
    SELECT id FROM public.artist_profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Artists can update their own polls"
  ON public.polls FOR UPDATE
  USING (artist_id IN (
    SELECT id FROM public.artist_profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Artists can delete their own polls"
  ON public.polls FOR DELETE
  USING (artist_id IN (
    SELECT id FROM public.artist_profiles WHERE user_id = auth.uid()
  ));

-- RLS Policies for poll_options
CREATE POLICY "Anyone can view poll options"
  ON public.poll_options FOR SELECT
  USING (true);

CREATE POLICY "Artists can create poll options for their polls"
  ON public.poll_options FOR INSERT
  WITH CHECK (poll_id IN (
    SELECT p.id FROM public.polls p
    JOIN public.artist_profiles ap ON p.artist_id = ap.id
    WHERE ap.user_id = auth.uid()
  ));

-- RLS Policies for poll_votes
CREATE POLICY "Anyone can view poll votes"
  ON public.poll_votes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can vote"
  ON public.poll_votes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own votes"
  ON public.poll_votes FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger to update vote count
CREATE OR REPLACE FUNCTION update_poll_option_vote_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.poll_options
    SET vote_count = vote_count + 1
    WHERE id = NEW.option_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.poll_options
    SET vote_count = vote_count - 1
    WHERE id = OLD.option_id;
    RETURN OLD;
  END IF;
END;
$$;

CREATE TRIGGER update_vote_count_on_vote
  AFTER INSERT OR DELETE ON public.poll_votes
  FOR EACH ROW
  EXECUTE FUNCTION update_poll_option_vote_count();