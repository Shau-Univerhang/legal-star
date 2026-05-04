// GET /api/cases - list cases with optional filters and pagination
import { getSupabase } from '@/lib/supabase';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const field = searchParams.get('field');
    const difficulty = searchParams.get('difficulty');
    const sort = searchParams.get('sort') || 'recommend';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const pageSize = Math.min(50, Math.max(1, parseInt(searchParams.get('pageSize') || '12', 10)));
    const keyword = searchParams.get('keyword') || searchParams.get('q') || '';

    const supabase = getSupabase();

    let query = supabase.from('cases').select('*', { count: 'exact' });

    if (field) query = query.eq('field', field);
    if (difficulty) query = query.eq('difficulty', difficulty);
    if (keyword) {
      query = query.or(`title.ilike.%${keyword}%,summary.ilike.%${keyword}%`);
    }

    if (sort === 'latest') query = query.order('created_at', { ascending: false });
    else if (sort === 'popular') query = query.order('learner_count', { ascending: false });
    else if (sort === 'difficulty') query = query.order('difficulty', { ascending: true });
    else query = query.order('created_at', { ascending: false }); // recommend default

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({
      data: data || [],
      total: count ?? 0,
      page,
      pageSize,
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}