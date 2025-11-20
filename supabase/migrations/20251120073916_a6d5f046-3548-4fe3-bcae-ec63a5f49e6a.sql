-- Add name_color_theme field to artist_profiles
ALTER TABLE public.artist_profiles 
ADD COLUMN name_color_theme TEXT DEFAULT 'white' CHECK (name_color_theme IN ('white', 'gold', 'neon', 'gradient'));

-- Add comment for documentation
COMMENT ON COLUMN public.artist_profiles.name_color_theme IS 'Color theme for artist name display in header: white, gold, neon, or gradient';