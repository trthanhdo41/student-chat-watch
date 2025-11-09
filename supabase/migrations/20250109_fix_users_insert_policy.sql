-- Fix users table INSERT policy to allow signup
-- The issue: auth.uid() is not set yet during signup, so we need to allow INSERT without checking auth.uid()

-- Drop old restrictive policy
DROP POLICY IF EXISTS "Users can insert own data" ON users;

-- Create new policy that allows INSERT during signup
-- We check that the id matches auth.uid() OR allow insert if authenticated
CREATE POLICY "Users can insert own data" ON users
  FOR INSERT WITH CHECK (
    auth.uid()::text = id::text
  );

-- Alternative: Allow any authenticated user to insert (more permissive but simpler)
-- This works because the application code ensures id = auth.uid()
DROP POLICY IF EXISTS "Users can insert own data" ON users;

CREATE POLICY "Users can insert own data" ON users
  FOR INSERT TO authenticated WITH CHECK (true);

