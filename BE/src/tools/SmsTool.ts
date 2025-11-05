
//BE/src/tools/SmsTool.ts

import {
  sendMessage,
  sendMessageToMultiple,
  MessageRequest,
} from "../features/messaging/messaging.service";
import fs from "fs";
import path from "path";
import { messageService } from "../adapters/solapi/client"; // SOLAPI 클라이언트 추가
import sharp from 'sharp';

/**
 * 학원 데스크용 종합 메시징 도구
 * SMS, LMS, MMS(이미지), 다중 발송을 모두 지원합니다.
 */
export class SmsTool {
  /**
   * 단일 SMS 메시지를 보냅니다. (90바이트 이하, 한글 45자 이하)
   * @param to 수신자의 전화번호 (예: 010-1234-5678)
   * @param text 메시지 내용 (45자 이하 권장)
   * @param isAdvertisement 광고성 메시지 여부 (기본값: false)
   * @param allowNightSend 야간 발송 허용 여부 (기본값: false)
   * @returns 전송 결과
   */
  async sendSms({
    to,
    text,
    isAdvertisement = false,
    allowNightSend = false,
  }: {
    to: string;
    text: string;
    isAdvertisement?: boolean;
    allowNightSend?: boolean;
  }) {
    try {
      const result = await sendMessage({
        to,
        text,
        isAdvertisement,
        allowNightSend,
      });
      return {
        success: true,
        message: `SMS 발송 성공 (${to})`,
        data: result,
      };
    } catch (error: any) {
      return {
        success: false,
        message: `SMS 발송 실패: ${error.message}`,
      };
    }
  }

  /**
   * LMS(장문 메시지)를 보냅니다. (2000바이트 이하, 한글 1000자 이하)
   * @param to 수신자의 전화번호
   * @param text 긴 메시지 내용 (45자 초과 시 자동으로 LMS로 전송됨)
   * @param subject 메시지 제목 (LMS 전용, 선택사항)
   * @param isAdvertisement 광고성 메시지 여부 (기본값: false)
   * @param allowNightSend 야간 발송 허용 여부 (기본값: false)
   * @returns 전송 결과
   */
  async sendLms({
    to,
    text,
    subject = undefined,
    isAdvertisement = false,
    allowNightSend = false,
  }: {
    to: string;
    text: string;
    subject?: string;
    isAdvertisement?: boolean;
    allowNightSend?: boolean;
  }) {
    try {
      // subject null 방지
      const validSubject = subject === null ? undefined : subject;

      const result = await sendMessage({
        to,
        text,
        subject: validSubject,
        isAdvertisement,
        allowNightSend,
      });
      return {
        success: true,
        message: `LMS 발송 성공 (${to})`,
        data: result,
      };
    } catch (error: any) {
      return {
        success: false,
        message: `LMS 발송 실패: ${error.message}`,
      };
    }
  }

  
/**
 * 이미지를 200KB 이하로 자동 압축
 */
private async compressImage(imagePath: string): Promise<string> {
  const stats = fs.statSync(imagePath);
  const fileSizeKB = stats.size / 1024;
  
  // 이미 200KB 이하면 그대로 반환
  if (stats.size <= 204800) {
    console.log(`✅ 이미지가 이미 200KB 이하입니다 (${fileSizeKB.toFixed(2)}KB)`);
    return imagePath;
  }
  
  console.log(`🔄 이미지 압축 시작 (${fileSizeKB.toFixed(2)}KB → 200KB 이하)`);
  
  // 압축된 파일 경로 생성
  const ext = path.extname(imagePath);
  const compressedPath = imagePath.replace(ext, `_compressed${ext}`);
  
  // Sharp로 압축
  let quality = 80; // 초기 품질
  
  while (quality > 10) {
    await sharp(imagePath)
      .resize(1024, 1024, { // 최대 1024x1024로 리사이즈
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: quality }) // JPEG로 압축
      .toFile(compressedPath);
    
    const compressedStats = fs.statSync(compressedPath);
    const compressedSizeKB = compressedStats.size / 1024;
    
    if (compressedStats.size <= 204800) {
      console.log(`✅ 압축 성공! ${fileSizeKB.toFixed(2)}KB → ${compressedSizeKB.toFixed(2)}KB (품질: ${quality})`);
      return compressedPath;
    }
    
    // 품질 낮춰서 재시도
    quality -= 10;
  }
  
  throw new Error('이미지를 200KB 이하로 압축할 수 없습니다.');
}

/**
 * 이미지를 SOLAPI에 업로드 (자동 압축 포함)
 */
private async uploadImageToSolapi(imagePath: string): Promise<string> {
  try {
    // 절대 경로 변환
    let absolutePath = imagePath;
    if (!path.isAbsolute(imagePath)) {
      absolutePath = path.join(process.cwd(), imagePath);
    }
    
    // 파일 존재 확인
    if (!fs.existsSync(absolutePath)) {
      throw new Error(`이미지 파일을 찾을 수 없습니다: ${absolutePath}`);
    }
    
    // ⭐ 자동 압축
    const compressedPath = await this.compressImage(absolutePath);
    
    // SOLAPI 업로드
    console.log(`📤 이미지 업로드 중: ${compressedPath}`);
    const uploadResult = await messageService.uploadFile(compressedPath, "MMS");
    
    // 압축된 파일 삭제 (원본과 다른 경우)
    if (compressedPath !== absolutePath) {
      fs.unlinkSync(compressedPath);
      console.log(`🗑️ 압축 임시 파일 삭제: ${compressedPath}`);
    }
    
    return uploadResult.fileId;
    
  } catch (error: any) {
    throw new Error(`이미지 업로드 실패: ${error.message}`);
  }
}

