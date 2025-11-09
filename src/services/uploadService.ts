import { supabase } from '@/lib/supabase';

export interface UploadResult {
  uploadId: string;
  imageUrl: string;
}

/**
 * Upload chat screenshot to Supabase Storage
 */
export async function uploadChatImage(file: File, userId: string): Promise<UploadResult> {
  try {
    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('chat-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('chat-images')
      .getPublicUrl(fileName);

    // Create record in chat_uploads table
    const { data: uploadRecord, error: dbError } = await supabase
      .from('chat_uploads')
      .insert({
        user_id: userId,
        image_url: publicUrl,
        status: 'pending',
      })
      .select()
      .single();

    if (dbError) throw dbError;

    return {
      uploadId: uploadRecord.id,
      imageUrl: publicUrl,
    };
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}

/**
 * Get all uploads for a user
 * Converts snake_case from database to camelCase for frontend
 */
export async function getUserUploads(userId: string) {
  const { data, error } = await supabase
    .from('chat_uploads')
    .select(`
      *,
      ai_analysis (*)
    `)
    .eq('user_id', userId)
    .order('uploaded_at', { ascending: false });

  if (error) throw error;

  console.log('=== RAW DATA FROM DATABASE ===');
  console.log('data:', data);
  console.log('first analysis:', data?.[0]?.ai_analysis?.[0]);

  // Convert snake_case to camelCase for ai_analysis
  // IMPORTANT: We DON'T spread the original analysis to avoid having both snake_case and camelCase
  const convertedData = data?.map(upload => ({
    ...upload,
    ai_analysis: upload.ai_analysis?.map((analysis: any) => {
      // Create a clean object with ONLY the properties we need
      const converted = {
        id: analysis.id,
        upload_id: analysis.upload_id,
        analyzed_at: analysis.analyzed_at,
        // Keep snake_case for compatibility
        risk_level: analysis.risk_level?.trim() as 'high' | 'medium' | 'low',
        risk_type: analysis.risk_type?.trim(),
        confidence_score: analysis.confidence_score,
        extracted_text: analysis.extracted_text,
        summary: analysis.summary,
        // Add camelCase versions
        riskLevel: analysis.risk_level?.trim() as 'high' | 'medium' | 'low',
        riskType: analysis.risk_type?.trim(),
        confidenceScore: analysis.confidence_score,
        extractedText: analysis.extracted_text,
      };

      console.log('=== CONVERTED ANALYSIS ===');
      console.log('original risk_level:', `"${analysis.risk_level}"`);
      console.log('original risk_type:', `"${analysis.risk_type}"`);
      console.log('converted.riskLevel:', `"${converted.riskLevel}"`);
      console.log('converted.riskType:', `"${converted.riskType}"`);
      console.log('typeof converted.riskLevel:', typeof converted.riskLevel);
      console.log('riskLevel === "low":', converted.riskLevel === 'low');
      console.log('riskLevel === "medium":', converted.riskLevel === 'medium');
      console.log('riskLevel === "high":', converted.riskLevel === 'high');

      return converted;
    })
  }));

  console.log('=== CONVERTED DATA ===');
  console.log('convertedData:', convertedData);
  console.log('first converted analysis:', convertedData?.[0]?.ai_analysis?.[0]);

  return convertedData;
}

/**
 * Delete an upload and its associated data
 */
export async function deleteUpload(uploadId: string, imageUrl: string) {
  try {
    // Extract file path from URL
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split('/');
    const fileName = pathParts.slice(-2).join('/'); // userId/timestamp.ext

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('chat-images')
      .remove([fileName]);

    if (storageError) throw storageError;

    // Delete from database (will cascade to ai_analysis)
    const { error: dbError } = await supabase
      .from('chat_uploads')
      .delete()
      .eq('id', uploadId);

    if (dbError) throw dbError;
  } catch (error) {
    console.error('Delete error:', error);
    throw error;
  }
}

/**
 * Update upload status
 */
export async function updateUploadStatus(
  uploadId: string,
  status: 'pending' | 'analyzing' | 'analyzed' | 'error'
) {
  const { error } = await supabase
    .from('chat_uploads')
    .update({ status })
    .eq('id', uploadId);

  if (error) throw error;
}

