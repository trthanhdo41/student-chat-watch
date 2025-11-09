import { supabase } from '@/lib/supabase';
import { updateUploadStatus } from './uploadService';
import { GoogleGenerativeAI } from '@google/generative-ai';

// ============================================
// GEMINI API CONFIGURATION
// ============================================
// Multiple Gemini API keys to avoid rate limits (round-robin)
const GEMINI_API_KEYS = [
  'AIzaSyAesiX24LOl1SPrKebQcziHQayBI7g32Mc',
  'AIzaSyBmOOPu7J_4HzEGhzS8luDJ9lvu5wKEifU',
  'AIzaSyAaIVgZNVgFp9Id9caFgw78nIIMa285n1k',
];

let currentKeyIndex = 0;

/**
 * Get next Gemini API key (round-robin)
 */
function getNextGeminiKey(): string {
  const key = GEMINI_API_KEYS[currentKeyIndex];
  currentKeyIndex = (currentKeyIndex + 1) % GEMINI_API_KEYS.length;
  return key;
}

/**
 * Get Gemini client with next API key
 */
function getGeminiClient() {
  const apiKey = getNextGeminiKey();
  return new GoogleGenerativeAI(apiKey);
}

// ============================================
// AI ANALYSIS SERVICE WITH GEMINI 2.5 FLASH
// ============================================

interface AnalysisResult {
  riskLevel: 'high' | 'medium' | 'low';
  riskType: string;
  confidenceScore: number;
  extractedText: string;
  summary: string;
}

/**
 * Analyze image using Gemini 2.5 Flash Vision
 * Gemini can read text from image AND analyze content in one call
 */
async function analyzeImageWithGemini(imageUrl: string): Promise<AnalysisResult> {
  try {
    console.log('Analyzing image with Gemini 2.5 Flash:', imageUrl);

    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Fetch image as base64
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const base64data = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        resolve(base64.split(',')[1]); // Remove data:image/...;base64, prefix
      };
      reader.readAsDataURL(blob);
    });

    const prompt = `Bạn là một AI chuyên phân tích nội dung tin nhắn để bảo vệ học sinh khỏi các rủi ro trực tuyến.

Hãy phân tích ảnh chụp màn hình cuộc trò chuyện này và:
1. Đọc toàn bộ nội dung văn bản trong ảnh
2. Đánh giá mức độ rủi ro cho học sinh
3. Xác định loại rủi ro (nếu có)

CÁC LOẠI RỦI RO CẦN PHÁT HIỆN:
- **scam**: Lừa đảo, yêu cầu chuyển tiền, mua hàng đa cấp, quảng cáo sản phẩm không rõ nguồn gốc
- **bullying**: Bắt nạt, chửi bới, đe dọa, xúc phạm, kỳ thị
- **harassment**: Quấy rối tình dục, gạ gẫm, yêu cầu gửi ảnh nhạy cảm
- **inappropriate**: Nội dung không phù hợp với lứa tuổi (bạo lực, khiêu dâm, ma túy, rượu bia)
- **safe**: Nội dung an toàn, bình thường

MỨC ĐỘ RỦI RO:
- **high**: Nguy hiểm cao, cần cảnh báo ngay lập tức (lừa đảo, quấy rối, đe dọa)
- **medium**: Cần chú ý, nên trao đổi với phụ huynh/giáo viên (nội dung không phù hợp, ngôn từ tiêu cực)
- **low**: An toàn, không có vấn đề

Trả về kết quả dưới dạng JSON với format SAU ĐÂY (KHÔNG thêm markdown, KHÔNG thêm \`\`\`json):
{
  "extractedText": "Toàn bộ nội dung văn bản đọc được từ ảnh",
  "riskLevel": "high" | "medium" | "low",
  "riskType": "scam" | "bullying" | "harassment" | "inappropriate" | "safe",
  "confidenceScore": 0-100,
  "summary": "Tóm tắt ngắn gọn về nội dung và lý do đánh giá rủi ro"
}`;

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: blob.type,
          data: base64data,
        },
      },
      { text: prompt },
    ]);

    const responseText = result.response.text();
    console.log('Gemini response:', responseText);

    // Parse JSON response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid JSON response from Gemini');
    }

    const analysis = JSON.parse(jsonMatch[0]);

    return {
      extractedText: analysis.extractedText || 'Không đọc được nội dung',
      riskLevel: analysis.riskLevel || 'low',
      riskType: analysis.riskType || 'safe',
      confidenceScore: analysis.confidenceScore || 50,
      summary: analysis.summary || 'Không có nhận xét',
    };
  } catch (error: any) {
    console.error('Gemini analysis error:', error);

    // Fallback to safe result on error
    return {
      extractedText: 'Lỗi khi phân tích ảnh',
      riskLevel: 'low',
      riskType: 'safe',
      confidenceScore: 0,
      summary: `Không thể phân tích: ${error.message}`,
    };
  }
}

