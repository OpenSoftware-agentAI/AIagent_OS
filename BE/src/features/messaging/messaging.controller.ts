
//BE/src/features/messaging/messaging.controller.ts

import { Request, Response } from 'express';
import { sendMessage, sendMessageToMultiple } from './messaging.service';

/**
 * POST /send - 단건 메시지 발송
 */
export async function postSendMessage(req: Request, res: Response) {
  try {
    const result = await sendMessage(req.body);
    res.json({
      success: true,
      data: result,
      message: '메시지가 성공적으로 발송되었습니다.'
    });
  } catch (error: any) {
    console.error('메시지 발송 API 오류:', error);
    res.status(400).json({
      success: false,
      error: error.message || '메시지 발송 중 오류가 발생했습니다.'
    });
  }
}

/**
 * POST /send/multiple - 다중 수신자 발송 (1~2명)
 */
export async function postSendMultiple(req: Request, res: Response) {
  try {
    const { recipients, ...messageData } = req.body;
    
    if (!Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({
        success: false,
        error: '수신자 목록이 필요합니다.'
      });
    }
    
    if (recipients.length > 2) {
      return res.status(400).json({
        success: false,
        error: '최대 2명까지만 발송 가능합니다.'
      });
    }
    
    const results = await sendMessageToMultiple(recipients, messageData);
    
    res.json({
      success: true,
      data: results,
      message: `${recipients.length}명에게 발송 완료`
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || '다중 발송 중 오류가 발생했습니다.'
    });
  }
}