-- ============================================
-- CHẠY SQL NÀY TRONG SUPABASE DASHBOARD
-- ============================================
-- Vào: https://supabase.com/dashboard/project/uevazerjmlznnotnyvcj/sql/new
-- Copy toàn bộ SQL dưới đây và click RUN

-- 1. Tắt RLS để app hoạt động bình thường
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE chat_uploads DISABLE ROW LEVEL SECURITY;
ALTER TABLE ai_analysis DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions DISABLE ROW LEVEL SECURITY;

-- 2. Xóa constraint cũ (nếu có)
ALTER TABLE chat_uploads DROP CONSTRAINT IF EXISTS chat_uploads_status_check;

-- 3. Thêm constraint mới với đầy đủ status
ALTER TABLE chat_uploads ADD CONSTRAINT chat_uploads_status_check
CHECK (status IN ('pending', 'processing', 'analyzing', 'analyzed', 'completed', 'error'));

-- Xong! Bây giờ test app

