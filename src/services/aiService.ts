import { supabase } from '@/lib/supabase';
import { updateUploadStatus } from './uploadService';
import { GoogleGenerativeAI } from '@google/generative-ai';

// ============================================
// GEMINI API CONFIGURATION
// ============================================
const GEMINI_API_KEY = 'AIzaSyDdqoEzsRTdMLZ1j8WRgDKPhL7hJg_XU80';

/**
 * Get Gemini client
 */
function getGeminiClient() {
  return new GoogleGenerativeAI(GEMINI_API_KEY);
}

// ============================================
// AI ANALYSIS SERVICE WITH GEMINI 2.0 FLASH THINKING
// ============================================

interface AnalysisResult {
  riskLevel: 'high' | 'medium' | 'low';
  riskType: string;
  confidenceScore: number;
  extractedText: string;
  summary: string;
}

/**
 * Analyze image using Gemini 2.0 Flash Thinking Exp (best for vision analysis)
 * Gemini can read text from image AND analyze content in one call
 */
async function analyzeImageWithGemini(imageUrl: string): Promise<AnalysisResult> {
  try {
    console.log('Analyzing image with Gemini 2.0 Flash Thinking:', imageUrl);

    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-thinking-exp-1219' });

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

    const prompt = `Bạn là trợ lý AI giúp bảo vệ các em học sinh tiểu học (lớp 1-5) khi chat online.

Hãy đọc ảnh tin nhắn này và cho em biết:
1. Trong ảnh có những lời nào? (đọc hết chữ trong ảnh)
2. Tin nhắn này có an toàn không?
3. Có điều gì em cần cẩn thận không?

CÁC TÌNH HUỐNG NGUY HIỂM CẦN PHÁT HIỆN:
- **lừa đảo**: Người lạ bảo em chuyển tiền, mua đồ, cho số điện thoại/địa chỉ nhà
- **bắt nạt**: Bạn chửi em, nói xấu em, đe dọa em, làm em buồn
- **người lạ xấu**: Người lớn lạ rủ em đi chơi, gặp mặt, gửi ảnh, nói chuyện kỳ lạ
- **không phù hợp**: Có hình ảnh/lời nói về đánh nhau, cảnh xấu, thuốc lá, rượu
- **an toàn**: Tin nhắn bình thường, chat với bạn bè, gia đình

QUY TẮC QUAN TRỌNG:
- Nếu tin nhắn bình thường, chat với bạn/gia đình → riskLevel = "low", riskType = "an toàn"
- Nếu có dấu hiệu lừa đảo, người lạ xấu, đe dọa → riskLevel = "high"
- Nếu có lời nói xấu, nội dung không tốt → riskLevel = "medium"
- Tin nhắn về học tập, chơi game, nói chuyện bình thường → LUÔN LÀ "low" và "an toàn"

Trả lời bằng JSON (KHÔNG thêm markdown, KHÔNG thêm \`\`\`json):
{
  "extractedText": "Ghi lại toàn bộ chữ trong ảnh",
  "riskLevel": "high" | "medium" | "low",
  "riskType": "lừa đảo" | "bắt nạt" | "người lạ xấu" | "không phù hợp" | "an toàn",
  "confidenceScore": 0-100,
  "summary": "Giải thích ngắn gọn bằng tiếng Việt đơn giản cho học sinh lớp 1-5 hiểu được"
}`;

    const geminiResult = await model.generateContent([
      {
        inlineData: {
          mimeType: blob.type,
          data: base64data,
        },
      },
      { text: prompt },
    ]);

    const responseText = geminiResult.response.text();
    console.log('Gemini response:', responseText);

    // Parse JSON response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid JSON response from Gemini');
    }

    const analysis = JSON.parse(jsonMatch[0]);

    console.log('=== RAW ANALYSIS FROM GEMINI ===');
    console.log('analysis:', analysis);
    console.log('analysis.riskLevel:', analysis.riskLevel);
    console.log('typeof analysis.riskLevel:', typeof analysis.riskLevel);

    // Validate and normalize riskLevel - TRIM whitespace and lowercase
    let riskLevel: 'high' | 'medium' | 'low' = 'low';
    const rawRiskLevel = String(analysis.riskLevel || 'low').trim().toLowerCase();

    if (rawRiskLevel === 'high') {
      riskLevel = 'high';
    } else if (rawRiskLevel === 'medium') {
      riskLevel = 'medium';
    } else {
      riskLevel = 'low';
    }

    // Ensure riskType matches riskLevel
    let riskType = String(analysis.riskType || 'an toàn').trim();
    if (riskLevel === 'low' && riskType !== 'an toàn') {
      riskType = 'an toàn'; // Force safe type for low risk
    }

    const result = {
      extractedText: analysis.extractedText || 'Không đọc được nội dung',
      riskLevel,
      riskType,
      confidenceScore: Number(analysis.confidenceScore) || 50,
      summary: analysis.summary || 'Không có nhận xét',
    };

    console.log('=== NORMALIZED RESULT ===');
    console.log('result:', result);
    console.log('result.riskLevel:', result.riskLevel);
    console.log('typeof result.riskLevel:', typeof result.riskLevel);

    return result;
  } catch (error: any) {
    console.error('Gemini analysis error:', error);

    // Throw error instead of returning fallback - let caller handle it
    throw new Error(`Gemini API Error: ${error.message || 'Unknown error'}`);
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

