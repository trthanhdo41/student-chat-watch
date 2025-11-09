import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Shield, TrendingUp, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { RiskBadge } from "@/components/RiskBadge";

const stats = [
  {
    title: "Tổng số phân tích",
    value: "24",
    icon: Upload,
    trend: "+12% so với tháng trước",
  },
  {
    title: "Mức độ an toàn",
    value: "92%",
    icon: Shield,
    trend: "Rất tốt",
  },
  {
    title: "Cảnh báo",
    value: "3",
    icon: AlertCircle,
    trend: "Cần xem xét",
  },
  {
    title: "Xu hướng",
    value: "Cải thiện",
    icon: TrendingUp,
    trend: "Tích cực",
  },
];

const recentAnalyses = [
  {
    id: 1,
    date: "2024-01-15",
    score: 25,
    preview: "Cuộc trò chuyện với bạn học",
  },
  {
    id: 2,
    date: "2024-01-14",
    score: 65,
    preview: "Tin nhắn từ người lạ",
  },
  {
    id: 3,
    date: "2024-01-13",
    score: 15,
    preview: "Group chat lớp học",
  },
];

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Tổng quan</h1>
          <p className="text-muted-foreground">
            Chào mừng trở lại! Đây là tổng quan về hoạt động của bạn.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="shadow-soft">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="rounded-xl bg-primary/10 p-3">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold mb-2">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.trend}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle>Phân tích nhanh</CardTitle>
            <CardDescription>
              Tải lên ảnh tin nhắn để phân tích ngay
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/dashboard/upload">
              <Button size="lg" className="w-full md:w-auto">
                <Upload className="mr-2 h-5 w-5" />
                Tải ảnh lên ngay
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Analyses */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle>Phân tích gần đây</CardTitle>
            <CardDescription>
              Xem lại các phân tích tin nhắn của bạn
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAnalyses.map((analysis) => (
                <div
                  key={analysis.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium mb-1">{analysis.preview}</p>
                    <p className="text-sm text-muted-foreground">{analysis.date}</p>
                  </div>
                  <RiskBadge score={analysis.score} />
                </div>
              ))}
            </div>
            <Link to="/dashboard/history">
              <Button variant="outline" className="w-full mt-4">
                Xem tất cả
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
