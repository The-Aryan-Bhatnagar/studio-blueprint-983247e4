-- Add parent_comment_id to song_comments for threading
ALTER TABLE song_comments 
ADD COLUMN parent_comment_id uuid REFERENCES song_comments(id) ON DELETE CASCADE;

-- Add index for better query performance
CREATE INDEX idx_song_comments_parent_comment_id ON song_comments(parent_comment_id);