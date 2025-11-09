import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone, User, Save, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

export default function Contacts() {
  const { toast } = useToast();
  const { user, userProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState({
    parentPhone: "",
    teacherPhone: "",
  });

  useEffect(() => {
    if (userProfile) {
      setContacts({
        parentPhone: userProfile.parent_phone || "",
        teacherPhone: userProfile.teacher_phone || "",
      });
    }
  }, [userProfile]);

  const handleSave = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const { error } = await supabase
        .from('users')
        .update({
          parent_phone: contacts.parentPhone,
          teacher_phone: contacts.teacherPhone,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Đã lưu thay đổi!",
        description: "Thông tin liên hệ đã được cập nhật",
      });
      setEditing(false);
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể cập nhật thông tin",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
            <div className="space-y-2">
              <Label htmlFor="parentPhone">Số điện thoại phụ huynh</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="parentPhone"
                  value={contacts.parentPhone}
                  onChange={(e) => handleChange('parentPhone', e.target.value)}
                  disabled={!editing}
                  className="pl-10"
                  placeholder="Nhập số điện thoại phụ huynh"
                />
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
            <div className="space-y-2">
              <Label htmlFor="teacherPhone">Số điện thoại giáo viên</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="teacherPhone"
                  value={contacts.teacherPhone}
                  onChange={(e) => handleChange('teacherPhone', e.target.value)}
                  disabled={!editing}
                  className="pl-10"
                  placeholder="Nhập số điện thoại giáo viên"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        {editing && (
          <div className="flex gap-4">
            <Button onClick={handleSave} className="flex-1" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Lưu thay đổi
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => setEditing(false)}
              className="flex-1"
              disabled={loading}
            >
              Hủy
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
