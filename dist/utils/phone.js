"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.maskPhone = exports.isValidKRMobile = exports.normalizePhone = void 0;
/**
 * 전화번호를 010XXXXXXXX 형식으로 정규화
 */
const normalizePhone = (phone) => {
    return phone.replace(/[^\d]/g, '');
};
exports.normalizePhone = normalizePhone;
/**
 * 한국 휴대폰 번호 형식 검증
 */
const isValidKRMobile = (phone) => {
    const normalized = (0, exports.normalizePhone)(phone);
    return /^010\d{8}$/.test(normalized);
};
exports.isValidKRMobile = isValidKRMobile;
/**
 * 전화번호 마스킹 (로그용)
 */
const maskPhone = (phone) => {
    const normalized = (0, exports.normalizePhone)(phone);
    if (normalized.length >= 8) {
        return normalized.substring(0, 3) + '****' + normalized.substring(7);
    }
    return '***';
};
exports.maskPhone = maskPhone;
