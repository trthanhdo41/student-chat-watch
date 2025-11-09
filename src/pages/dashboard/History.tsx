import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RiskBadge } from "@/components/RiskBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, Calendar, Loader2, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/contexts/AuthContext";
import { getUserUploads, deleteUpload } from "@/services/uploadService";
import { useToast } from "@/hooks/use-toast";
import { ChatUpload, AIAnalysis } from "@/lib/supabase";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UploadWithAnalysis extends ChatUpload {
  ai_analysis: AIAnalysis[];
}

export default function History() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [uploads, setUploads] = useState<UploadWithAnalysis[]>([]);
  const [selectedItem, setSelectedItem] = useState<UploadWithAnalysis | null>(null);

  useEffect(() => {
    if (user) {
      loadHistory();
    }
  }, [user]);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const data = await getUserUploads(user!.id);
      setUploads(data as UploadWithAnalysis[]);
    } catch (error) {
      console.error('Error loading history:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải lịch sử. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (uploadId: string, imageUrl: string) => {
    if (!confirm('Bạn có chắc muốn xóa phân tích này?')) return;

    try {
      await deleteUpload(uploadId, imageUrl);
      toast({
        title: "Đã xóa",
        description: "Phân tích đã được xóa thành công.",
      });
      loadHistory();
    } catch (error) {
      console.error('Error deleting upload:', error);
      toast({
        title: "Lỗi",
        description: "Không thể xóa. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  };

  const filteredHistory = uploads.filter(item => {
    const analysis = item.ai_analysis?.[0];
    const matchesSearch = analysis?.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         analysis?.extractedText?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = riskFilter === 'all' || analysis?.riskLevel === riskFilter;
    return matchesSearch && matchesRisk;
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Các lần kiểm tra trước</h1>
          <p className="text-muted-foreground">
            Xem lại những tin nhắn em đã kiểm tra
          </p>
        </div>

        {/* Search & Filters */}
        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm theo nội dung..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={riskFilter} onValueChange={setRiskFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Lọc theo rủi ro" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="low">Thấp</SelectItem>
                  <SelectItem value="medium">Trung bình</SelectItem>
                  <SelectItem value="high">Cao</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* History Table */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle>Tất cả phân tích</CardTitle>
            <CardDescription>
              {loading ? "Đang tải..." : `Đã thực hiện ${uploads.length} phân tích`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : filteredHistory.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                {uploads.length === 0
                  ? "Chưa có phân tích nào. Hãy tải ảnh lên để bắt đầu!"
                  : "Không tìm thấy kết quả phù hợp."
                }
              </div>
            ) : (
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ngày giờ</TableHead>
                      <TableHead>Ảnh</TableHead>
                      <TableHead>Loại rủi ro</TableHead>
                      <TableHead>Mức độ</TableHead>
                      <TableHead>Độ tin cậy</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredHistory.map((item) => {
                      const analysis = item.ai_analysis?.[0];

                      return (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">
                            {new Date(item.uploaded_at).toLocaleString('vi-VN')}
                          </TableCell>
                          <TableCell>
                            <img
                              src={item.image_url}
                              alt="Chat screenshot"
                              className="w-12 h-12 rounded-lg object-cover cursor-pointer hover:opacity-80"
                              onClick={() => setSelectedItem(item)}
                              onError={(e) => {
                                console.error('Image load error:', item.image_url);
                                e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"%3E%3Crect x="3" y="3" width="18" height="18" rx="2" ry="2"%3E%3C/rect%3E%3Ccircle cx="8.5" cy="8.5" r="1.5"%3E%3C/circle%3E%3Cpolyline points="21 15 16 10 5 21"%3E%3C/polyline%3E%3C/svg%3E';
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            {analysis?.riskType || '-'}
                          </TableCell>
                          <TableCell>
                            <span className={`font-semibold ${
                              analysis?.riskLevel === 'low' ? 'text-green-600' :
                              analysis?.riskLevel === 'medium' ? 'text-yellow-600' :
                              'text-red-600'
                            }`}>
                              {analysis?.riskLevel === 'low' ? 'An toàn' :
                               analysis?.riskLevel === 'medium' ? 'Hơi lo' :
                               analysis?.riskLevel === 'high' ? 'Nguy hiểm' : '-'}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="text-lg font-bold">
                              {analysis?.confidenceScore || 0}%
                            </span>
                          </TableCell>
                          <TableCell>
                            {item.status === 'analyzed' ? (
                              <RiskBadge riskLevel={analysis?.riskLevel || 'low'} />
                            ) : item.status === 'analyzing' ? (
                              <span className="text-sm text-blue-600">Đang phân tích...</span>
                            ) : item.status === 'error' ? (
                              <span className="text-sm text-red-600">Lỗi</span>
                            ) : (
                              <span className="text-sm text-gray-600">Chờ xử lý</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedItem(item)}
                              >
                                Chi tiết
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(item.id, item.image_url)}
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Detail Dialog */}
        <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Chi tiết phân tích</DialogTitle>
              <DialogDescription>
                Phân tích được thực hiện vào {selectedItem && new Date(selectedItem.uploaded_at).toLocaleString('vi-VN')}
              </DialogDescription>
            </DialogHeader>
            {selectedItem && (
              <div className="space-y-6">
                <img
                  src={selectedItem.image_url}
                  alt="Chat screenshot"
                  className="w-full rounded-lg border"
                  onError={(e) => {
                    console.error('Image load error in dialog:', selectedItem.image_url);
                  }}
                />
                {selectedItem.ai_analysis?.[0] ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Mức độ nguy hiểm:</span>
                        <p className={`text-xl font-bold mt-1 ${
                          selectedItem.ai_analysis[0].riskLevel === 'low' ? 'text-green-600' :
                          selectedItem.ai_analysis[0].riskLevel === 'medium' ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {selectedItem.ai_analysis[0].riskLevel === 'low' ? 'An toàn' :
                           selectedItem.ai_analysis[0].riskLevel === 'medium' ? 'Hơi lo' :
                           'Nguy hiểm'}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Tình huống:</span>
                        <p className="text-xl font-bold mt-1">{selectedItem.ai_analysis[0].riskType}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Độ chắc chắn:</span>
                        <p className="text-xl font-bold mt-1">{selectedItem.ai_analysis[0].confidenceScore}%</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Kết quả:</span>
                        <RiskBadge riskLevel={selectedItem.ai_analysis[0].riskLevel || 'low'} size="lg" />
                      </div>
                    </div>

                    <div>
                      <span className="font-medium">Giải thích:</span>
                      <p className="text-muted-foreground mt-2 p-4 bg-gray-50 rounded-lg border leading-relaxed">
                        {selectedItem.ai_analysis[0].summary}
                      </p>
                    </div>

                    {selectedItem.ai_analysis[0].extractedText && (
                      <div>
                        <span className="font-medium">Những lời trong tin nhắn:</span>
                        <p className="text-sm text-muted-foreground mt-2 p-4 bg-gray-50 rounded-lg border whitespace-pre-wrap leading-relaxed">
                          {selectedItem.ai_analysis[0].extractedText}
                        </p>
                      </div>
                    )}

                    <div className="text-xs text-muted-foreground">
                      Kiểm tra lúc: {new Date(selectedItem.ai_analysis[0].analyzed_at).toLocaleString('vi-VN')}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    {selectedItem.status === 'analyzing' ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Đang phân tích...</span>
                      </div>
                    ) : selectedItem.status === 'error' ? (
                      <span className="text-red-600">Có lỗi xảy ra khi phân tích</span>
                    ) : (
                      <span>Chưa có kết quả phân tích</span>
                    )}
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
