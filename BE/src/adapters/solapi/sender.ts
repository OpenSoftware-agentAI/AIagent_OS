import { messageService } from "./client";
import { ENV } from "../../config/env";
import { normalizePhone, maskPhone } from "../../utils/phone";
import path from "path";

export type SendTextParams = {
  to: string;
  text: string;
  subject?: string;
};

export type SendMmsParams = SendTextParams & {
  imageFilePath: string;
};

export async function sendText({ to, text, subject }: SendTextParams) {
  const normalizedTo = normalizePhone(to);

  const payload: any = {
    to: normalizedTo,
    from: ENV.SOLAPI_FROM,
    text: text.trim(),
  };

  if (subject?.trim()) {
    payload.subject = subject.trim();
  }

  console.log(`SMS/LMS 발송 시도: ${maskPhone(normalizedTo)}`);

  try {
    const result = await messageService.send(payload);

    const responseInfo = {
      groupId: (result as any).groupId || "N/A",
      messageCount: (result as any).messageCount || 0,
      accountId: (result as any).accountId || "N/A",
    };

    console.log(
      `발송 성공 - groupId: ${responseInfo.groupId}, 건수: ${responseInfo.messageCount}`
    );

    return {
      success: true,
      ...responseInfo,
      originalResponse: result,
    };
  } catch (error) {
    console.error(`발송 실패:`, error);
    throw error;
  }
}

export async function sendMms({
  to,
  text,
  subject,
  imageFilePath,
}: SendMmsParams) {
  const normalizedTo = normalizePhone(to);

  const absolutePath = path.isAbsolute(imageFilePath)
    ? imageFilePath
    : path.join(process.cwd(), imageFilePath);

  console.log(`이미지 업로드 중: ${absolutePath}`);

  try {
    const uploadResult = await messageService.uploadFile(absolutePath, "MMS");
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

    const responseInfo = {
      groupId: (result as any).groupId || "N/A",
      messageCount: (result as any).messageCount || 0,
      accountId: (result as any).accountId || "N/A",
    };

    console.log(
      `MMS 발송 성공 - groupId: ${responseInfo.groupId}, 건수: ${responseInfo.messageCount}`
    );

    return {
      success: true,
      fileId,
      ...responseInfo,
      originalResponse: result,
    };
  } catch (error) {
    console.error(`MMS 발송 실패:`, error);
    throw error;
  }
}
