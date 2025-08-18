"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postSendMessage = postSendMessage;
exports.postSendMultiple = postSendMultiple;
const messaging_service_1 = require("./messaging.service");
/**
 * POST /send - 단건 메시지 발송
 */
function postSendMessage(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield (0, messaging_service_1.sendMessage)(req.body);
            res.json({
                success: true,
                data: result,
                message: '메시지가 성공적으로 발송되었습니다.'
            });
        }
        catch (error) {
            console.error('메시지 발송 API 오류:', error);
            res.status(400).json({
                success: false,
                error: error.message || '메시지 발송 중 오류가 발생했습니다.'
            });
        }
    });
}
/**
 * POST /send/multiple - 다중 수신자 발송 (1~2명)
 */
function postSendMultiple(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const _a = req.body, { recipients } = _a, messageData = __rest(_a, ["recipients"]);
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
            const results = yield (0, messaging_service_1.sendMessageToMultiple)(recipients, messageData);
            res.json({
                success: true,
                data: results,
                message: `${recipients.length}명에게 발송 완료`
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error.message || '다중 발송 중 오류가 발생했습니다.'
            });
        }
    });
}
