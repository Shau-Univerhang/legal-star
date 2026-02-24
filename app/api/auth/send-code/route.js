import { createClient } from '@supabase/supabase-js';

export async function POST(request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return Response.json({ error: 'Email required' }, { status: 400 });
    }
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true }
    });
    if (error) {
      return Response.json({ error: error.message }, { status: 400 });
    }
    return Response.json({ message: 'Code sent' });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
