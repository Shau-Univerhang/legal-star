-- Supabase schema for bird (legal learning platform)
-- Run this in Supabase SQL Editor to create tables (order: cases first, then videos with FK)

-- Cases table: case studies for the case library
CREATE TABLE IF NOT EXISTS public.cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE,
  title TEXT NOT NULL,
  summary TEXT,
  description TEXT,
  field TEXT,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'expert')),
  tags TEXT[] DEFAULT '{}',
  learner_count INTEGER DEFAULT 0,
  estimated_minutes INTEGER DEFAULT 30,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Videos table: video URLs and metadata for case/learning materials
CREATE TABLE IF NOT EXISTS public.videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration_seconds INTEGER DEFAULT 0,
  case_id UUID REFERENCES public.cases(id) ON DELETE SET NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Leaderboard table: users ranked by score (descending)
CREATE TABLE IF NOT EXISTS public.leaderboard (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  username TEXT NOT NULL,
  avatar_url TEXT,
  score INTEGER NOT NULL DEFAULT 0,
  rank_title TEXT,
  level INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

-- Index for leaderboard ranking (score desc)
CREATE INDEX IF NOT EXISTS idx_leaderboard_score ON public.leaderboard(score DESC);

-- Index for cases list/filter
CREATE INDEX IF NOT EXISTS idx_cases_field ON public.cases(field);
CREATE INDEX IF NOT EXISTS idx_cases_difficulty ON public.cases(difficulty);
CREATE INDEX IF NOT EXISTS idx_cases_created_at ON public.cases(created_at DESC);

-- Enable RLS (optional; use service role key in API to bypass)
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;

-- Allow public read for anonymous access (adjust as needed for auth)
CREATE POLICY "Allow public read videos" ON public.videos FOR SELECT USING (true);
CREATE POLICY "Allow public read cases" ON public.cases FOR SELECT USING (true);
CREATE POLICY "Allow public read leaderboard" ON public.leaderboard FOR SELECT USING (true);

-- Seed sample data (optional): run after tables exist
-- Cases: use slug column for frontend mapping (case-001, case-002) or use id in API
-- INSERT INTO public.cases (title, summary, field, difficulty, tags, learner_count, estimated_minutes, description) VALUES
--   ('Labor Contract Dispute', 'How to protect workers'' rights when company terminates contract illegally', 'labor', 'intermediate', ARRAY['workplace'], 12000, 30, 'Case background and legal analysis...'),
--   ('Divorce Property Division', 'Principles of property division in divorce', 'marriage', 'beginner', ARRAY['family'], 8500, 25, 'Case content...'),
--   ('Online Shopping Quality Issue', 'How to request refund for defective goods', 'consumer', 'beginner', ARRAY['consumer'], 153000, 20, 'Case content...');

-- INSERT INTO public.leaderboard (user_id, username, avatar_url, score, rank_title, level) VALUES
--   ('user1', 'Legal Master', 'https://s.coze.cn/image/2Zx_8LdMfj4/', 5890, 'Legal Master', 10),
--   ('user2', 'Legal Expert', 'https://s.coze.cn/image/Z4Vg82Yo0v0/', 4650, 'Legal Expert', 9);

-- INSERT INTO public.videos (title, description, video_url, sort_order) VALUES
--   ('Scenario: Labor contract dispute', 'Watch the scenario reenactment', 'https://example.com/video1.mp4', 0);
