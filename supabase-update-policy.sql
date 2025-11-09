-- Disable RLS for simplicity (since we're using custom auth)
-- In production, you should implement proper RLS policies
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE chat_uploads DISABLE ROW LEVEL SECURITY;
ALTER TABLE ai_analysis DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions DISABLE ROW LEVEL SECURITY;

