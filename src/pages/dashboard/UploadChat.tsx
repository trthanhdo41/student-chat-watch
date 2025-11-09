import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadDropzone } from "@/components/UploadDropzone";
import { RiskBadge } from "@/components/RiskBadge";
import { Loader2, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

interface AnalysisResult {
  score: number;
  recommendation: string;
  details: string[];
}

export default function UploadChat() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [analyzing, setAnalyzing] = useState(false);
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
  };

  const handleAnalyze = async () => {
    if (!file) return;
    
    setAnalyzing(true);
    
    // Mock API call
    setTimeout(() => {
      const mockScore = Math.floor(Math.random() * 100);
      const mockResult: AnalysisResult = {
        score: mockScore,
        recommendation: mockScore < 30 
          ? "Cuộc trò chuyện này có vẻ an toàn. Hãy tiếp tục duy trì sự thận trọng."
          : mockScore < 70
          ? "Một số nội dung cần chú ý. Hãy chia sẻ với phụ huynh hoặc giáo viên nếu cần."
          : "Phát hiện nội dung có nguy cơ cao. Vui lòng thông báo ngay với người lớn!",
        details: mockScore < 30
          ? [
              "Không phát hiện ngôn ngữ bạo lực",
              "Không có dấu hiệu quấy rối",
              "Nội dung phù hợp với lứa tuổi",
            ]
          : mockScore < 70
          ? [
              "Phát hiện một số từ ngữ không phù hợp",
              "Nội dung cần được giám sát",
              "Nên trao đổi với người lớn",
            ]
          : [
              "Phát hiện ngôn ngữ bạo lực hoặc đe dọa",
              "Nội dung có thể gây hại",
              "Cần thông báo ngay cho phụ huynh/giáo viên",
            ],
      };
      
      setResult(mockResult);
      setAnalyzing(false);
    }, 3000);
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
                disabled={analyzing}
                className="w-full"
                size="lg"
              >
                {analyzing ? (
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

        {/* Analysis Progress */}
        {analyzing && (
          <Card className="shadow-medium animate-scale-in">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Loader2 className="h-6 w-6 text-primary animate-spin" />
                  <div className="flex-1">
                    <p className="font-medium">Đang phân tích nội dung...</p>
                    <p className="text-sm text-muted-foreground">
                      AI đang xử lý và đánh giá tin nhắn của bạn
                    </p>
                  </div>
                </div>
                <Progress value={66} className="h-2" />
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
                <RiskBadge score={result.score} size="lg" />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Risk Score */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Chỉ số rủi ro</span>
                  <span className="text-2xl font-bold">{result.score}%</span>
                </div>
                <Progress 
                  value={result.score} 
                  className="h-3"
                />
              </div>

              {/* Recommendation */}
              <Alert className={
                result.score < 30 ? "border-success bg-success/5" :
                result.score < 70 ? "border-warning bg-warning/5" :
                "border-destructive bg-destructive/5"
              }>
                <div className="flex gap-3">
                  {result.score < 30 ? (
                    <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                  ) : result.score < 70 ? (
                    <Info className="h-5 w-5 text-warning mt-0.5" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                  )}
                  <AlertDescription className="text-base">
                    {result.recommendation}
                  </AlertDescription>
                </div>
              </Alert>

              {/* Details */}
              <div>
                <h3 className="font-semibold mb-3">Chi tiết phân tích:</h3>
                <ul className="space-y-2">
                  {result.details.map((detail, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      </div>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <Button onClick={handleClear} variant="outline" className="flex-1">
                  Phân tích ảnh khác
                </Button>
                <Button className="flex-1">
                  Lưu kết quả
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
