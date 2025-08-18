"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canSendMessage = exports.isQuietHours = void 0;
/**
 * 야간 시간대 체크 (21:00 ~ 08:00)
 * 광고성 메시지 발송 제한 시간
 */
const isQuietHours = (date = new Date()) => {
    const hour = date.getHours();
    return hour >= 21 || hour < 8;
};
exports.isQuietHours = isQuietHours;
/**
 * 발송 허용 시간 체크
 */
const canSendMessage = (isAdvertisement = false, date = new Date()) => {
    if (isAdvertisement && (0, exports.isQuietHours)(date)) {
        return false;
    }
    return true;
};
exports.canSendMessage = canSendMessage;
