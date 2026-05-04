-- Add new columns to leaderboard table for different ranking types
ALTER TABLE public.leaderboard 
ADD COLUMN IF NOT EXISTS study_hours INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS accuracy DECIMAL(5,2) DEFAULT 0.00;

-- Create indexes for the new columns to speed up sorting
CREATE INDEX IF NOT EXISTS idx_leaderboard_study_hours ON public.leaderboard(study_hours DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_accuracy ON public.leaderboard(accuracy DESC);

-- Update sample data (optional, for testing)
-- UPDATE public.leaderboard SET study_hours = FLOOR(RANDOM() * 500), accuracy = FLOOR(RANDOM() * 20 + 80) WHERE study_hours = 0;
