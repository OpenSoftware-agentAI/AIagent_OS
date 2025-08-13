import { messageService } from './client';
import { ENV } from '../../config/env';
import { normalizePhone, maskPhone } from '../../utils/phone';
import path from 'path';

export type SendTextParams = {
  to: string;
  text: string;
  subject?: string;
};

export type SendMmsParams = SendTextParams & {
  imageFilePath: string;
};

/**
 * SMS/LMS 단건 발송
 * - 45자 이하 또는 subject 없음: SMS
 * - 45자 초과 또는 subject 있음: LMS
 */
export async function sendText({ to, text, subject }: SendTextParams) {
  const normalizedTo = normalizePhone(to);
  
  const payload: any = {
    to: normalizedTo,
    from: ENV.SOLAPI_FROM,
    text: text.trim(),
  };
  
  // subject가 있으면 LMS로 전환
  if (subject?.trim()) {
    payload.subject = subject.trim();
  }
  
  console.log(`SMS/LMS 발송 시도: ${maskPhone(normalizedTo)}`);
  
  try {
    const result = await messageService.send(payload);
    
    // SOLAPI SDK의 실제 응답 구조에 맞는 안전한 접근
    const responseInfo = {
      groupId: (result as any).groupId || 'N/A',
      messageCount: (result as any).messageCount || 0,
      accountId: (result as any).accountId || 'N/A'
    };
    
    console.log(`발송 성공 - groupId: ${responseInfo.groupId}, 건수: ${responseInfo.messageCount}`);
    
    return {
      success: true,
      ...responseInfo,
      originalResponse: result
    };
  } catch (error) {
    console.error(`발송 실패:`, error);
    throw error;
  }
}

/**
 * MMS 단건 발송 (이미지 포함)
 */
export async function sendMms({ to, text, subject, imageFilePath }: SendMmsParams) {
  const normalizedTo = normalizePhone(to);
  
  // 이미지 파일 업로드
  const absolutePath = path.isAbsolute(imageFilePath)
    ? imageFilePath
    : path.join(process.cwd(), imageFilePath);
    
  console.log(`이미지 업로드 중: ${absolutePath}`);
  
  try {
    // 파일 업로드 후 fileId 획득
    const uploadResult = await messageService.uploadFile(absolutePath, 'MMS');
    const fileId = (uploadResult as any).fileId;
    
    const payload: any = {
      to: normalizedTo,
      from: ENV.SOLAPI_FROM,
      text: text.trim(),
      imageId: fileId,
    };
    
    if (subject?.trim()) {
      payload.subject = subject.trim();
    }
    
    console.log(`MMS 발송 시도: ${maskPhone(normalizedTo)}`);
    
    const result = await messageService.send(payload);
    
    // SOLAPI SDK의 실제 응답 구조에 맞는 안전한 접근
    const responseInfo = {
      groupId: (result as any).groupId || 'N/A',
      messageCount: (result as any).messageCount || 0,
      accountId: (result as any).accountId || 'N/A'
    };
    
    console.log(`MMS 발송 성공 - groupId: ${responseInfo.groupId}, 건수: ${responseInfo.messageCount}`);
    
    return {
      success: true,
      fileId,
      ...responseInfo,
      originalResponse: result
    };
    
  } catch (error) {
    console.error(`MMS 발송 실패:`, error);
    throw error;
  }
}
