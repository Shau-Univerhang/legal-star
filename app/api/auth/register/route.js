import { getSupabase } from '@/lib/supabase';
import { createClient } from '@supabase/supabase-js';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, username, code } = body;

    if (!email || !password || !code) {
      return Response.json({ error: 'Email, password and verification code are required' }, { status: 400 });
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

    // 1. Verify OTP first to get a session
    const { data: verifyData, error: verifyError } = await supabaseAuth.auth.verifyOtp({
      email,
      token: code,
      type: 'email'
    });

    if (verifyError) {
      return Response.json({ error: verifyError.message }, { status: 400 });
    }

    if (!verifyData.session) {
      return Response.json({ error: 'Failed to verify code' }, { status: 400 });
    }

    // 2. Update user password using the session
    const { data: updateData, error: updateError } = await supabaseAuth.auth.updateUser({
      password: password,
      data: {
        username: username || email.split('@')[0]
      }
    });

    if (updateError) {
      return Response.json({ error: updateError.message }, { status: 400 });
    }

    // 3. Create leaderboard entry
    const user = updateData.user;
    if (user) {
        const supabase = getSupabase();
        const { error: dbError } = await supabase
            .from('leaderboard')
            .insert([
                {
                    user_id: user.id,
                    username: username || email.split('@')[0],
                    avatar_url: 'https://ui-avatars.com/api/?name=' + (username || email.split('@')[0]),
                    score: 0,
                    level: 1,
                    rank_title: '新手'
                }
            ]);
        
        // Ignore duplicate key error
        if (dbError && dbError.code !== '23505') {
            console.error('Failed to create leaderboard entry:', dbError);
        }
    }

    return Response.json({ 
      message: 'Registration successful', 
      user: user,
      session: verifyData.session,
      requireConfirmation: false 
    });

  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
