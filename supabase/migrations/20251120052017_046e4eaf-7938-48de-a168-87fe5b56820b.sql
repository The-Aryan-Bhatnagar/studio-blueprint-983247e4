-- Add parent_comment_id to community_post_comments for threading
ALTER TABLE community_post_comments 
ADD COLUMN parent_comment_id uuid REFERENCES community_post_comments(id) ON DELETE CASCADE;

-- Add index for better query performance
CREATE INDEX idx_community_post_comments_parent_comment_id ON community_post_comments(parent_comment_id);