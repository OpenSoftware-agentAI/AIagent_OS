"use strict";
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENV = void 0;
require("dotenv/config");
exports.ENV = {
    SOLAPI_API_KEY: (_a = process.env.SOLAPI_API_KEY) !== null && _a !== void 0 ? _a : '',
    SOLAPI_API_SECRET: (_b = process.env.SOLAPI_API_SECRET) !== null && _b !== void 0 ? _b : '',
    SOLAPI_FROM: (_c = process.env.SOLAPI_FROM) !== null && _c !== void 0 ? _c : '',
    PORT: Number((_d = process.env.PORT) !== null && _d !== void 0 ? _d : 3000),
    NODE_ENV: (_e = process.env.NODE_ENV) !== null && _e !== void 0 ? _e : 'development',
};
// 필수 환경변수 검증
const requiredEnvs = ['SOLAPI_API_KEY', 'SOLAPI_API_SECRET', 'SOLAPI_FROM'];
for (const key of requiredEnvs) {
    if (!exports.ENV[key]) {
        throw new Error(`환경변수 누락: ${key}`);
    }
}