  /**
   * 이미지와 함께 메시지를 보냅니다 (MMS) - SOLAPI 업로드 방식 사용
   * 이미지와 텍스트를 함께보내야 성공적으로 메세지가 전송됩니다.
   */
  async sendImageMessage({
    to,
    text,
    imageFilePath,
    subject = undefined,
    isAdvertisement = false,
    allowNightSend = false,
  }: {
    to: string;
    text: string;
    imageFilePath: string;
    subject?: string | undefined;
    isAdvertisement?: boolean;
    allowNightSend?: boolean;
  }) {
    try {
      // subject null 방지
      const validSubject = subject === null ? undefined : subject;

      // 이미지를 SOLAPI 서버에 업로드하고 imageId 받기
      const imageId = await this.uploadImageToSolapi(imageFilePath);
      console.log("이미지 업로드 성공. imageId:", imageId);

      // SOLAPI SDK를 직접 사용하여 MMS 전송
      const result = await messageService.send({
        to: to,
        from: process.env.SOLAPI_SENDER_PHONE || "01024969408", // 올바른 번호로 수정
        text: text,
        subject: validSubject,
        imageId: imageId,
      });

      console.log("SOLAPI 전송 결과:", JSON.stringify(result, null, 2));

      // failedMessageList 확인
      if (result.failedMessageList && result.failedMessageList.length > 0) {
        console.error(
          "발송 실패 메시지 목록:",
          JSON.stringify(result.failedMessageList, null, 2)
        );

        // 실패 원인 분석
        const failureReasons = result.failedMessageList.map((failed) => ({
          to: failed.to,
          statusCode: failed.statusCode,
          statusMessage: failed.statusMessage,
          messageId: failed.messageId,
        }));

        return {
          success: false,
          message: `이미지 메시지 발송 실패. 실패 원인: ${JSON.stringify(
            failureReasons
          )}`,
          data: { result, failureReasons },
        };
      }

      return {
        success: true,
        message: `이미지 메시지(MMS) 발송 성공 (${to})`,
        data: result,
      };
    } catch (error: any) {
      console.error("sendImageMessage 에러:", error);
      return {
        success: false,
        message: `이미지 메시지 발송 실패: ${error.message}`,
      };
    }
  }

  /**
   * 여러 수신자에게 동일한 메시지를 보냅니다 (다중 발송, 1~2명 권장)
   * @param recipients 수신자 전화번호 배열 (예: ["010-1234-5678", "010-9876-5432"])
   * @param text 메시지 내용
   * @param subject 메시지 제목 (LMS용, 선택사항)
   * @param imageFilePath 이미지 파일 경로 (MMS용, 선택사항)
   * @param isAdvertisement 광고성 메시지 여부 (기본값: false)
   * @param allowNightSend 야간 발송 허용 여부 (기본값: false)
   * @returns 전송 결과
   */
  async sendBulkMessage({
    recipients,
    text,
    subject = undefined,
    imageFilePath,
    isAdvertisement = false,
    allowNightSend = false,
  }: {
    recipients: string[];
    text: string;
    subject?: string;
    imageFilePath?: string;
    isAdvertisement?: boolean;
    allowNightSend?: boolean;
  }) {
    try {
      // subject null 방지
      const validSubject = subject === null ? undefined : subject;

      // 이미지가 있는 경우 SOLAPI에 업로드
      let imageId = undefined;
      if (imageFilePath) {
        imageId = await this.uploadImageToSolapi(imageFilePath);
      }

      // 다중 발송을 위해 각 수신자별로 개별 전송
      const results = [];
      for (const to of recipients) {
        try {
          let result;
          if (imageId) {
            // 이미지가 있는 경우 SOLAPI SDK 직접 사용
            result = await messageService.send({
              to,
              from: process.env.SOLAPI_SENDER_PHONE || "01024969408", // 올바른 번호로 수정
              text,
              subject: validSubject,
              imageId,
            });
          } else {
            // 이미지가 없는 경우 기존 서비스 사용
            result = await sendMessage({
              to,
              text,
              subject: validSubject,
              isAdvertisement,
              allowNightSend,
            });
          }
          results.push({ to, success: true, result });
        } catch (error: any) {
          results.push({ to, success: false, error: error.message });
        }
      }

      const successCount = results.filter((r) => r.success).length;
      const failCount = results.filter((r) => !r.success).length;

      return {
        success: true,
        message: `다중 발송 완료 - 성공: ${successCount}건, 실패: ${failCount}건`,
        data: {
          results,
          successCount,
          failCount,
          totalCount: recipients.length,
        },
      };
    } catch (error: any) {
      return {
        success: false,
        message: `다중 발송 실패: ${error.message}`,
      };
    }
  }

