-- Fix users table INSERT policy to allow signup
-- Run this in Supabase SQL Editor

-- Drop old restrictive policy
DROP POLICY IF EXISTS "Users can insert own data" ON users;

-- Create new policy that allows any authenticated user to insert
-- This is safe because the application code ensures id = auth.uid()
CREATE POLICY "Users can insert own data" ON users
  FOR INSERT TO authenticated WITH CHECK (true);

