import { sendMessage as sendSingleSms } from '../features/messaging/messaging.service';


// Agentica가 이해할 수 있는 형태로 도구 정의
export class SmsTool {
  /**
   * 사용자에게 단일 SMS 메시지를 보냅니다.
   * @param to 수신자의 전화번호 (예: 010-1234-5678)
   * @param text 메시지 내용
   * @param subject 메시지 제목 (LMS용, 선택 사항)
   * @param isAdvertisement 광고성 메시지 여부 (야간 발송 제한 등에 영향)
   * @returns 전송 결과 (성공 여부, group ID 등)
   */
  async sendSms({ to, text, subject, isAdvertisement }: { to: string; text: string; subject?: string; isAdvertisement?: boolean }) {
    try {
      const result = await sendSingleSms({ to, text, subject, isAdvertisement });
      return { success: true, message: "SMS 발송 성공", data: result };
    } catch (error: any) {
      return { success: false, message: `SMS 발송 실패: ${error.message}` };
    }
  }

  // 필요하다면 다중 발송 도구도 추가
  // async sendBulkSms({ recipients, text, subject, isAdvertisement }: { recipients: string[]; text: string; subject?: string; isAdvertisement?: boolean }) { ... }
}