import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Save, LogOut, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const { toast } = useToast();
  const { user, userProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [profile, setProfile] = useState({
    fullName: "",
    username: "",
    parentPhone: "",
    teacherPhone: "",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  useEffect(() => {
    if (userProfile) {
      setProfile({
        fullName: userProfile.full_name,
        username: userProfile.username,
        parentPhone: userProfile.parent_phone,
        teacherPhone: userProfile.teacher_phone,
      });
    }
  }, [userProfile]);

  const handleProfileSave = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('users')
        .update({
          full_name: profile.fullName,
          parent_phone: profile.parentPhone,
          teacher_phone: profile.teacherPhone,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Đã lưu thay đổi!",
        description: "Thông tin cá nhân đã được cập nhật",
      });
    } catch (error: any) {
      console.error('Update profile error:', error);
      toast({
        title: "Lỗi",
        description: error.message || "Không thể cập nhật. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwords.new !== passwords.confirm) {
      toast({
        title: "Lỗi",
        description: "Mật khẩu mới không khớp",
        variant: "destructive",
      });
      return;
    }

    if (passwords.new.length < 6) {
      toast({
        title: "Lỗi",
        description: "Mật khẩu phải có ít nhất 6 ký tự",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({
        password: passwords.new,
      });

      if (error) throw error;

      toast({
        title: "Đã đổi mật khẩu!",
        description: "Mật khẩu của bạn đã được cập nhật",
      });
      setPasswords({ current: "", new: "", confirm: "" });
    } catch (error: any) {
      console.error('Change password error:', error);
      toast({
        title: "Lỗi",
        description: error.message || "Không thể đổi mật khẩu. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Đã đăng xuất",
        description: "Hẹn gặp lại bạn!",
      });
      navigate('/');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast({
        title: "Lỗi",
        description: "Không thể đăng xuất. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Cài đặt</h1>
          <p className="text-muted-foreground">
            Quản lý thông tin cá nhân và bảo mật tài khoản
          </p>
        </div>

        {/* Profile Info */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle>Thông tin cá nhân</CardTitle>
            <CardDescription>
              Cập nhật thông tin cá nhân của bạn
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-6 pb-4 border-b">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="text-2xl bg-primary/10">
                  {profile.fullName?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-lg">{profile.fullName}</p>
                <p className="text-sm text-muted-foreground">@{profile.username}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="fullName">Họ và tên</Label>
                <Input
                  id="fullName"
                  value={profile.fullName}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  placeholder="Nhập họ tên"
                />
              </div>

              <div>
                <Label htmlFor="username">Tên đăng nhập</Label>
                <Input
                  id="username"
                  value={profile.username}
                  disabled
                  className="bg-gray-50"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Tên đăng nhập không thể thay đổi
                </p>
              </div>

              <div>
                <Label htmlFor="parentPhone">Số điện thoại phụ huynh</Label>
                <Input
                  id="parentPhone"
                  value={profile.parentPhone}
                  onChange={(e) => setProfile({ ...profile, parentPhone: e.target.value })}
                  placeholder="Nhập số điện thoại phụ huynh"
                />
              </div>

              <div>
                <Label htmlFor="teacherPhone">Số điện thoại giáo viên</Label>
                <Input
                  id="teacherPhone"
                  value={profile.teacherPhone}
                  onChange={(e) => setProfile({ ...profile, teacherPhone: e.target.value })}
                  placeholder="Nhập số điện thoại giáo viên"
                />
              </div>
            </div>

            <Button onClick={handleProfileSave} disabled={loading} className="w-full">
              <Save className="mr-2 h-4 w-4" />
              {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </CardContent>
        </Card>

        {/* Password Change */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle>Đổi mật khẩu</CardTitle>
            <CardDescription>
              Cập nhật mật khẩu của bạn để bảo mật tài khoản
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwords.current}
                    onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                    placeholder="Nhập mật khẩu hiện tại"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">Mật khẩu mới</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={passwords.new}
                    onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                    placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                    placeholder="Nhập lại mật khẩu mới"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <Button onClick={handlePasswordChange} disabled={loading} className="w-full">
              {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
            </Button>
          </CardContent>
        </Card>

        {/* Logout */}
        <Card className="shadow-medium border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Đăng xuất</CardTitle>
            <CardDescription>
              Đăng xuất khỏi tài khoản của bạn
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleLogout} variant="destructive" className="w-full">
              <LogOut className="mr-2 h-4 w-4" />
              Đăng xuất
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
