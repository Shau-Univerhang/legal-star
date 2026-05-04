import { getSupabase } from '@/lib/supabase';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return Response.json({ error: 'userId is required' }, { status: 400 });
    }

    const supabase = getSupabase();

    const { data: stats, error } = await supabase
      .from('leaderboard')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return Response.json({ 
          userId,
          learningHours: 0,
          completedCases: 0,
          score: 0,
          level: 1,
          rankTitle: '新手'
        });
      }
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({
      userId,
      learningHours: Math.floor(stats.score / 100),
      completedCases: Math.floor(stats.score / 50),
      score: stats.score,
      level: stats.level || 1,
      rankTitle: stats.rank_title || '学习者'
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}