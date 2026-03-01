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

    console.log(`Verifying OTP for ${email}...`);

    // 1. 尝试 'email' 类型 (用于登录)
    let { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email'
    });

    // 2. 如果失败，尝试 'signup' 类型 (用于新用户注册)
    if (error) {
      console.log(`Verify 'email' failed: ${error.message}. Retrying as 'signup'...`);
      const signupRetry = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'signup'
      });
      
      if (!signupRetry.error) {
        console.log("Verify 'signup' successful");
        data = signupRetry.data;
        error = null;
      } else {
        console.log(`Verify 'signup' failed: ${signupRetry.error.message}`);
      }
    }

    // 3. 如果仍失败，尝试 'recovery' 类型 (用于密码重置流程，虽然这里是登录，但防万一)
    if (error) {
      console.log(`Retrying as 'recovery'...`);
      const recoveryRetry = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'recovery'
      });
      
      if (!recoveryRetry.error) {
        console.log("Verify 'recovery' successful");
        data = recoveryRetry.data;
        error = null;
      } else {
        console.log(`Verify 'recovery' failed: ${recoveryRetry.error.message}`);
      }
    }

    if (error) {
      console.error('All verification attempts failed');
      return Response.json({ error: error.message }, { status: 400 });
    }

    console.log('Verification successful');
    return Response.json({ message: 'Verified', user: data.user, session: data.session });
  } catch (err) {
    console.error('Verify API error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
