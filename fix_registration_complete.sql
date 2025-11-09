-- FIX ĐĂNG KÝ HOÀN CHỈNH

-- 1. Thêm cột class vào bảng users
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS class TEXT;

-- 2. Xóa trigger và function cũ
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 3. Tạo function mới với đầy đủ thông tin
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (
    id, 
    username, 
    full_name, 
    parent_phone, 
    teacher_phone,
    class
  )
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'parent_phone',
    NEW.raw_user_meta_data->>'teacher_phone',
    NEW.raw_user_meta_data->>'class'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Tạo trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();

-- 5. Xóa user test để test lại
DELETE FROM public.users WHERE username = 'trthanhdo41';
DELETE FROM auth.users WHERE email = 'trthanhdo41@safechat.app';