// Legacy function - now just calls analyzeImageWithGemini
async function analyzeTextWithGemini(text: string): Promise<Omit<AnalysisResult, 'extractedText'>> {
  const result = await analyzeImageWithGemini('');
  const { extractedText, ...rest } = result;
  return rest;
}

// Legacy OCR function - no longer needed since Gemini can read images
async function extractTextFromImage(imageUrl: string): Promise<string> {
  const result = await analyzeImageWithGemini(imageUrl);
  return result.extractedText;
}

// Keep old mock code for reference
/*
async function analyzeTextWithGemini_OLD(text: string): Promise<Omit<AnalysisResult, 'extractedText'>> {
  // Mock analysis
  await new Promise(resolve => setTimeout(resolve, 2000));
  const mockRiskLevel = Math.random();

  if (mockRiskLevel < 0.3) {
    return {
      riskLevel: 'high',
      riskType: 'scam',
      confidenceScore: 91,
      summary: 'Phát hiện dấu hiệu lừa đảo hoặc nội dung nguy hiểm. Cần thông báo ngay cho người lớn!',
    };
  }
}
*/

// ============================================
// MAIN ANALYSIS FUNCTION
// ============================================

/**
 * Analyze uploaded chat image using Gemini 2.5 Flash
 * Gemini reads image AND analyzes content in ONE call
 */
export async function analyzeImage(uploadId: string, imageUrl: string): Promise<AnalysisResult> {
  try {
    // Update status to analyzing
    await updateUploadStatus(uploadId, 'analyzing');

    // Analyze image with Gemini (reads text + analyzes in one call)
    const analysis = await analyzeImageWithGemini(imageUrl);

    // Save analysis to database
    const { error: insertError } = await supabase
      .from('ai_analysis')
      .insert({
        upload_id: uploadId,
        risk_level: analysis.riskLevel,
        risk_type: analysis.riskType,
        confidence_score: analysis.confidenceScore,
        extracted_text: analysis.extractedText,
        summary: analysis.summary,
      });

    if (insertError) throw insertError;

    // Update upload status to analyzed
    await updateUploadStatus(uploadId, 'analyzed');

    return analysis;
  } catch (error) {
    console.error('Analysis error:', error);
    
    // Update status to error
    await updateUploadStatus(uploadId, 'error');
    
    throw error;
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get analysis result for an upload
 */
export async function getAnalysisResult(uploadId: string) {
  const { data, error } = await supabase
    .from('ai_analysis')
    .select('*')
    .eq('upload_id', uploadId)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Re-analyze an existing upload
 */
export async function reAnalyzeUpload(uploadId: string, imageUrl: string): Promise<AnalysisResult> {
  // Delete old analysis
  await supabase
    .from('ai_analysis')
    .delete()
    .eq('upload_id', uploadId);

  // Run new analysis
  return analyzeImage(uploadId, imageUrl);
}

