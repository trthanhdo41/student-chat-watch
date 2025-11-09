-- HƯỚNG DẪN: Copy đoạn SQL này và chạy trong Supabase Dashboard
-- Vào: https://supabase.com/dashboard/project/uevazerjmlznnotnyvcj/sql/new
-- Paste code này vào và click "Run"

-- Bước 1: Đổi bucket thành public để hiển thị ảnh
UPDATE storage.buckets 
SET public = true 
WHERE id = 'chat-images';

-- Bước 2: Kiểm tra kết quả
SELECT id, name, public FROM storage.buckets WHERE id = 'chat-images';

