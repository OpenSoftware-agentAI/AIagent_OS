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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendText = sendText;
exports.sendMms = sendMms;
const client_1 = require("./client");
const env_1 = require("../../config/env");
const phone_1 = require("../../utils/phone");
const path_1 = __importDefault(require("path"));
/**
 * SMS/LMS 단건 발송
 * - 45자 이하 또는 subject 없음: SMS
 * - 45자 초과 또는 subject 있음: LMS
 */
function sendText(_a) {
    return __awaiter(this, arguments, void 0, function* ({ to, text, subject }) {
        const normalizedTo = (0, phone_1.normalizePhone)(to);
        const payload = {
            to: normalizedTo,
            from: env_1.ENV.SOLAPI_FROM,
            text: text.trim(),
        };
        // subject가 있으면 LMS로 전환
        if (subject === null || subject === void 0 ? void 0 : subject.trim()) {
            payload.subject = subject.trim();
        }
        console.log(`SMS/LMS 발송 시도: ${(0, phone_1.maskPhone)(normalizedTo)}`);
        try {
            const result = yield client_1.messageService.send(payload);
            // SOLAPI SDK의 실제 응답 구조에 맞는 안전한 접근
            const responseInfo = {
                groupId: result.groupId || 'N/A',
                messageCount: result.messageCount || 0,
                accountId: result.accountId || 'N/A'
            };
            console.log(`발송 성공 - groupId: ${responseInfo.groupId}, 건수: ${responseInfo.messageCount}`);
            return Object.assign(Object.assign({ success: true }, responseInfo), { originalResponse: result });
        }
        catch (error) {
            console.error(`발송 실패:`, error);
            throw error;
        }
    });
}
/**
 * MMS 단건 발송 (이미지 포함)
 */
function sendMms(_a) {
    return __awaiter(this, arguments, void 0, function* ({ to, text, subject, imageFilePath }) {
        const normalizedTo = (0, phone_1.normalizePhone)(to);
        // 이미지 파일 업로드
        const absolutePath = path_1.default.isAbsolute(imageFilePath)
            ? imageFilePath
            : path_1.default.join(process.cwd(), imageFilePath);
        console.log(`이미지 업로드 중: ${absolutePath}`);
        try {
            // 파일 업로드 후 fileId 획득
            const uploadResult = yield client_1.messageService.uploadFile(absolutePath, 'MMS');
            const fileId = uploadResult.fileId;
            const payload = {
                to: normalizedTo,
                from: env_1.ENV.SOLAPI_FROM,
                text: text.trim(),
                imageId: fileId,
            };
            if (subject === null || subject === void 0 ? void 0 : subject.trim()) {
                payload.subject = subject.trim();
            }
            console.log(`MMS 발송 시도: ${(0, phone_1.maskPhone)(normalizedTo)}`);
            const result = yield client_1.messageService.send(payload);
            // SOLAPI SDK의 실제 응답 구조에 맞는 안전한 접근
            const responseInfo = {
                groupId: result.groupId || 'N/A',
                messageCount: result.messageCount || 0,
                accountId: result.accountId || 'N/A'
            };
            console.log(`MMS 발송 성공 - groupId: ${responseInfo.groupId}, 건수: ${responseInfo.messageCount}`);
            return Object.assign(Object.assign({ success: true, fileId }, responseInfo), { originalResponse: result });
        }
        catch (error) {
            console.error(`MMS 발송 실패:`, error);
            throw error;
        }
    });
}
