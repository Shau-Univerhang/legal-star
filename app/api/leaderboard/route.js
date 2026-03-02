// GET /api/leaderboard - list users ranked by score/time/accuracy descending
import { getSupabase } from '@/lib/supabase';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '50', 10)));
    const offset = Math.max(0, parseInt(searchParams.get('offset') || '0', 10));
    const sort = searchParams.get('sort') || 'score'; // 'score', 'time', 'accuracy'

    const supabase = getSupabase();

    let query = supabase.from('leaderboard').select('*');

    if (sort === 'time') {
      query = query.order('study_hours', { ascending: false });
    } else if (sort === 'accuracy') {
      query = query.order('accuracy', { ascending: false });
    } else {
      query = query.order('score', { ascending: false });
    }

    const { data, error } = await query.range(offset, offset + limit - 1);

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    // Add rank (1-based) to each row
    const withRank = (data || []).map((row, i) => ({
      ...row,
      rank: offset + i + 1,
    }));

    return Response.json(withRank);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
