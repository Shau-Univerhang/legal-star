import { createClient } from '@supabase/supabase-js';

export async function POST(request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return Response.json({ error: 'Email required' }, { status: 400 });
    }

    // Use service role key to send OTP if available, otherwise fallback to anon key
    // Service role bypasses RLS and sometimes has better rate limits/permissions
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      key,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    console.log(`Sending OTP to ${email} using key starting with ${key.substring(0, 5)}...`);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true }
    });

    if (error) {
      console.error('Supabase OTP error:', error);
      return Response.json({ error: error.message }, { status: 400 });
    }
    
    return Response.json({ message: 'Code sent' });
  } catch (err) {
    console.error('Send code API error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
