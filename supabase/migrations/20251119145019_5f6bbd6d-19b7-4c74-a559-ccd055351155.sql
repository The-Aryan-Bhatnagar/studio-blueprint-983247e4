-- Allow users to assign themselves the artist role safely
CREATE POLICY "Users can assign artist role to self"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND role = 'artist'
);