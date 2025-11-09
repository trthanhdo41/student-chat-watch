-- CHẠY SQL NÀY TRONG SUPABASE SQL EDITOR
-- https://supabase.com/dashboard/project/uevazerjmlznnotnyvcj/sql/new

-- Bước 1: Kiểm tra xem có user nào trong auth.users không
SELECT id, email, raw_user_meta_data FROM auth.users;

-- Bước 2: Kiểm tra xem có user nào trong public.users không
SELECT * FROM public.users;

-- Bước 3: Tạo function để tự động tạo user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, username, full_name, parent_phone, teacher_phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || NEW.id),
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Unknown'),
    COALESCE(NEW.raw_user_meta_data->>'parent_phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'teacher_phone', '')
  );
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    RAISE LOG 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Bước 4: Xóa trigger cũ nếu có
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Bước 5: Tạo trigger mới
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();

-- Bước 6: Test trigger bằng cách tạo user profile cho user đã tồn tại
-- (Chỉ chạy nếu có user trong auth.users nhưng không có trong public.users)
INSERT INTO public.users (id, username, full_name, parent_phone, teacher_phone)
SELECT 
  id,
  COALESCE(raw_user_meta_data->>'username', 'user_' || id),
  COALESCE(raw_user_meta_data->>'full_name', 'Unknown'),
  COALESCE(raw_user_meta_data->>'parent_phone', ''),
  COALESCE(raw_user_meta_data->>'teacher_phone', '')
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.users);

-- Bước 7: Kiểm tra lại
SELECT 'Auth users:' as table_name, COUNT(*) as count FROM auth.users
UNION ALL
SELECT 'Public users:' as table_name, COUNT(*) as count FROM public.users;

