-- Custom Auth: Bỏ Supabase Auth, dùng username + password hash
-- Không cần email, không cần xác nhận email

-- Bước 1: Thêm cột password_hash vào bảng users
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- Bước 2: Xóa trigger cũ (không cần nữa vì không dùng auth.users)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Bước 3: Sửa RLS policies - cho phép đăng ký mới
DROP POLICY IF EXISTS "Service role can insert users" ON users;
DROP POLICY IF EXISTS "Users can insert own data" ON users;

-- Cho phép INSERT khi chưa đăng nhập (để đăng ký)
CREATE POLICY "Allow public signup" ON users
  FOR INSERT WITH CHECK (true);

-- Bước 4: Tạo bảng sessions để lưu JWT
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS cho sessions
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sessions" ON user_sessions
  FOR SELECT USING (user_id IN (
    SELECT id FROM users WHERE id::text = current_setting('request.jwt.claims', true)::json->>'user_id'
  ));

CREATE POLICY "Users can insert own sessions" ON user_sessions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can delete own sessions" ON user_sessions
  FOR DELETE USING (user_id IN (
    SELECT id FROM users WHERE id::text = current_setting('request.jwt.claims', true)::json->>'user_id'
  ));

