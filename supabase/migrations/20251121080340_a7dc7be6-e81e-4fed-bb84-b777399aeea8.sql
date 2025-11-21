-- Add admin policies for full platform access

-- Admin can view all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admin can view all songs
CREATE POLICY "Admins can view all songs"
ON public.songs
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admin can delete songs
CREATE POLICY "Admins can delete songs"
ON public.songs
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admin can view all events
CREATE POLICY "Admins can view all events"
ON public.events
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admin can delete events
CREATE POLICY "Admins can delete events"
ON public.events
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admin can view all playlists
CREATE POLICY "Admins can view all playlists"
ON public.playlists
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admin can delete playlists
CREATE POLICY "Admins can delete playlists"
ON public.playlists
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admin can view all song comments
CREATE POLICY "Admins can view all song comments"
ON public.song_comments
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admin can delete song comments
CREATE POLICY "Admins can delete song comments"
ON public.song_comments
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admin can view all community posts
CREATE POLICY "Admins can view all community posts"
ON public.community_posts
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admin can delete community posts
CREATE POLICY "Admins can delete community posts"
ON public.community_posts
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admin can view all artist profiles
CREATE POLICY "Admins can manage artist profiles"
ON public.artist_profiles
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admin can view all event bookings
CREATE POLICY "Admins can view all event bookings"
ON public.event_bookings
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admin can view all user follows
CREATE POLICY "Admins can view all follows"
ON public.user_follows
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admin can view all song likes
CREATE POLICY "Admins can view all song likes"
ON public.user_song_likes
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));