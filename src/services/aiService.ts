import { supabase } from '@/lib/supabase';
import { updateUploadStatus } from './uploadService';

// ============================================
// GEMINI API CONFIGURATION
// ============================================
// TODO: Bạn sẽ thêm multiple Gemini API keys vào đây
const GEMINI_API_KEYS = [
  // 'YOUR_GEMINI_API_KEY_1',
  // 'YOUR_GEMINI_API_KEY_2',
  // 'YOUR_GEMINI_API_KEY_3',
  // Add more keys to avoid rate limits
];

let currentKeyIndex = 0;

/**
 * Get next Gemini API key (round-robin)
 */
function getNextGeminiKey(): string {
  if (GEMINI_API_KEYS.length === 0) {
    throw new Error('No Gemini API keys configured');
  }
  const key = GEMINI_API_KEYS[currentKeyIndex];
  currentKeyIndex = (currentKeyIndex + 1) % GEMINI_API_KEYS.length;
  return key;
}

// ============================================
// OCR SERVICE
// ============================================

/**
 * Extract text from image using OCR
 * TODO: Integrate with Tesseract.js or Google Vision API
 */
async function extractTextFromImage(imageUrl: string): Promise<string> {
  // PLACEHOLDER: Replace with real OCR implementation
  console.log('Extracting text from:', imageUrl);
  
  // Mock OCR result for now
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return `[Mock OCR] Đây là nội dung tin nhắn được trích xuất từ ảnh.
Ví dụ: "Chào bạn, bạn có muốn mua sản phẩm này không?"
Hoặc: "Gửi tiền cho tôi ngay, không thì tôi sẽ..."`;
}

// ============================================
// AI ANALYSIS SERVICE
// ============================================

interface AnalysisResult {
  riskLevel: 'high' | 'medium' | 'low';
  riskType: string;
  confidenceScore: number;
  extractedText: string;
  summary: string;
}

/**
 * Analyze text content using Gemini AI
 * TODO: Integrate with Google Gemini API
 */
async function analyzeTextWithGemini(text: string): Promise<Omit<AnalysisResult, 'extractedText'>> {
  // PLACEHOLDER: Replace with real Gemini API call
  console.log('Analyzing text with Gemini:', text);
  
  // Get next API key (when you add real keys)
  // const apiKey = getNextGeminiKey();
  
  // TODO: Call Gemini API here
  // const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({
  //     contents: [{
  //       parts: [{
  //         text: `Phân tích nội dung tin nhắn sau và đánh giá mức độ rủi ro cho học sinh:
  //         
  //         "${text}"
  //         
  //         Trả về JSON với format:
  //         {
  //           "riskLevel": "high" | "medium" | "low",
  //           "riskType": "scam" | "bullying" | "harassment" | "inappropriate" | "safe",
  //           "confidenceScore": 0-100,
  //           "summary": "Tóm tắt ngắn gọn về nội dung và lý do đánh giá"
  //         }`
  //       }]
  //     }]
  //   })
  // });
  
  // Mock analysis for now
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Simulate different risk levels
  const mockRiskLevel = Math.random();
  
  if (mockRiskLevel < 0.3) {
    return {
      riskLevel: 'low',
      riskType: 'safe',
      confidenceScore: 85,
      summary: 'Nội dung tin nhắn an toàn, không phát hiện dấu hiệu nguy hiểm.',
    };
  } else if (mockRiskLevel < 0.7) {
    return {
      riskLevel: 'medium',
      riskType: 'inappropriate',
      confidenceScore: 72,
      summary: 'Phát hiện một số nội dung cần chú ý. Nên trao đổi với phụ huynh hoặc giáo viên.',
    };
  } else {
    return {
      riskLevel: 'high',
      riskType: 'scam',
      confidenceScore: 91,
      summary: 'Phát hiện dấu hiệu lừa đảo hoặc nội dung nguy hiểm. Cần thông báo ngay cho người lớn!',
    };
  }
}

// ============================================
// MAIN ANALYSIS FUNCTION
// ============================================

/**
 * Analyze uploaded chat image
 * 1. Extract text using OCR
 * 2. Analyze text using Gemini AI
 * 3. Save results to database
 */
export async function analyzeImage(uploadId: string, imageUrl: string): Promise<AnalysisResult> {
  try {
    // Update status to analyzing
    await updateUploadStatus(uploadId, 'analyzing');

    // Step 1: Extract text from image
    const extractedText = await extractTextFromImage(imageUrl);

    // Step 2: Analyze text with AI
    const analysis = await analyzeTextWithGemini(extractedText);

    // Step 3: Save analysis to database
    const { error: insertError } = await supabase
      .from('ai_analysis')
      .insert({
        upload_id: uploadId,
        risk_level: analysis.riskLevel,
        risk_type: analysis.riskType,
        confidence_score: analysis.confidenceScore,
        extracted_text: extractedText,
        summary: analysis.summary,
      });

    if (insertError) throw insertError;

    // Update upload status to analyzed
    await updateUploadStatus(uploadId, 'analyzed');

    return {
      ...analysis,
      extractedText,
    };
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

