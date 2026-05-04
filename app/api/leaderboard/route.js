import { getSupabase } from '@/lib/supabase';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(50, parseInt(searchParams.get('limit') || '20', 10));
    const offset = Math.max(0, parseInt(searchParams.get('offset') || '0', 10));
    const sort = searchParams.get('sort') || 'score';

    const supabase = getSupabase();

    let query = supabase.from('leaderboard').select('*');

    if (sort === 'score') query = query.order('score', { ascending: false });
    else if (sort === 'updated') query = query.order('updated_at', { ascending: false });

    query = query.range(offset, offset + limit - 1);

    const { data, error } = await query;

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json(data || []);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}