-- XÓA TOÀN BỘ DỮ LIỆU TRONG CÁC BẢNG
-- Chạy script này trong Supabase SQL Editor để reset database

-- Xóa dữ liệu theo thứ tự (tránh lỗi foreign key)
DELETE FROM ai_analysis;
DELETE FROM chat_uploads;
DELETE FROM users;

-- Xóa toàn bộ file trong storage bucket
-- (Phải làm thủ công trong Storage UI hoặc dùng API)

-- Kiểm tra kết quả
SELECT 'ai_analysis' as table_name, COUNT(*) as count FROM ai_analysis
UNION ALL
SELECT 'chat_uploads', COUNT(*) FROM chat_uploads
UNION ALL
SELECT 'users', COUNT(*) FROM users;

