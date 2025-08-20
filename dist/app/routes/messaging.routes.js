"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const messaging_controller_1 = require("../../features/messaging/messaging.controller");
const router = (0, express_1.Router)();
// 단건 발송
router.post('/send', messaging_controller_1.postSendMessage);
// 다중 발송 (1~2명)
router.post('/send/multiple', messaging_controller_1.postSendMultiple);
exports.default = router;
