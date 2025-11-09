import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://uevazerjmlznnotnyvcj.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVldmF6ZXJqbWx6bm5vdG55dmNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2OTcwNjAsImV4cCI6MjA3ODI3MzA2MH0.REHkpVuBCApBGS1N58lAgj_MVgWt6oVxHR5CX1vsHh0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface User {
  id: string;
  username: string;
  full_name: string;
  parent_phone: string;
  teacher_phone: string;
  created_at: string;
}

export interface ChatUpload {
  id: string;
  user_id: string;
  image_url: string;
  uploaded_at: string;
  status: 'pending' | 'analyzing' | 'analyzed' | 'error';
}

export interface AIAnalysis {
  id: string;
  upload_id: string;
  risk_level: 'high' | 'medium' | 'low';
  risk_type: string;
  confidence_score: number;
  extracted_text: string;
  summary: string;
  analyzed_at: string;
}

