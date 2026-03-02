-- Table for Daily Learning content (Douyin video + Countermeasures)
CREATE TABLE IF NOT EXISTS public.daily_learning (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  video_url TEXT NOT NULL, -- Embed URL for Douyin or other video
  risk_point TEXT,         -- 1. 识别风险
  legal_basis TEXT,        -- 2. 法律依据
  practical_advice TEXT,   -- 3. 实操建议
  display_date DATE DEFAULT CURRENT_DATE, -- Optional: to schedule content
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for ordering
CREATE INDEX IF NOT EXISTS idx_daily_learning_created_at ON public.daily_learning(created_at DESC);

-- RLS
ALTER TABLE public.daily_learning ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read daily_learning" ON public.daily_learning FOR SELECT USING (true);

-- Sample Data
INSERT INTO public.daily_learning (title, video_url, risk_point, legal_basis, practical_advice) 
VALUES 
(
  '职场“试用期”陷阱，你中招了吗？', 
  'https://player.bilibili.com/player.html?bvid=BV1uT4y1P7CX&page=1&high_quality=1&danmaku=0', 
  '许多公司承诺“转正后补交社保”或“试用期工资打八折”，这些都是常见的违法行为。', 
  '《劳动合同法》第十九条规定：试用期包含在劳动合同期限内。劳动者在试用期的工资不得低于本单位相同岗位最低档工资或者劳动合同约定工资的80%，并不得低于用人单位所在地的最低工资标准。', 
  '入职前确认Offer条款，保留聊天记录和录音。如遇违法辞退或克扣工资，可向当地劳动监察大队投诉或申请劳动仲裁。'
);
