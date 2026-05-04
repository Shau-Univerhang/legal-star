import { createClient } from '@supabase/supabase-js';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, token } = body;

    if (!email || !token) {
      return Response.json({ error: 'Email and verification code are required' }, { status: 400 });
    }

    const supabaseAuth = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    const { data, error } = await supabaseAuth.auth.verifyOtp({
      email,
      token,
      type: 'recovery'
    });

    if (error) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    return Response.json({ 
      message: 'Verification successful', 
      user: data.user,
      session: data.session 
    });

  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}