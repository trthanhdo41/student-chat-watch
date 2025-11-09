import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadDropzone } from "@/components/UploadDropzone";
import { RiskBadge } from "@/components/RiskBadge";
import { Loader2, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { uploadChatImage } from "@/services/uploadService";
import { analyzeImage } from "@/services/aiService";
import { useNavigate } from "react-router-dom";

interface AnalysisResult {
  riskLevel: 'high' | 'medium' | 'low';
  riskType: string;
  confidenceScore: number;
  extractedText: string;
  summary: string;
}

export default function UploadChat() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [uploadId, setUploadId] = useState<string>("");
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setResult(null);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleClear = () => {
    setFile(null);
    setPreview("");
    setResult(null);
    setUploadId("");
  };

  const handleAnalyze = async () => {
    if (!file || !user) return;

    try {
      // Step 1: Upload image
      setUploading(true);
      const { uploadId: newUploadId, imageUrl } = await uploadChatImage(file, user.id);
      setUploadId(newUploadId);
      setUploading(false);

      toast({
        title: "Upload thành công!",
        description: "Đang bắt đầu phân tích...",
      });

      // Step 2: Analyze image
      setAnalyzing(true);
      const analysisResult = await analyzeImage(newUploadId, imageUrl);
      setResult(analysisResult);

      toast({
        title: "Phân tích hoàn tất!",
        description: "Kết quả đã được lưu vào lịch sử.",
      });
    } catch (error: any) {
      console.error('Analysis error:', error);
      toast({
        title: "Lỗi",
        description: error.message || "Có lỗi xảy ra. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setAnalyzing(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Phân tích tin nhắn</h1>
          <p className="text-muted-foreground">
            Tải lên ảnh chụp màn hình cuộc trò chuyện để phân tích mức độ an toàn
          </p>
        </div>

        {/* Upload Section */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle>Tải ảnh lên</CardTitle>
            <CardDescription>
              Hỗ trợ các định dạng: JPG, PNG, JPEG
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <UploadDropzone
              onFileSelect={handleFileSelect}
              preview={preview}
              onClear={handleClear}
            />
            
            {file && !result && (
              <Button
                onClick={handleAnalyze}
                disabled={uploading || analyzing}
                className="w-full"
                size="lg"
              >
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Đang tải lên...
                  </>
                ) : analyzing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Đang phân tích...
                  </>
                ) : (
                  "Phân tích ngay"
                )}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Upload/Analysis Progress */}
        {(uploading || analyzing) && (
          <Card className="shadow-medium animate-scale-in">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Loader2 className="h-6 w-6 text-primary animate-spin" />
                  <div className="flex-1">
                    <p className="font-medium">
                      {uploading ? "Đang tải ảnh lên..." : "Đang phân tích nội dung..."}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {uploading
                        ? "Đang lưu ảnh vào hệ thống"
                        : "AI đang xử lý và đánh giá tin nhắn của bạn"
                      }
                    </p>
                  </div>
                </div>
                <Progress value={uploading ? 33 : 66} className="h-2" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {result && (
          <Card className="shadow-strong animate-scale-in">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Kết quả phân tích</CardTitle>
                <RiskBadge score={result.confidenceScore} size="lg" />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Risk Level */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Mức độ rủi ro</span>
                  <span className={`text-2xl font-bold ${
                    result.riskLevel === 'low' ? 'text-green-600' :
                    result.riskLevel === 'medium' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {result.riskLevel === 'low' ? 'Thấp' :
                     result.riskLevel === 'medium' ? 'Trung bình' :
                     'Cao'}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Độ tin cậy</span>
                  <span className="text-lg font-semibold">{result.confidenceScore}%</span>
                </div>
                <Progress
                  value={result.confidenceScore}
                  className="h-3"
                />
              </div>

              {/* Risk Type */}
              <Alert className={
                result.riskLevel === 'low' ? "border-green-500 bg-green-50" :
                result.riskLevel === 'medium' ? "border-yellow-500 bg-yellow-50" :
                "border-red-500 bg-red-50"
              }>
                <div className="flex gap-3">
                  {result.riskLevel === 'low' ? (
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  ) : result.riskLevel === 'medium' ? (
                    <Info className="h-5 w-5 text-yellow-600 mt-0.5" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="font-semibold mb-1">Loại rủi ro: {result.riskType}</p>
                    <AlertDescription className="text-sm">
                      {result.summary}
                    </AlertDescription>
                  </div>
                </div>
              </Alert>

              {/* Extracted Text */}
              {result.extractedText && (
                <div>
                  <h3 className="font-semibold mb-3">Nội dung đã trích xuất:</h3>
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <p className="text-sm whitespace-pre-wrap">{result.extractedText}</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <Button onClick={handleClear} variant="outline" className="flex-1">
                  Phân tích ảnh khác
                </Button>
                <Button onClick={() => navigate('/dashboard/history')} className="flex-1">
                  Xem lịch sử
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
