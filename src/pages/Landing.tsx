import { Link } from "react-router-dom";
import { Shield, MessageSquare, Bell, Users, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: MessageSquare,
    title: "Phân tích tin nhắn thông minh",
    description: "AI phát hiện ngôn ngữ và nội dung nguy hiểm trong cuộc trò chuyện của bạn",
  },
  {
    icon: Bell,
    title: "Thông báo tức thời",
    description: "Cảnh báo ngay lập tức cho phụ huynh và giáo viên khi phát hiện rủi ro",
  },
  {
    icon: Shield,
    title: "Bảo vệ an toàn",
    description: "Hệ thống đánh giá rủi ro và đưa ra khuyến nghị phù hợp",
  },
  {
    icon: Users,
    title: "Kết nối gia đình",
    description: "Giữ liên lạc với phụ huynh và giáo viên để hỗ trợ kịp thời",
  },
];

const benefits = [
  "Phát hiện ngôn ngữ bạo lực và quấy rối",
  "Nhận diện lừa đảo và nội dung không phù hợp",
  "Báo cáo chi tiết và dễ hiểu",
  "Bảo mật thông tin tuyệt đối",
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass-effect">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-primary p-2">
                <Shield className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">SafeChat</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button variant="ghost">Đăng nhập</Button>
              </Link>
              <Link to="/register">
                <Button>Đăng ký</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Shield className="h-4 w-4" />
              Nền tảng bảo vệ an toàn học sinh
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              Bảo vệ học sinh khỏi
              <span className="gradient-primary bg-clip-text text-transparent"> rủi ro trực tuyến</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              SafeChat sử dụng AI để phân tích và phát hiện nội dung nguy hiểm trong tin nhắn, 
              giúp bảo vệ học sinh và thông báo kịp thời cho phụ huynh, giáo viên.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <Button size="lg" className="group">
                  Đăng ký tài khoản học sinh
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button size="lg" variant="outline">
                Tìm hiểu thêm
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Tính năng nổi bật
            </h2>
            <p className="text-xl text-muted-foreground">
              Giải pháp toàn diện để bảo vệ học sinh trên không gian mạng
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="shadow-soft hover:shadow-medium transition-all hover:-translate-y-1 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="rounded-xl bg-primary/10 p-3 w-fit mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold">
                Tại sao chọn SafeChat?
              </h2>
              <p className="text-lg text-muted-foreground">
                Chúng tôi cam kết mang đến môi trường trực tuyến an toàn nhất cho học sinh, 
                với công nghệ AI tiên tiến và sự hỗ trợ tận tâm.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="rounded-full bg-success/10 p-1 mt-0.5">
                      <CheckCircle className="h-5 w-5 text-success" />
                    </div>
                    <span className="text-lg">{benefit}</span>
                  </li>
                ))}
              </ul>
              <Link to="/register">
                <Button size="lg" className="mt-4">
                  Bắt đầu ngay
                </Button>
              </Link>
            </div>
            
            <Card className="shadow-strong">
              <CardContent className="p-8">
                <div className="aspect-square rounded-2xl bg-gradient-primary flex items-center justify-center">
                  <Shield className="h-32 w-32 text-white" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Card className="shadow-medium">
            <CardContent className="p-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Sẵn sàng bảo vệ con em bạn?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Đăng ký tài khoản miễn phí ngay hôm nay và trải nghiệm sự an tâm
              </p>
              <Link to="/register">
                <Button size="lg">
                  Đăng ký tài khoản học sinh
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-primary p-2">
                <Shield className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold">SafeChat</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 SafeChat. Bảo vệ học sinh trên không gian mạng.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
