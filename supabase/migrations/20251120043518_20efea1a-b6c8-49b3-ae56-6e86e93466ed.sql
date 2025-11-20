-- Add foreign key constraints for user_id columns
ALTER TABLE public.community_post_likes
  ADD CONSTRAINT community_post_likes_user_id_fkey
  FOREIGN KEY (user_id)
  REFERENCES auth.users(id)
  ON DELETE CASCADE;

ALTER TABLE public.community_post_comments
  ADD CONSTRAINT community_post_comments_user_id_fkey
  FOREIGN KEY (user_id)
  REFERENCES auth.users(id)
  ON DELETE CASCADE;

ALTER TABLE public.community_comment_likes
  ADD CONSTRAINT community_comment_likes_user_id_fkey
  FOREIGN KEY (user_id)
  REFERENCES auth.users(id)
  ON DELETE CASCADE;