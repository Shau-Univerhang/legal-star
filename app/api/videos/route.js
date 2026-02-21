// GET /api/videos - list videos, optional ?caseId= for case-specific videos
import { getSupabase } from '@/lib/supabase';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const caseId = searchParams.get('caseId');
    const supabase = getSupabase();

    let query = supabase
      .from('videos')
      .select('*')
      .order('sort_order', { ascending: true });

    if (caseId) {
      // Resolve case slug to id if needed
      const { data: caseRow } = await supabase
        .from('cases')
        .select('id')
        .or(`id.eq.${caseId},slug.eq.${caseId}`)
        .single();
      if (caseRow) query = query.eq('case_id', caseRow.id);
    }

    const { data, error } = await query;

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }
    return Response.json(data || []);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
