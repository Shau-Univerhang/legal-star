// GET /api/daily-learning - get the latest daily learning content
import { getSupabase } from '@/lib/supabase';

// 强制动态渲染，避免 Vercel 缓存旧数据
export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const supabase = getSupabase();

    // 显式指定字段，确保获取到 thumbnail_url
    const { data, error } = await supabase
      .from('daily_learning')
      .select('id, title, video_url, thumbnail_url, risk_point, legal_basis, practical_advice, created_at')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      if (error.code === 'PGRST116') { // No rows found
        return Response.json(null);
      }
      return Response.json({ error: error.message }, { status: 500 });
    }

    console.log('Daily learning data fetched:', data);
    return Response.json(data);
  } catch (err) {
    console.error('Server error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