  /**
   * 긴급 알림 메시지를 보냅니다 (LMS, 즉시 발송, 야간 발송 허용)
   * @param to 수신자의 전화번호
   * @param text 긴급 메시지 내용
   * @param subject 긴급 알림 제목 (기본값: "긴급 알림")
   * @returns 전송 결과
   */
  async sendUrgentAlert({
    to,
    text,
    subject = "긴급 알림",
  }: {
    to: string;
    text: string;
    subject?: string;
  }) {
    try {
      const result = await sendMessage({
        to,
        text: `🚨 ${text}`, // 긴급 이모지 추가
        subject: `🚨 ${subject}`,
        isAdvertisement: false, // 긴급 알림은 광고성 아님
        allowNightSend: true, // 긴급 알림은 야간 발송 허용
      });
      return {
        success: true,
        message: `긴급 알림 발송 성공 (${to})`,
        data: result,
      };
    } catch (error: any) {
      return {
        success: false,
        message: `긴급 알림 발송 실패: ${error.message}`,
      };
    }
  }

  /**
   * 학부모 공지사항을 보냅니다 (일반적으로 LMS 사용)
   * @param to 수신자의 전화번호
   * @param title 공지사항 제목
   * @param content 공지사항 내용
   * @param isAdvertisement 광고성 메시지 여부 (기본값: false)
   * @returns 전송 결과
   */
  async sendParentNotice({
    to,
    title,
    content,
    isAdvertisement = false,
  }: {
    to: string;
    title: string;
    content: string;
    isAdvertisement?: boolean;
  }) {
    try {
      const fullMessage = `📢 ${title}\n\n${content}\n\n- 학원 안내 -`;

      const result = await sendMessage({
        to,
        text: fullMessage,
        subject: `📢 ${title}`,
        isAdvertisement,
        allowNightSend: false,
      });

      return {
        success: true,
        message: `학부모 공지 발송 성공 (${to})`,
        data: result,
      };
    } catch (error: any) {
      return {
        success: false,
        message: `학부모 공지 발송 실패: ${error.message}`,
      };
    }
  }

  /**
   * 수업 시간표나 안내 이미지와 함께 메시지를 보냅니다 - SOLAPI 업로드 방식
   * @param to 수신자의 전화번호
   * @param text 메시지 내용
   * @param imageFilePath 이미지 파일 경로 (시간표, 공지사항 이미지 등)
   * @param title 메시지 제목 (선택사항)
   * @returns 전송 결과
   */
  async sendScheduleImage({
    to,
    text,
    imageFilePath,
    title,
  }: {
    to: string;
    text: string;
    imageFilePath: string;
    title?: string;
  }) {
    try {
      // 이미지를 SOLAPI 서버에 업로드
      const imageId = await this.uploadImageToSolapi(imageFilePath);

      // SOLAPI SDK로 직접 MMS 전송
      const result = await messageService.send({
        to,
        from: process.env.SOLAPI_SENDER_PHONE || "01024969408", // 올바른 번호로 수정
        text: `📅 ${text}`,
        subject: title ? `📅 ${title}` : "학원 안내",
        imageId,
      });

      return {
        success: true,
        message: `시간표/안내 이미지 발송 성공 (${to})`,
        data: result,
      };
    } catch (error: any) {
      return {
        success: false,
        message: `시간표/안내 이미지 발송 실패: ${error.message}`,
      };
    }
  }
}
