// GET /api/daily-learning - get the latest daily learning content
import { getSupabase } from '@/lib/supabase';

export async function GET(request) {
  try {
    const supabase = getSupabase();

    // Fetch the most recent entry
    const { data, error } = await supabase
      .from('daily_learning')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // No rows found
        return Response.json(null);
      }
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json(data);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
