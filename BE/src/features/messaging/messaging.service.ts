
//BE/src/features/messaging/messaging.service.ts

import { isValidKRMobile } from '../../utils/phone';
import { canSendMessage } from '../../utils/time';
import { sendText, sendMms } from '../../adapters/solapi/sender';

export type MessageRequest = {
  to: string;
  text: string;
  subject?: string;
  imageFilePath?: string;
  isAdvertisement?: boolean;
  allowNightSend?: boolean;
};

/**
 * 메시지 발송 비즈니스 로직
 * - 번호 형식 검증
 * - 야간 발송 제한 확인
 * - SMS/LMS/MMS 자동 분기
 */
export async function sendMessage(request: MessageRequest) {
  const { to, text, subject, imageFilePath, isAdvertisement = false, allowNightSend = false } = request;
  
  // 1. 수신번호 검증
  if (!isValidKRMobile(to)) {
    throw new Error('유효하지 않은 휴대폰 번호입니다. (010XXXXXXXX 형식 필요)');
  }
  
  // 2. 메시지 내용 검증
  if (!text?.trim()) {
    throw new Error('메시지 내용이 비어있습니다.');
  }
  
  // 3. 야간 발송 제한 확인
  if (!allowNightSend && !canSendMessage(isAdvertisement)) {
    throw new Error('야간 시간대(21:00~08:00)에는 광고성 메시지 발송이 제한됩니다.');
  }
  
  // 4. 메시지 타입별 발송
  try {
    if (imageFilePath?.trim()) {
      // MMS 발송
      return await sendMms({ to, text, subject, imageFilePath });
    } else {
      // SMS/LMS 발송
      return await sendText({ to, text, subject });
    }
  } catch (error: any) {
    console.error('메시지 발송 중 오류:', error);
    throw new Error(`메시지 발송 실패: ${error.message || '알 수 없는 오류'}`);
  }
}

/**
 * 다중 수신자에게 개별 발송 (1~2명 대상)
 */
export async function sendMessageToMultiple(
  recipients: string[],
  messageData: Omit<MessageRequest, 'to'>
) {
  const results = [];
  
  for (const to of recipients) {
    try {
      const result = await sendMessage({ ...messageData, to });
      results.push({ to, success: true, result });
    } catch (error: any) {
      results.push({ to, success: false, error: error.message });
    }
  }
  
  return results;
}