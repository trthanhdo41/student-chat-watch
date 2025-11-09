-- Users table (học sinh)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  parent_phone TEXT NOT NULL,
  teacher_phone TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat uploads table (ảnh chat đã upload)
CREATE TABLE chat_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'analyzing', 'analyzed', 'error'))
);

-- AI analysis table (kết quả phân tích AI)
CREATE TABLE ai_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  upload_id UUID REFERENCES chat_uploads(id) ON DELETE CASCADE,
  risk_level TEXT CHECK (risk_level IN ('high', 'medium', 'low')),
  risk_type TEXT, -- scam, bullying, harassment, inappropriate, etc.
  confidence_score INTEGER, -- 0-100%
  extracted_text TEXT,
  summary TEXT,
  analyzed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_analysis ENABLE ROW LEVEL SECURITY;

-- Users: Chỉ xem được data của chính mình
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Users can insert own data" ON users
  FOR INSERT WITH CHECK (auth.uid()::text = id::text);

-- Chat uploads: Chỉ xem/tạo được của chính mình
CREATE POLICY "Users can view own uploads" ON chat_uploads
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create own uploads" ON chat_uploads
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own uploads" ON chat_uploads
  FOR UPDATE USING (auth.uid()::text = user_id::text);

-- AI analysis: Chỉ xem được phân tích của uploads của mình
CREATE POLICY "Users can view own analysis" ON ai_analysis
  FOR SELECT USING (
    upload_id IN (
      SELECT id FROM chat_uploads WHERE user_id::text = auth.uid()::text
    )
  );

-- Storage bucket for chat images
INSERT INTO storage.buckets (id, name, public)
VALUES ('chat-images', 'chat-images', false);

-- Storage policies
CREATE POLICY "Users can upload own images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'chat-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view own images" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'chat-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'chat-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

