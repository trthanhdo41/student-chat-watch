import { Link } from "react-router-dom";
import { Shield, MessageSquare, Bell, Users, ArrowRight, CheckCircle, Mail, Twitter, Linkedin, ChevronRight, Upload, AlertTriangle, Info, AlertCircle, Phone, UserCheck, FileText, Smartphone, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

const features = [
  {
    icon: MessageSquare,
    title: "Phân tích tin nhắn",
    description: "AI phát hiện ngôn ngữ và nội dung nguy hiểm trong cuộc trò chuyện",
  },
  {
    icon: Bell,
    title: "Cảnh báo tức thời",
    description: "Thông báo ngay lập tức cho phụ huynh và giáo viên khi phát hiện rủi ro",
  },
  {
    icon: Shield,
    title: "Bảo vệ toàn diện",
    description: "Đánh giá rủi ro và đưa ra khuyến nghị phù hợp",
  },
];

const risks = [
  {
    category: "An ninh & An toàn",
    items: [
      "Tiếp xúc nội dung bạo lực, khiêu dâm",
      "Bắt nạt và quấy rối trực tuyến",
      "Xâm phạm đời tư, đánh cắp thông tin",
      "Xâm hại tình dục trực tuyến",
      "Lừa đảo và phần mềm độc hại",
    ],
  },
  {
    category: "Sức khỏe & Tâm lý",
    items: [
      "Nghiện Internet, game, mạng xã hội",
      "Suy nhược sức khỏe thể chất",
      "Trầm cảm, lo âu, rối loạn tâm lý",
      "Giảm kỹ năng giao tiếp xã hội",
      "Rối loạn giấc ngủ, mỏi mắt",
    ],
  },
  {
    category: "Pháp luật",
    items: [
      "Bị lôi kéo vi phạm pháp luật",
      "Vi phạm Luật An ninh mạng",
      "Tham gia hoạt động bất hợp pháp",
    ],
  },
];

const useCases = [
  {
    title: "Cho phụ huynh",
    description: "Theo dõi và bảo vệ con em khỏi các mối nguy hiểm trực tuyến",
    items: ["Phát hiện bắt nạt", "Cảnh báo lừa đảo", "Báo cáo chi tiết"],
  },
  {
    title: "Cho giáo viên",
    description: "Giám sát và hỗ trợ học sinh trong môi trường học tập an toàn",
    items: ["Quản lý lớp học", "Phát hiện sớm", "Hỗ trợ kịp thời"],
  },
  {
    title: "Cho học sinh",
    description: "Tự bảo vệ và nhận được sự hỗ trợ khi cần thiết",
    items: ["Tự kiểm tra", "Học cách an toàn", "Nhận hỗ trợ"],
  },
];

export default function Landing() {
  const [demoRiskLevel, setDemoRiskLevel] = useState<'high' | 'medium' | 'low' | null>(null);
  const [demoStep, setDemoStep] = useState<'upload' | 'analyzing' | 'result'>('upload');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showZaloNotif, setShowZaloNotif] = useState(false);

  const showDemoAlert = (level: 'high' | 'medium' | 'low') => {
    // Step 1: Upload animation
    setDemoStep('analyzing');
    setUploadProgress(0);
    setShowZaloNotif(false);

    // Simulate upload progress
    const uploadInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(uploadInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 100);

    // Step 2: Show analyzing state
    setTimeout(() => {
      clearInterval(uploadInterval);
      setUploadProgress(100);
    }, 1000);

    // Step 3: Show result
    setTimeout(() => {
      setDemoStep('result');
      setDemoRiskLevel(level);
    }, 2500);

    // Step 4: Show Zalo notification for high/medium risk
    if (level === 'high' || level === 'medium') {
      setTimeout(() => {
        setShowZaloNotif(true);
      }, 3500);
    }
  };

  const resetDemo = () => {
    setDemoStep('upload');
    setDemoRiskLevel(null);
    setUploadProgress(0);
    setShowZaloNotif(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <span className="text-base font-semibold">SafeChat</span>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" size="sm" className="text-sm">Đăng nhập</Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="text-sm bg-black hover:bg-gray-800 text-white">Đăng ký miễn phí</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-6">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.1]">
              Bảo vệ học sinh khỏi rủi ro trực tuyến
            </h1>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Phát hiện bắt nạt, quấy rối, lừa đảo và nội dung nguy hiểm trong tin nhắn.
              Cảnh báo kịp thời cho phụ huynh và giáo viên.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/register">
              <Button size="lg" className="bg-black hover:bg-gray-800 text-white h-12 px-6 text-base">
                Bắt đầu ngay
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="h-12 px-6 text-base border-gray-300">
              Xem demo
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>

          <p className="text-sm text-gray-500">
            Hoàn toàn miễn phí • Không giới hạn • Không cần thẻ tín dụng
          </p>
        </div>

        {/* Hero Demo Interface */}
        <div className="max-w-5xl mx-auto mt-16 px-6">
          <div className="relative rounded-lg border border-gray-200 shadow-2xl overflow-hidden bg-white">
            <div className="aspect-[16/10] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-8">
              <Card className="w-full max-w-lg shadow-lg">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center gap-3 pb-4 border-b">
                      <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white text-sm font-medium">
                        AI
                      </div>
                      <div>
                        <div className="font-semibold text-base">SafeChat AI</div>
                        <div className="text-xs text-gray-500">Phân tích tin nhắn tự động</div>
                      </div>
                    </div>

                    {/* Upload Area */}
                    {demoStep === 'upload' && (
                      <div className="space-y-4">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer">
                          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-sm font-medium text-gray-700 mb-1">
                            Tải ảnh chụp màn hình tin nhắn
                          </p>
                          <p className="text-xs text-gray-500">
                            Zalo, Messenger, hoặc ứng dụng chat khác
                          </p>
                        </div>

                        {/* Demo Buttons */}
                        <div className="space-y-2">
                          <p className="text-xs text-gray-500 text-center flex items-center justify-center gap-1">
                            <Smartphone className="h-3 w-3" />
                            Demo: Thử mô phỏng quy trình phân tích
                          </p>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 text-xs border-red-200 hover:bg-red-50"
                              onClick={() => showDemoAlert('high')}
                            >
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Nguy hiểm cao
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 text-xs border-orange-200 hover:bg-orange-50"
                              onClick={() => showDemoAlert('medium')}
                            >
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Khả nghi
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 text-xs border-blue-200 hover:bg-blue-50"
                              onClick={() => showDemoAlert('low')}
                            >
                              <Info className="h-3 w-3 mr-1" />
                              Cảnh báo nhẹ
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Analyzing State */}
                    {demoStep === 'analyzing' && (
                      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="space-y-3">
                          {/* Upload Progress */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-600 flex items-center gap-1">
                                <Upload className="h-3 w-3" />
                                Đang tải ảnh lên...
                              </span>
                              <span className="font-medium">{uploadProgress}%</span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-black transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                              />
                            </div>
                          </div>

                          {/* AI Analysis Animation */}
                          {uploadProgress === 100 && (
                            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 animate-in fade-in duration-300">
                              <div className="flex items-center gap-3">
                                <div className="relative">
                                  <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white">
                                    <MessageSquare className="h-4 w-4" />
                                  </div>
                                  <Loader2 className="absolute inset-0 w-8 h-8 text-black animate-spin" />
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
                                    <Shield className="h-4 w-4" />
                                    AI đang phân tích nội dung...
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">Đang kiểm tra: dụ dỗ, lừa đảo, bắt nạt, nội dung nguy hiểm...</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Alert Display */}
                    {demoStep === 'result' && demoRiskLevel === 'high' && (
                      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Student Alert */}
                        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 shadow-lg">
                          <div className="flex items-start gap-3">
                            <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5 animate-pulse" />
                            <div className="space-y-2 flex-1">
                              <p className="font-semibold text-red-900 text-sm">
                                Hệ thống phát hiện nội dung có khả năng NGUY HIỂM
                              </p>
                              <p className="text-sm text-red-800">
                                Vui lòng kiểm tra kỹ tin nhắn — không gặp người lạ.
                              </p>
                              <div className="bg-white/50 rounded p-2 text-xs text-red-700 border border-red-200">
                                <p className="font-medium flex items-center gap-1">
                                  <Shield className="h-3 w-3" />
                                  Phân tích AI:
                                </p>
                                <p className="mt-1">• Phát hiện: Dụ dỗ / Hẹn gặp (95% nguy hiểm)</p>
                                <p>• Trích đoạn: "...muốn gặp cậu tối nay, tớ sẽ cho tiền..."</p>
                              </div>
                              <div className="flex flex-wrap gap-2 pt-2">
                                <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white h-8 text-xs">
                                  <Phone className="h-3 w-3 mr-1" />
                                  Gọi phụ huynh
                                </Button>
                                <Button size="sm" variant="outline" className="h-8 text-xs border-red-300">
                                  <UserCheck className="h-3 w-3 mr-1" />
                                  Gọi giáo viên
                                </Button>
                                <Button size="sm" variant="outline" className="h-8 text-xs border-red-300">
                                  <FileText className="h-3 w-3 mr-1" />
                                  Xem chi tiết
                                </Button>
                              </div>
                              <p className="text-xs text-red-700 pt-1 flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                Bỏ qua (không khuyến nghị)
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Zalo Notifications */}
                        {showZaloNotif && (
                          <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <p className="text-xs text-gray-600 font-medium flex items-center gap-1">
                              <Smartphone className="h-3 w-3" />
                              Thông báo Zalo đã gửi:
                            </p>

                            {/* Parent Notification */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs">
                              <div className="flex items-center gap-2 mb-2">
                                <Users className="h-4 w-4 text-blue-700" />
                                <span className="font-semibold text-blue-900">Gửi Phụ huynh</span>
                              </div>
                              <div className="bg-white rounded p-2 text-gray-700 space-y-1">
                                <p className="font-medium flex items-center gap-1">
                                  <AlertTriangle className="h-3 w-3 text-red-600" />
                                  Cảnh báo nguy cơ cao
                                </p>
                                <p><strong>Học sinh:</strong> [Tên] (Lớp 8A)</p>
                                <p><strong>Thời gian:</strong> 2025-11-09 20:15</p>
                                <p><strong>Loại:</strong> Dụ dỗ / Hẹn gặp (95% nguy hiểm)</p>
                                <p><strong>Trích đoạn:</strong> "...muốn gặp cậu tối nay, tớ sẽ cho tiền..."</p>
                                <p className="text-red-600 font-medium mt-1 flex items-center gap-1">
                                  <Bell className="h-3 w-3" />
                                  Hành động: Kiểm tra ngay, liên hệ con/em, báo cáo nhà trường nếu cần
                                </p>
                              </div>
                            </div>

                            {/* Teacher Notification */}
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-xs">
                              <div className="flex items-center gap-2 mb-2">
                                <UserCheck className="h-4 w-4 text-green-700" />
                                <span className="font-semibold text-green-900">Gửi Giáo viên</span>
                              </div>
                              <div className="bg-white rounded p-2 text-gray-700 space-y-1">
                                <p className="font-medium flex items-center gap-1">
                                  <AlertTriangle className="h-3 w-3 text-red-600" />
                                  Phát hiện nội dung nghiêm trọng
                                </p>
                                <p><strong>Học sinh:</strong> [Tên] (Lớp 8A)</p>
                                <p><strong>Loại:</strong> Dụ dỗ / Hẹn gặp (95% nguy hiểm)</p>
                                <p><strong>Trích đoạn:</strong> "...muốn gặp cậu tối nay..."</p>
                                <p className="text-orange-600 font-medium mt-1 flex items-center gap-1">
                                  <FileText className="h-3 w-3" />
                                  Vui lòng kiểm tra & follow-up học sinh
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        <Button
                          size="sm"
                          variant="ghost"
                          className="w-full text-xs"
                          onClick={resetDemo}
                        >
                          ← Thử lại demo
                        </Button>
                      </div>
                    )}

                    {demoStep === 'result' && demoRiskLevel === 'medium' && (
                      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Student Alert */}
                        <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4 shadow-lg">
                          <div className="flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 text-orange-600 shrink-0 mt-0.5" />
                            <div className="space-y-2 flex-1">
                              <p className="font-semibold text-orange-900 text-sm">
                                Hệ thống phát hiện nội dung khả nghi
                              </p>
                              <p className="text-sm text-orange-800">
                                Vui lòng xem lại cuộc trò chuyện. Bạn có muốn gửi yêu cầu hỗ trợ tới giáo viên?
                              </p>
                              <div className="bg-white/50 rounded p-2 text-xs text-orange-700 border border-orange-200">
                                <p className="font-medium flex items-center gap-1">
                                  <Shield className="h-3 w-3" />
                                  Phân tích AI:
                                </p>
                                <p className="mt-1">• Phát hiện: Ngôn từ không phù hợp (65% khả nghi)</p>
                                <p>• Trích đoạn: "...xin tiền..."</p>
                              </div>
                              <div className="flex flex-wrap gap-2 pt-2">
                                <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white h-8 text-xs">
                                  <Bell className="h-3 w-3 mr-1" />
                                  Gửi hỗ trợ
                                </Button>
                                <Button size="sm" variant="outline" className="h-8 text-xs border-orange-300">
                                  <FileText className="h-3 w-3 mr-1" />
                                  Xem chi tiết
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Zalo Notifications */}
                        {showZaloNotif && (
                          <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <p className="text-xs text-gray-600 font-medium flex items-center gap-1">
                              <Smartphone className="h-3 w-3" />
                              Thông báo Zalo đã gửi:
                            </p>

                            {/* Teacher Notification */}
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-xs">
                              <div className="flex items-center gap-2 mb-2">
                                <UserCheck className="h-4 w-4 text-green-700" />
                                <span className="font-semibold text-green-900">Gửi Giáo viên</span>
                              </div>
                              <div className="bg-white rounded p-2 text-gray-700 space-y-1">
                                <p className="font-medium flex items-center gap-1">
                                  <AlertCircle className="h-3 w-3 text-orange-600" />
                                  Phát hiện nội dung khả nghi
                                </p>
                                <p><strong>Học sinh:</strong> [Tên] (Lớp 8A)</p>
                                <p><strong>Loại:</strong> Ngôn từ không phù hợp (65% khả nghi)</p>
                                <p><strong>Trích đoạn:</strong> "...xin tiền..."</p>
                                <p className="text-orange-600 font-medium mt-1 flex items-center gap-1">
                                  <FileText className="h-3 w-3" />
                                  Vui lòng kiểm tra & follow-up học sinh
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        <Button
                          size="sm"
                          variant="ghost"
                          className="w-full text-xs"
                          onClick={resetDemo}
                        >
                          ← Thử lại demo
                        </Button>
                      </div>
                    )}

                    {demoStep === 'result' && demoRiskLevel === 'low' && (
                      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Student Alert */}
                        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 shadow-lg">
                          <div className="flex items-start gap-3">
                            <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                            <div className="space-y-2 flex-1">
                              <p className="font-semibold text-blue-900 text-sm">
                                Cảnh báo: nội dung khả nghi (đã ghi nhận)
                              </p>
                              <p className="text-sm text-blue-800">
                                Lưu ý an toàn: không chia sẻ số điện thoại, địa chỉ, ảnh riêng tư.
                              </p>
                              <div className="bg-white/50 rounded p-2 text-xs text-blue-700 border border-blue-200">
                                <p className="font-medium flex items-center gap-1">
                                  <Shield className="h-3 w-3" />
                                  Phân tích AI:
                                </p>
                                <p className="mt-1">• Phát hiện: Yêu cầu thông tin cá nhân (35% cảnh báo)</p>
                                <p>• Hệ thống đã ghi nhận và theo dõi</p>
                              </div>
                              <div className="pt-2">
                                <Button size="sm" variant="outline" className="h-8 text-xs border-blue-300">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Xem mẹo an toàn
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="w-full text-xs"
                          onClick={resetDemo}
                        >
                          <ArrowRight className="h-3 w-3 mr-1 rotate-180" />
                          Thử lại demo
                        </Button>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-center pt-2 border-t text-xs text-gray-500">
                      <span>Được bảo vệ bởi AI</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Risks Section */}
      <section className="py-24 px-6 border-t border-gray-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-semibold mb-4 tracking-tight">
              Rủi ro học sinh gặp phải trên không gian mạng
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Học sinh đối mặt với nhiều nguy cơ nghiêm trọng khi tham gia không gian mạng,
              từ an ninh, sức khỏe đến pháp luật
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {risks.map((risk, index) => (
              <div key={index} className="space-y-4">
                <h3 className="text-xl font-semibold pb-3 border-b border-gray-200">
                  {risk.category}
                </h3>
                <ul className="space-y-3">
                  {risk.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-red-500 mt-1 shrink-0">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-center text-gray-700 leading-relaxed">
              <strong className="font-semibold">SafeChat</strong> giúp phát hiện sớm các dấu hiệu nguy hiểm
              trong tin nhắn của học sinh, từ đó bảo vệ các em khỏi những rủi ro trên.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-semibold mb-4 tracking-tight">
              SafeChat bảo vệ học sinh như thế nào
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Giải pháp toàn diện với công nghệ AI tiên tiến
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="space-y-3">
                <div className="w-12 h-12 rounded-lg bg-black flex items-center justify-center">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-semibold mb-4 tracking-tight">
              Dành cho mọi người
            </h2>
            <p className="text-lg text-gray-600">
              SafeChat phù hợp với phụ huynh, giáo viên và học sinh
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {useCases.map((useCase, index) => (
              <Card key={index} className="border border-gray-200 hover:border-gray-300 transition-colors">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-semibold mb-3">
                    {useCase.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {useCase.description}
                  </p>
                  <ul className="space-y-2">
                    {useCase.items.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="h-4 w-4 text-black shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight">
            Bắt đầu bảo vệ con em bạn ngay hôm nay
          </h2>
          <p className="text-xl text-gray-600">
            Hoàn toàn miễn phí. Không giới hạn. Không cần thẻ tín dụng.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/register">
              <Button size="lg" className="bg-black hover:bg-gray-800 text-white h-12 px-6 text-base">
                Đăng ký miễn phí
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="h-12 px-6 text-base border-gray-300">
              Liên hệ tư vấn
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {/* Product */}
            <div>
              <h3 className="font-semibold text-sm mb-3">Sản phẩm</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-black transition-colors">Tính năng</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Hướng dẫn</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Câu hỏi</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-semibold text-sm mb-3">Công ty</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-black transition-colors">Về chúng tôi</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Liên hệ</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="font-semibold text-sm mb-3">Tài nguyên</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-black transition-colors">Hướng dẫn</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Hỗ trợ</a></li>
                <li><a href="#" className="hover:text-black transition-colors">API</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-semibold text-sm mb-3">Pháp lý</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-black transition-colors">Bảo mật</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Điều khoản</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Cookie</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="text-sm font-semibold">SafeChat</span>
            </div>
            <p className="text-sm text-gray-600">
              © 2025 SafeChat. Bảo vệ học sinh trên không gian mạng.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-gray-600 hover:text-black transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="text-gray-600 hover:text-black transition-colors">
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
