-- Enable RLS for users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert new users (for registration)
CREATE POLICY "Allow public insert users"
ON users FOR INSERT
TO anon
WITH CHECK (true);

-- Allow users to read their own data
CREATE POLICY "Allow users to read own data"
ON users FOR SELECT
TO anon
USING (true);

-- Enable RLS for user_sessions table
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert sessions (for login)
CREATE POLICY "Allow public insert sessions"
ON user_sessions FOR INSERT
TO anon
WITH CHECK (true);

-- Allow anyone to read sessions (for auth check)
CREATE POLICY "Allow public read sessions"
ON user_sessions FOR SELECT
TO anon
USING (true);

