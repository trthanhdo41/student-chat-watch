import { supabase } from '@/lib/supabase';

// N8N Webhook URL from environment variable
const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL;

interface AlertData {
  studentName: string;
  studentClass: string;
  riskLevel: 'high' | 'medium' | 'low';
  riskType: string;
  confidenceScore: number;
  extractedText: string;
  summary: string;
  imageUrl: string;
  timestamp: string;
  parentPhone?: string;
  teacherPhone?: string;
}

/**
 * Determine if alert should be sent based on risk level
 */
export function shouldSendAlert(riskLevel: string): boolean {
  return riskLevel === 'high' || riskLevel === 'medium';
}

/**
 * Send alert to N8N webhook for Zalo notification
 */
export async function sendAlertToN8n(alertData: AlertData): Promise<boolean> {
  if (!N8N_WEBHOOK_URL) {
    console.warn('N8N webhook URL not configured');
    return false;
  }

  try {
    // Transform data to match N8N workflow structure
    const n8nPayload = {
      student: {
        name: alertData.studentName,
        class: alertData.studentClass,
      },
      alert: {
        riskLevel: alertData.riskLevel,
        riskType: alertData.riskType,
        confidenceScore: alertData.confidenceScore,
        timestamp: alertData.timestamp,
      },
      content: {
        extractedText: alertData.extractedText,
        summary: alertData.summary,
        imageUrl: alertData.imageUrl,
      },
      recipients: {
        parent: {
          phone: alertData.parentPhone || '',
        },
        teacher: {
          phone: alertData.teacherPhone || '',
        },
      },
    };

    console.log('Sending alert to N8N:', n8nPayload);

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(n8nPayload),
    });

    if (!response.ok) {
      throw new Error(`N8N webhook failed: ${response.status}`);
    }

    console.log('Alert sent successfully to N8N');
    return true;
  } catch (error) {
    console.error('Error sending alert to N8N:', error);
    return false;
  }
}

/**
 * Get user profile data for alert
 */
export async function getUserProfileForAlert(userId: string) {
  try {
    const { data: profile, error } = await supabase
      .from('users')
      .select('full_name, student_class, parent_phone, teacher_phone')
      .eq('id', userId)
      .single();

    if (error) throw error;

    return profile;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}
