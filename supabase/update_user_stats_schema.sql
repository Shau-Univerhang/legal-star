-- Add learning stats columns to leaderboard table
ALTER TABLE public.leaderboard 
ADD COLUMN IF NOT EXISTS total_learning_hours INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS learned_cases_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS streak_days INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_learning_date DATE DEFAULT CURRENT_DATE;

-- Update sample data with some random stats
UPDATE public.leaderboard 
SET 
  total_learning_hours = floor(random() * 100 + 10)::int,
  learned_cases_count = floor(random() * 50 + 5)::int,
  streak_days = floor(random() * 30 + 1)::int
WHERE total_learning_hours IS NULL OR total_learning_hours = 0;
