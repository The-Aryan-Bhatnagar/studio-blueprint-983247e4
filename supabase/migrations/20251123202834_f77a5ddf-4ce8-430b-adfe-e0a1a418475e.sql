
-- Drop existing check constraint
ALTER TABLE ads DROP CONSTRAINT IF EXISTS ads_position_check;

-- Add updated check constraint with playlist position
ALTER TABLE ads ADD CONSTRAINT ads_position_check 
  CHECK (position IN ('fullscreen', 'playlist', 'sidebar', 'banner'));
