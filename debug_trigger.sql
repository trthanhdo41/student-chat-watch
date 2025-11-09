-- CHẠY SQL NÀY ĐỂ DEBUG
-- Kiểm tra xem metadata có được lưu không

SELECT 
  id,
  email,
  raw_user_meta_data,
  raw_user_meta_data->>'username' as username,
  raw_user_meta_data->>'full_name' as full_name,
  raw_user_meta_data->>'parent_phone' as parent_phone,
  raw_user_meta_data->>'teacher_phone' as teacher_phone
FROM auth.users
ORDER BY created_at DESC
LIMIT 5;

