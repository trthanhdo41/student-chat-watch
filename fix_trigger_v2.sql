-- FIX TRIGGER ĐỂ LƯU ĐÚNG METADATA

-- Xóa trigger và function cũ
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Tạo function mới với logging
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Log để debug
  RAISE LOG 'Creating user profile for: %', NEW.id;
  RAISE LOG 'Metadata: %', NEW.raw_user_meta_data;
  
  -- Insert vào users table
  INSERT INTO public.users (
    id, 
    username, 
    full_name, 
    parent_phone, 
    teacher_phone
  )
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'parent_phone',
    NEW.raw_user_meta_data->>'teacher_phone'
  );
  
  RAISE LOG 'User profile created successfully';
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    RAISE LOG 'Error creating user profile: %', SQLERRM;
    RAISE LOG 'Error detail: %', SQLSTATE;
    -- Không throw error để không block việc tạo auth user
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Tạo trigger mới
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();

-- Xóa user test cũ để test lại
-- DELETE FROM auth.users WHERE email LIKE '%@safechat.app';
-- DELETE FROM public.users;

-- Test: Kiểm tra metadata của user hiện tại
SELECT 
  'Auth user' as source,
  id,
  email,
  raw_user_meta_data
FROM auth.users
ORDER BY created_at DESC
LIMIT 3;

SELECT 
  'Public user' as source,
  id,
  username,
  full_name,
  parent_phone,
  teacher_phone
FROM public.users
ORDER BY created_at DESC
LIMIT 3;

