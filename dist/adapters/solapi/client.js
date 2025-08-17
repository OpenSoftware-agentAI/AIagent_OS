"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageService = void 0;
const solapi_1 = require("solapi");
const env_1 = require("../../config/env");
// SOLAPI 메시지 서비스 인스턴스 생성 (싱글톤)
exports.messageService = new solapi_1.SolapiMessageService(env_1.ENV.SOLAPI_API_KEY, env_1.ENV.SOLAPI_API_SECRET);
console.log('SOLAPI 클라이언트 초기화 완료');
