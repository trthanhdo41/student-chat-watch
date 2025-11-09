# Setup Instructions - SafeStudent

## 1. Chạy SQL trong Supabase Dashboard

Vào **SQL Editor** và chạy các lệnh sau:

### Tắt RLS (Row Level Security)
```sql
-- Disable RLS for simplicity (since we're using custom auth)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE chat_uploads DISABLE ROW LEVEL SECURITY;
ALTER TABLE ai_analysis DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions DISABLE ROW LEVEL SECURITY;
```

## 2. Tạo Storage Bucket

1. Vào **Storage** trong Supabase Dashboard
2. Click **New bucket**
3. Tên bucket: `chat-images`
4. **Public bucket**: ✅ Bật (để có thể truy cập ảnh công khai)
5. Click **Create bucket**

## 3. Cấu hình N8N Webhook

Webhook URL đã được cấu hình sẵn trong code:
```
https://n8n.thedreamsai.com/webhook/analyze-chat
```

### Input format (POST request):
```json
{
  "uploadId": "uuid",
  "imageUrl": "https://...",
  "userId": "uuid"
}
```

### Expected output format:
```json
{
  "riskLevel": "safe|warning|danger",
  "confidenceScore": 0-100,
  "riskType": "string",
  "summary": "string",
  "extractedText": "string"
}
```

### Logic để gửi Zalo:
- Nếu `confidenceScore >= 70` → Gửi tin nhắn cảnh báo đến phụ huynh và giáo viên
- Lấy số điện thoại từ bảng `users`:
  - `parent_phone`
  - `teacher_phone`

## 4. Test Flow

1. Đăng nhập vào app
2. Trang chủ sẽ hiển thị giao diện chat-style
3. Click "Chọn ảnh để phân tích"
4. Chọn ảnh screenshot tin nhắn
5. Click "Phân tích ngay"
6. Kết quả sẽ hiển thị ngay trên trang chủ

## 5. Các trang trong Dashboard

- **Phân tích tin nhắn** (`/dashboard`) - Trang chủ, giao diện chat-style
- **Thống kê** (`/dashboard/stats`) - Xem tổng quan số liệu
- **Lịch sử phân tích** (`/dashboard/history`) - Xem lại các phân tích cũ
- **Thông tin liên hệ** (`/dashboard/contacts`) - Cập nhật SĐT phụ huynh/giáo viên
- **Cài đặt** (`/dashboard/settings`) - Thay đổi mật khẩu, theme

## 6. Hoàn thành ✅

Sau khi làm xong các bước trên, app đã sẵn sàng 100%!

