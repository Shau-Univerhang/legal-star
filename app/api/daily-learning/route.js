import { getSupabase } from '@/lib/supabase';

export async function GET(request) {
  try {
    const supabase = getSupabase();

    const { data: cases, error: casesError } = await supabase
      .from('cases')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(3);

    const { data: videos, error: videosError } = await supabase
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (casesError || videosError) {
      return Response.json({ error: 'Failed to fetch daily learning content' }, { status: 500 });
    }

    return Response.json({
      cases: cases || [],
      videos: videos || [],
      date: new Date().toISOString().split('T')[0]
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}