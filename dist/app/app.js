"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
// src/app/app.ts
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const body_parser_1 = __importDefault(require("body-parser"));
const kakaoChatbot_routes_1 = __importDefault(require("./routes/kakaoChatbot.routes"));
// import indexRoutes from './routes/index'; // 사용 안 함: 제거
const messaging_routes_1 = __importDefault(require("./routes/messaging.routes"));
const dlr_webhook_1 = require("./routes/dlr.webhook"); // default가 아닌 named import
function createApp() {
    const app = (0, express_1.default)();
    app.use(body_parser_1.default.json({ limit: '5mb' }));
    app.use(body_parser_1.default.urlencoded({ extended: true }));
    // 정적 파일: 서버가 생성한 파일을 다운로드로 제공
    app.use('/downloads', express_1.default.static(path_1.default.join(__dirname, '../../generated')));
    // 헬스체크
    app.get('/health', (_, res) => {
        res.json({ status: 'OK', at: new Date().toISOString() });
    });
    // 라우트
    // app.use('/', indexRoutes); // 제거
    app.use('/kakao', kakaoChatbot_routes_1.default);
    app.use('/api', messaging_routes_1.default);
    app.use('/', dlr_webhook_1.dlrRouter); // dlrRouter가 내부에서 /callbacks/dlr 경로를 가짐
    // 404 핸들러(간단)
    app.use((req, res) => {
        res.status(404).json({ error: 'Not Found' });
    });
    return app;
}
