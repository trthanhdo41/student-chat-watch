import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Shield, TrendingUp, AlertCircle, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { RiskBadge } from "@/components/RiskBadge";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAnalyses: 0,
    safetyScore: 0,
    warnings: 0,
    trend: "Chưa có dữ liệu",
  });
  const [recentAnalyses, setRecentAnalyses] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all uploads for this user
      const { data: uploads, error: uploadsError } = await supabase
        .from('chat_uploads')
        .select(`
          id,
          uploaded_at,
          image_url,
          ai_analysis (
            risk_level,
            confidence_score
          )
        `)
        .eq('user_id', user?.id)
        .order('uploaded_at', { ascending: false });

      if (uploadsError) throw uploadsError;

      // Calculate stats
      const totalAnalyses = uploads?.length || 0;
      const analysesWithRisk = uploads?.filter(u => u.ai_analysis?.[0]) || [];

      // Calculate average safety score (100 - average confidence)
      const avgConfidence = analysesWithRisk.length > 0
        ? analysesWithRisk.reduce((sum, u) => sum + (u.ai_analysis[0].confidence_score || 0), 0) / analysesWithRisk.length
        : 0;
      const safetyScore = Math.round(100 - avgConfidence);

      // Count warnings (high risk)
      const warnings = analysesWithRisk.filter(u =>
        u.ai_analysis[0].confidence_score >= 70
      ).length;

      // Get recent 3 analyses
      const recent = uploads?.slice(0, 3).map(u => ({
        id: u.id,
        date: new Date(u.uploaded_at).toLocaleDateString('vi-VN'),
        score: u.ai_analysis?.[0]?.confidence_score || 0,
        preview: `Phân tích lúc ${new Date(u.uploaded_at).toLocaleTimeString('vi-VN')}`,
      })) || [];

      setStats({
        totalAnalyses,
        safetyScore,
        warnings,
        trend: safetyScore >= 80 ? "Tích cực" : safetyScore >= 60 ? "Trung bình" : "Cần cải thiện",
      });
      setRecentAnalyses(recent);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };
  const statsCards = [
    {
      title: "Tổng số phân tích",
      value: loading ? "..." : stats.totalAnalyses.toString(),
      icon: Upload,
      trend: loading ? "Đang tải..." : `${stats.totalAnalyses} phân tích`,
    },
    {
      title: "Mức độ an toàn",
      value: loading ? "..." : `${stats.safetyScore}%`,
      icon: Shield,
      trend: loading ? "Đang tải..." : stats.safetyScore >= 80 ? "Rất tốt" : stats.safetyScore >= 60 ? "Tốt" : "Cần cải thiện",
    },
    {
      title: "Cảnh báo",
      value: loading ? "..." : stats.warnings.toString(),
      icon: AlertCircle,
      trend: loading ? "Đang tải..." : stats.warnings > 0 ? "Cần xem xét" : "Không có cảnh báo",
    },
    {
      title: "Xu hướng",
      value: loading ? "..." : stats.trend,
      icon: TrendingUp,
      trend: loading ? "Đang tải..." : "Dựa trên phân tích gần đây",
    },
  ];

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
          {statsCards.map((stat, index) => (
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
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : recentAnalyses.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p className="mb-4">Chưa có phân tích nào</p>
                <Link to="/dashboard/upload">
                  <Button>
                    <Upload className="mr-2 h-4 w-4" />
                    Tải ảnh lên ngay
                  </Button>
                </Link>
              </div>
            ) : (
              <>
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
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
