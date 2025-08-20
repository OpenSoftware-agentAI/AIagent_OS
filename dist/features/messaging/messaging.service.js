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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = sendMessage;
exports.sendMessageToMultiple = sendMessageToMultiple;
const phone_1 = require("../../utils/phone");
const time_1 = require("../../utils/time");
const sender_1 = require("../../adapters/solapi/sender");
/**
 * 메시지 발송 비즈니스 로직
 * - 번호 형식 검증
 * - 야간 발송 제한 확인
 * - SMS/LMS/MMS 자동 분기
 */
function sendMessage(request) {
    return __awaiter(this, void 0, void 0, function* () {
        const { to, text, subject, imageFilePath, isAdvertisement = false, allowNightSend = false } = request;
        // 1. 수신번호 검증
        if (!(0, phone_1.isValidKRMobile)(to)) {
            throw new Error('유효하지 않은 휴대폰 번호입니다. (010XXXXXXXX 형식 필요)');
        }
        // 2. 메시지 내용 검증
        if (!(text === null || text === void 0 ? void 0 : text.trim())) {
            throw new Error('메시지 내용이 비어있습니다.');
        }
        // 3. 야간 발송 제한 확인
        if (!allowNightSend && !(0, time_1.canSendMessage)(isAdvertisement)) {
            throw new Error('야간 시간대(21:00~08:00)에는 광고성 메시지 발송이 제한됩니다.');
        }
        // 4. 메시지 타입별 발송
        try {
            if (imageFilePath === null || imageFilePath === void 0 ? void 0 : imageFilePath.trim()) {
                // MMS 발송
                return yield (0, sender_1.sendMms)({ to, text, subject, imageFilePath });
            }
            else {
                // SMS/LMS 발송
                return yield (0, sender_1.sendText)({ to, text, subject });
            }
        }
        catch (error) {
            console.error('메시지 발송 중 오류:', error);
            throw new Error(`메시지 발송 실패: ${error.message || '알 수 없는 오류'}`);
        }
    });
}
/**
 * 다중 수신자에게 개별 발송 (1~2명 대상)
 */
function sendMessageToMultiple(recipients, messageData) {
    return __awaiter(this, void 0, void 0, function* () {
        const results = [];
        for (const to of recipients) {
            try {
                const result = yield sendMessage(Object.assign(Object.assign({}, messageData), { to }));
                results.push({ to, success: true, result });
            }
            catch (error) {
                results.push({ to, success: false, error: error.message });
            }
        }
        return results;
    });
}
