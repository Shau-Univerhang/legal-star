import { createClient } from '@supabase/supabase-js';

export async function POST(request) {
  try {
    const { email, token } = await request.json();
    if (!email || !token) {
      return Response.json({ error: 'Email and token required' }, { status: 400 });
    }
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email'
    });
    if (error) {
      return Response.json({ error: error.message }, { status: 400 });
    }
    return Response.json({ message: 'Verified', user: data.user, session: data.session });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
