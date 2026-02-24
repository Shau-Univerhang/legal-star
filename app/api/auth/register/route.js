import { getSupabase } from '@/lib/supabase';
import { createClient } from '@supabase/supabase-js';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, username } = body;

    if (!email || !password) {
      return Response.json({ error: 'Email and password are required' }, { status: 400 });
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

    // Sign up with Supabase Auth
    const { data, error } = await supabaseAuth.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username || email.split('@')[0],
        },
      },
    });

    if (error) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    // Auto-confirm user email using Service Role Key (if available)
    // This allows skipping email verification during development
    let session = data.session;
    if (!session && data.user && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const supabaseAdmin = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.SUPABASE_SERVICE_ROLE_KEY,
          {
            auth: {
              autoRefreshToken: false,
              persistSession: false
            }
          }
        );
        
        // Manually confirm the user's email
        const { data: userData, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
          data.user.id,
          { email_confirm: true }
        );

        if (!updateError) {
           // If confirmed, try to sign in to get a session immediately (simulating auto-login)
           const { data: signInData } = await supabaseAuth.auth.signInWithPassword({
             email,
             password
           });
           session = signInData.session;
        }
      } catch (adminErr) {
        console.error('Failed to auto-confirm user:', adminErr);
      }
    }

    // Check if email confirmation is required (and not auto-confirmed)
    const isConfirmed = session !== null;

    // Create a user entry in the leaderboard table for this new user
    if (data.user) {
        const supabase = getSupabase();
        const { error: dbError } = await supabase
            .from('leaderboard')
            .insert([
                {
                    user_id: data.user.id,
                    username: username || email.split('@')[0],
                    avatar_url: 'https://ui-avatars.com/api/?name=' + (username || email.split('@')[0]),
                    score: 0,
                    level: 1,
                    rank_title: '新手'
                }
            ]);
        
        // Ignore duplicate key error (if user already exists in leaderboard for some reason)
        if (dbError && dbError.code !== '23505') {
            console.error('Failed to create leaderboard entry:', dbError);
        }
    }

    return Response.json({ 
      message: 'Registration successful', 
      user: data.user,
      session: session,
      requireConfirmation: !isConfirmed 
    });

  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
