-- Add thumbnail_url to daily_learning table
ALTER TABLE public.daily_learning 
ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;

-- Update existing sample data with a cover image (using a generic one or Bilibili cover)
UPDATE public.daily_learning 
SET thumbnail_url = 'https://i0.hdslb.com/bfs/archive/c44439f0322588383e2079080531536979667793.jpg' -- Example cover
WHERE video_url LIKE '%bilibili%';
