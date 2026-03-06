import { createClient } from '@supabase/supabase-js';

// Helper to get the last part of the URL path
function getIdFromUrl(url) {
    try {
        const path = new URL(url).pathname;
        const segments = path.split('/').filter(Boolean);
        return segments.pop();
    } catch (e) {
        return null;
    }
}

export async function GET(request) {
  try {
    const id = getIdFromUrl(request.url);

    if (!id) {
      return new Response(JSON.stringify({ error: 'Case ID or slug is required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    const columnToQuery = isUuid ? 'id' : 'slug';

    const { data: caseRow, error } = await supabase
      .from('cases')
      .select('*')
      .eq(columnToQuery, id)
      .single();

    if (error || !caseRow) {
      return new Response(JSON.stringify({ error: error?.message || 'Case not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { data: videos } = await supabase
      .from('videos')
      .select('*')
      .eq('case_id', caseRow.id)
      .order('sort_order', { ascending: true });

    const responseData = { ...caseRow, videos: videos || [] };

    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
