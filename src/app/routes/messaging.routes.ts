import { Router } from 'express';
import { postSendMessage, postSendMultiple } from '../../features/messaging/messaging.controller';

const router = Router();

// 단건 발송
router.post('/send', postSendMessage);

// 다중 발송 (1~2명)
router.post('/send/multiple', postSendMultiple);

export default router;