import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone, Mail, User, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Contacts() {
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [contacts, setContacts] = useState({
    parentName: "Nguyễn Văn B",
    parentPhone: "0987654321",
    parentEmail: "parent@example.com",
    teacherName: "Trần Thị C",
    teacherPhone: "0976543210",
    teacherEmail: "teacher@example.com",
  });

  const handleSave = () => {
    // Mock save
    toast({
      title: "Đã lưu thay đổi!",
      description: "Thông tin liên hệ đã được cập nhật",
    });
    setEditing(false);
  };

  const handleChange = (field: string, value: string) => {
    setContacts(prev => ({ ...prev, [field]: value }));
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Thông tin liên hệ</h1>
            <p className="text-muted-foreground">
              Quản lý thông tin liên hệ của phụ huynh và giáo viên
            </p>
          </div>
          {!editing && (
            <Button onClick={() => setEditing(true)}>
              Chỉnh sửa
            </Button>
          )}
        </div>

        {/* Parent Contact */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Thông tin phụ huynh
            </CardTitle>
            <CardDescription>
              Thông tin liên hệ của phụ huynh sẽ nhận cảnh báo khi có rủi ro
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="parentName">Họ và tên</Label>
                <Input
                  id="parentName"
                  value={contacts.parentName}
                  onChange={(e) => handleChange('parentName', e.target.value)}
                  disabled={!editing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="parentPhone">Số điện thoại</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="parentPhone"
                    value={contacts.parentPhone}
                    onChange={(e) => handleChange('parentPhone', e.target.value)}
                    disabled={!editing}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="parentEmail">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="parentEmail"
                    type="email"
                    value={contacts.parentEmail}
                    onChange={(e) => handleChange('parentEmail', e.target.value)}
                    disabled={!editing}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Teacher Contact */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Thông tin giáo viên
            </CardTitle>
            <CardDescription>
              Thông tin liên hệ của giáo viên sẽ nhận cảnh báo khi có rủi ro
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="teacherName">Họ và tên</Label>
                <Input
                  id="teacherName"
                  value={contacts.teacherName}
                  onChange={(e) => handleChange('teacherName', e.target.value)}
                  disabled={!editing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="teacherPhone">Số điện thoại</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="teacherPhone"
                    value={contacts.teacherPhone}
                    onChange={(e) => handleChange('teacherPhone', e.target.value)}
                    disabled={!editing}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="teacherEmail">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="teacherEmail"
                    type="email"
                    value={contacts.teacherEmail}
                    onChange={(e) => handleChange('teacherEmail', e.target.value)}
                    disabled={!editing}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        {editing && (
          <div className="flex gap-4">
            <Button onClick={handleSave} className="flex-1">
              <Save className="mr-2 h-4 w-4" />
              Lưu thay đổi
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setEditing(false)}
              className="flex-1"
            >
              Hủy
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
