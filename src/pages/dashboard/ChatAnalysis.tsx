import { useState, useRef } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, Image as ImageIcon, Loader2, AlertCircle, CheckCircle, AlertTriangle, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { RiskBadge } from "@/components/RiskBadge";
import { analyzeImage } from "@/services/aiService";

interface AnalysisResult {
  id: string;
  imageUrl: string;
  riskLevel: string;
  confidenceScore: number;
  riskType: string;
  summary: string;
  extractedText: string;
  uploadedAt: string;
}

export default function ChatAnalysis() {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyses, setAnalyses] = useState<AnalysisResult[]>([]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn file ảnh",
        variant: "destructive",
      });
      return;
    }

    setSelectedImage(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleUploadAndAnalyze = async () => {
    if (!selectedImage || !user) return;

    try {
      setUploading(true);
      setAnalyzing(true);

      // Use preview URL (data URL) for analysis
      const imageUrl = previewUrl;

      // Insert upload record
      const { data: chatUpload, error: insertError } = await supabase
        .from('chat_uploads')
        .insert({
          user_id: user.id,
          image_url: imageUrl,
          status: 'processing',
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setUploading(false);

      // Call Gemini AI analysis (already saves to database)
      const result = await analyzeImage(chatUpload.id, imageUrl);

      // Add to analyses list
      const newAnalysis: AnalysisResult = {
        id: chatUpload.id,
        imageUrl: imageUrl,
        riskLevel: result.riskLevel,
        confidenceScore: result.confidenceScore,
        riskType: result.riskType,
        summary: result.summary,
        extractedText: result.extractedText,
        uploadedAt: chatUpload.uploaded_at,
      };

      setAnalyses([newAnalysis, ...analyses]);

      toast({
        title: "Phân tích hoàn tất!",
        description: "Kết quả đã sẵn sàng",
      });

      // Reset
      setSelectedImage(null);
      setPreviewUrl("");
      if (fileInputRef.current) fileInputRef.current.value = "";

    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Lỗi",
        description: error.message || "Không thể phân tích ảnh",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setAnalyzing(false);
    }
  };

  const getRiskIcon = (score: number) => {
    if (score < 30) return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (score < 70) return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
    return <AlertCircle className="h-5 w-5 text-red-600" />;
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-4rem)] max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex-none py-6 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Phân tích tin nhắn</h1>
              <p className="text-sm text-muted-foreground">
                Tải ảnh tin nhắn lên để phát hiện rủi ro ngay lập tức
              </p>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto py-6 space-y-6">
          {analyses.length === 0 && !previewUrl && (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="p-4 rounded-full bg-primary/10 mb-4">
                <ImageIcon className="h-12 w-12 text-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Bắt đầu phân tích</h2>
              <p className="text-muted-foreground mb-6 max-w-md">
                Tải lên ảnh chụp màn hình cuộc trò chuyện để AI phân tích và phát hiện các rủi ro tiềm ẩn
              </p>
              <Button
                size="lg"
                onClick={() => fileInputRef.current?.click()}
                className="gap-2"
              >
                <Upload className="h-5 w-5" />
                Chọn ảnh để phân tích
              </Button>
            </div>
          )}

          {/* Preview selected image */}
          {previewUrl && (
            <Card className="p-6 bg-muted/30">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <ImageIcon className="h-4 w-4" />
                  Ảnh đã chọn
                </div>
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full max-w-md rounded-lg border mx-auto"
                />
                <div className="flex gap-3">
                  <Button
                    onClick={handleUploadAndAnalyze}
                    disabled={uploading || analyzing}
                    className="flex-1"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang tải lên...
                      </>
                    ) : analyzing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang phân tích...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Phân tích ngay
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedImage(null);
                      setPreviewUrl("");
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    disabled={uploading || analyzing}
                  >
                    Hủy
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Analysis Results */}
          {analyses.map((analysis) => (
            <div key={analysis.id} className="space-y-4">
              {/* User message (image) */}
              <div className="flex justify-end">
                <Card className="max-w-md p-4">
                  <img
                    src={analysis.imageUrl}
                    alt="Chat screenshot"
                    className="rounded-lg border"
                  />
                </Card>
              </div>

              {/* AI Response */}
              <div className="flex gap-3">
                <div className="flex-none p-2 h-fit rounded-lg bg-primary/10">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <Card className="flex-1 p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Kết quả phân tích</h3>
                    <RiskBadge score={analysis.confidenceScore} />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      {getRiskIcon(analysis.confidenceScore)}
                      <div className="flex-1">
                        <p className="text-sm font-medium mb-1">Tóm tắt</p>
                        <p className="text-sm text-muted-foreground">{analysis.summary}</p>
                      </div>
                    </div>

                    {analysis.riskType && (
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-sm font-medium mb-1">Loại rủi ro</p>
                        <p className="text-sm text-muted-foreground">{analysis.riskType}</p>
                      </div>
                    )}

                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-sm font-medium mb-1">Độ tin cậy</p>
                      <p className="text-sm text-muted-foreground">{analysis.confidenceScore}%</p>
                    </div>

                    {analysis.extractedText && (
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-sm font-medium mb-1">Nội dung tin nhắn</p>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                          {analysis.extractedText}
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        {analyses.length > 0 && !previewUrl && (
          <div className="flex-none border-t py-4">
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="w-full gap-2"
            >
              <Upload className="h-4 w-4" />
              Phân tích ảnh khác
            </Button>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </DashboardLayout>
  );
}

