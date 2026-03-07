// GET /api/daily-case - get a case of the day, trying not to repeat.
import { createClient } from '@supabase/supabase-js';

export async function GET(request) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // 1. Get the total count of cases
    const { count, error: countError } = await supabase
      .from('cases')
      .select('', { count: 'exact', head: true });

    if (countError || count === null) {
      throw new Error(countError?.message || 'Could not count cases');
    }

    if (count === 0) {
        return new Response(JSON.stringify({ error: 'No cases available' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    // 2. Use today's date as a seed to get a daily index
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const dailyIndex = dayOfYear % count;

    // 3. Fetch the case at that specific index
    const { data, error } = await supabase
      .from('cases')
      .select('*')
      .order('created_at', { ascending: true }) // Order consistently
      .range(dailyIndex, dailyIndex)
      .single();

    if (error || !data) {
      return new Response(JSON.stringify({ error: error?.message || 'Case not found for today' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(data), {
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
