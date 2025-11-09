import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadDropzone } from "@/components/UploadDropzone";
import { RiskBadge } from "@/components/RiskBadge";
import { Loader2, AlertTriangle, CheckCircle, Info, Sparkles } from "lucide-react";
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

      console.log('=== ANALYSIS RESULT IN COMPONENT ===');
      console.log('analysisResult:', analysisResult);
      console.log('riskLevel:', analysisResult.riskLevel);
      console.log('riskType:', analysisResult.riskType);

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
        <Card className="shadow-medium border-2">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
            <CardTitle className="text-xl flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              Kiểm tra tin nhắn
            </CardTitle>
            <CardDescription className="text-base">
              Tải ảnh tin nhắn lên để em kiểm tra xem có an toàn không nhé!
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
          <Card className="shadow-strong animate-scale-in border-2 border-primary/20">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="relative">
                    <Loader2 className="h-16 w-16 text-primary animate-spin" />
                    <Sparkles className="h-6 w-6 text-yellow-500 absolute -top-1 -right-1 animate-pulse" />
                  </div>
                  <div>
                    <p className="text-xl font-bold mb-2">
                      {uploading ? "Đang tải ảnh lên..." : "AI đang kiểm tra..."}
                    </p>
                    <p className="text-base text-muted-foreground">
                      {uploading
                        ? "Chờ em một chút nhé!"
                        : "Đang xem tin nhắn có an toàn không..."
                      }
                    </p>
                  </div>
                </div>
                <Progress value={uploading ? 40 : 80} className="h-3" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {result && (
          <>
            {/* DEBUG INFO - REMOVE LATER */}
            <div className="bg-yellow-100 border-2 border-yellow-500 p-4 rounded text-xs font-mono">
              <div>DEBUG INFO:</div>
              <div>result.riskLevel: "{result.riskLevel}"</div>
              <div>typeof: {typeof result.riskLevel}</div>
              <div>length: {result.riskLevel.length}</div>
              <div>equals 'low': {String(result.riskLevel === 'low')}</div>
              <div>equals 'medium': {String(result.riskLevel === 'medium')}</div>
              <div>equals 'high': {String(result.riskLevel === 'high')}</div>
              <div>charCodes: {Array.from(result.riskLevel).map(c => c.charCodeAt(0)).join(',')}</div>
            </div>

            <Card className={`shadow-strong animate-scale-in border-2 ${
              result.riskLevel === 'low' ? 'border-green-200 bg-green-50/50 dark:bg-green-950/20' :
              result.riskLevel === 'medium' ? 'border-yellow-200 bg-yellow-50/50 dark:bg-yellow-950/20' :
              'border-red-200 bg-red-50/50 dark:bg-red-950/20'
            }`}>
              <CardHeader>
                <div className="flex flex-col items-center text-center gap-4">
                  <div className={`p-4 rounded-full ${
                    result.riskLevel === 'low' ? 'bg-green-100 dark:bg-green-900' :
                    result.riskLevel === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900' :
                    'bg-red-100 dark:bg-red-900'
                  }`}>
                    {result.riskLevel === 'low' ? (
                      <CheckCircle className="h-12 w-12 text-green-600" />
                    ) : result.riskLevel === 'medium' ? (
                      <AlertTriangle className="h-12 w-12 text-yellow-600" />
                    ) : (
                      <AlertTriangle className="h-12 w-12 text-red-600" />
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-2xl mb-2">
                      {result.riskLevel === 'low' ? 'Tin nhắn an toàn!' :
                       result.riskLevel === 'medium' ? 'Cần cẩn thận!' :
                       'Nguy hiểm!'}
                    </CardTitle>
                    <RiskBadge riskLevel={result.riskLevel} size="lg" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
              {/* Confidence Score */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Độ chắc chắn</p>
                <p className="text-3xl font-bold mb-3">{result.confidenceScore}%</p>
                <Progress
                  value={result.confidenceScore}
                  className="h-3"
                />
              </div>

              {/* Risk Type */}
              <Alert className={`border-2 ${
                result.riskLevel === 'low' ? "border-green-500 bg-green-50 dark:bg-green-950" :
                result.riskLevel === 'medium' ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-950" :
                "border-red-500 bg-red-50 dark:bg-red-950"
              }`}>
                <div className="flex gap-3">
                  {result.riskLevel === 'low' ? (
                    <CheckCircle className="h-6 w-6 text-green-600 mt-0.5" />
                  ) : result.riskLevel === 'medium' ? (
                    <Info className="h-6 w-6 text-yellow-600 mt-0.5" />
                  ) : (
                    <AlertTriangle className="h-6 w-6 text-red-600 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="font-bold mb-2 text-lg">{result.riskType}</p>
                    <AlertDescription className="text-base leading-relaxed">
                      {result.summary}
                    </AlertDescription>
                  </div>
                </div>
              </Alert>

              {/* Extracted Text */}
              {result.extractedText && (
                <div>
                  <h3 className="font-bold mb-3 text-lg flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    Những lời trong tin nhắn:
                  </h3>
                  <div className="bg-muted/50 p-5 rounded-xl border-2">
                    <p className="text-base leading-relaxed whitespace-pre-wrap">{result.extractedText}</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <Button onClick={handleClear} variant="outline" className="flex-1 border-2" size="lg">
                  Kiểm tra ảnh khác
                </Button>
                <Button onClick={() => navigate('/dashboard/history')} className="flex-1" size="lg">
                  Xem lại các lần trước
                </Button>
              </div>
            </CardContent>
          </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
