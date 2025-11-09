import { useState } from "react";
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
import { Search, Calendar } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const mockHistory = [
  {
    id: 1,
    date: "2024-01-15 14:30",
    thumbnail: "https://images.unsplash.com/photo-1611262588024-d12430b98920?w=100&h=100&fit=crop",
    score: 25,
    status: "safe",
    preview: "Cuộc trò chuyện với bạn học",
    details: "Không phát hiện vấn đề an toàn",
  },
  {
    id: 2,
    date: "2024-01-14 10:15",
    thumbnail: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=100&h=100&fit=crop",
    score: 65,
    status: "warning",
    preview: "Tin nhắn từ người lạ",
    details: "Phát hiện một số nội dung cần chú ý",
  },
  {
    id: 3,
    date: "2024-01-13 16:45",
    thumbnail: "https://images.unsplash.com/photo-1611262588019-db6cc2032da3?w=100&h=100&fit=crop",
    score: 15,
    status: "safe",
    preview: "Group chat lớp học",
    details: "Cuộc trò chuyện an toàn",
  },
  {
    id: 4,
    date: "2024-01-12 09:20",
    thumbnail: "https://images.unsplash.com/photo-1614680376408-81e91ffe3db7?w=100&h=100&fit=crop",
    score: 85,
    status: "danger",
    preview: "Tin nhắn đáng ngờ",
    details: "Phát hiện nội dung nguy hiểm, đã thông báo phụ huynh",
  },
  {
    id: 5,
    date: "2024-01-11 13:00",
    thumbnail: "https://images.unsplash.com/photo-1611262588024-d12430b98920?w=100&h=100&fit=crop",
    score: 40,
    status: "warning",
    preview: "Trò chuyện với người quen",
    details: "Cần theo dõi thêm",
  },
];

export default function History() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<typeof mockHistory[0] | null>(null);

  const filteredHistory = mockHistory.filter(item =>
    item.preview.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.date.includes(searchQuery)
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Lịch sử phân tích</h1>
          <p className="text-muted-foreground">
            Xem lại tất cả các phân tích tin nhắn đã thực hiện
          </p>
        </div>

        {/* Search & Filters */}
        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm theo nội dung hoặc ngày..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Lọc theo ngày
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* History Table */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle>Tất cả phân tích</CardTitle>
            <CardDescription>
              Đã thực hiện {mockHistory.length} phân tích
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ngày giờ</TableHead>
                    <TableHead>Ảnh</TableHead>
                    <TableHead>Nội dung</TableHead>
                    <TableHead>Rủi ro</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHistory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {item.date}
                      </TableCell>
                      <TableCell>
                        <img 
                          src={item.thumbnail} 
                          alt="Thumbnail"
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      </TableCell>
                      <TableCell>{item.preview}</TableCell>
                      <TableCell>
                        <span className="text-lg font-bold">{item.score}%</span>
                      </TableCell>
                      <TableCell>
                        <RiskBadge score={item.score} />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedItem(item)}
                        >
                          Xem chi tiết
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Detail Dialog */}
        <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Chi tiết phân tích</DialogTitle>
              <DialogDescription>
                Phân tích được thực hiện vào {selectedItem?.date}
              </DialogDescription>
            </DialogHeader>
            {selectedItem && (
              <div className="space-y-6">
                <img
                  src={selectedItem.thumbnail}
                  alt="Analysis"
                  className="w-full rounded-lg"
                />
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Chỉ số rủi ro:</span>
                    <RiskBadge score={selectedItem.score} size="lg" />
                  </div>
                  <div>
                    <span className="font-medium">Nội dung:</span>
                    <p className="text-muted-foreground mt-1">{selectedItem.preview}</p>
                  </div>
                  <div>
                    <span className="font-medium">Nhận xét:</span>
                    <p className="text-muted-foreground mt-1">{selectedItem.details}</p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
