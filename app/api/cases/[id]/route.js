// GET /api/cases/[id] - get single case by id or slug
import { getSupabase } from '@/lib/supabase';

export async function GET(request, { params }) {
  try {
    const id = params.id;
    if (!id) {
      return Response.json({ error: 'Case id or slug required' }, { status: 400 });
    }

    const supabase = getSupabase();

    // Support both UUID and slug (e.g. case-001)
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    const { data: caseRow, error } = await supabase
      .from('cases')
      .select('*')
      .or(isUuid ? `id.eq.${id}` : `slug.eq.${id}`)
      .single();

    if (error || !caseRow) {
      return Response.json({ error: error?.message || 'Case not found' }, { status: 404 });
    }

    // Optionally attach videos for this case
    const { data: videos } = await supabase
      .from('videos')
      .select('*')
      .eq('case_id', caseRow.id)
      .order('sort_order', { ascending: true });

    return Response.json({ ...caseRow, videos: videos || [] });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
