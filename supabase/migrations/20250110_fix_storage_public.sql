-- Fix storage bucket to be public so images can be displayed
-- Change chat-images bucket from private to public

UPDATE storage.buckets 
SET public = true 
WHERE id = 'chat-images';

