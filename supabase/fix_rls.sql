-- Fix RLS policy for leaderboard table
-- Issue: Table public.leaderboard has an RLS policy "Allow insert leaderboard" for INSERT that allows unrestricted access.
-- Solution: Drop the insecure policy and create a strict one that only allows users to insert their own data.

-- 1. Drop the insecure policy if it exists
DROP POLICY IF EXISTS "Allow insert leaderboard" ON public.leaderboard;

-- 2. Create a secure policy for INSERT
-- This ensures that a user can only insert a row where the user_id matches their own auth.uid()
CREATE POLICY "Allow authenticated insert own leaderboard" ON public.leaderboard 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid()::text = user_id);

-- 3. Create a secure policy for UPDATE (optional but recommended)
CREATE POLICY "Allow authenticated update own leaderboard" ON public.leaderboard 
FOR UPDATE
TO authenticated
USING (auth.uid()::text = user_id)
WITH CHECK (auth.uid()::text = user_id);
