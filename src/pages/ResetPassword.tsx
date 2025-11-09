import { useState } from "react";
import { Link } from "react-router-dom";
import { Shield, ArrowLeft, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function ResetPassword() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Mock reset
    setTimeout(() => {
      setSent(true);
      toast({
        title: "Email đã được gửi!",
        description: "Vui lòng kiểm tra hộp thư của bạn",
      });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <span className="text-base font-semibold">SafeChat</span>
            </Link>
            <Link to="/login">
              <Button variant="ghost" size="sm" className="text-sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại đăng nhập
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-medium animate-fade-in">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto rounded-full bg-primary/10 p-3 w-fit mb-4">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold">Đặt lại mật khẩu</CardTitle>
            <CardDescription>
              {sent 
                ? "Chúng tôi đã gửi link đặt lại mật khẩu đến email của bạn"
                : "Nhập email để nhận link đặt lại mật khẩu"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!sent ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="student@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Đang gửi..." : "Gửi link đặt lại"}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  <Link to="/login" className="text-primary hover:underline">
                    Trở về đăng nhập
                  </Link>
                </p>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-success/10 border border-success/20 text-center">
                  <p className="text-sm text-success-foreground">
                    Vui lòng kiểm tra email và làm theo hướng dẫn để đặt lại mật khẩu
                  </p>
                </div>
                <Link to="/login" className="block">
                  <Button className="w-full">
                    Quay lại đăng nhập
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
