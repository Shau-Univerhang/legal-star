// GET /api/cases/[id] - get single case by id or slug
import { getSupabase } from '@/lib/supabase';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const supabase = getSupabase();

    let query = supabase.from('cases').select('*');
    
    if (id.includes('-')) {
      query = query.eq('slug', id);
    } else {
      query = query.eq('id', id);
    }

    const { data, error } = await query.single();

    if (error) {
      if (error.code === 'PGRST116') {
        return Response.json({ error: 'Case not found' }, { status: 404 });
      }
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json(data);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}