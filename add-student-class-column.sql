-- Add student_class column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS student_class TEXT DEFAULT '';

