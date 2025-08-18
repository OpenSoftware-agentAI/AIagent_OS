"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const messaging_routes_1 = __importDefault(require("./routes/messaging.routes"));
const dlr_webhook_1 = require("./routes/dlr.webhook");
const kakaoChatbot_routes_1 = __importDefault(require("./routes/kakaoChatbot.routes"));
const path_1 = __importDefault(require("path"));
function createApp() {
    const app = (0, express_1.default)();
    // 미들웨어 설정
    app.use(body_parser_1.default.json({ limit: '5mb' }));
    app.use(body_parser_1.default.urlencoded({ extended: true }));
    // 헬스체크
    app.get('/health', (_, res) => {
        res.json({
            status: 'OK',
            timestamp: new Date().toISOString(),
            service: 'SOLAPI SMS Service'
        });
    });
    // 라우트 설정
    app.use('/api', messaging_routes_1.default);
    app.use('/api', dlr_webhook_1.dlrRouter);
    app.use('/kakao', kakaoChatbot_routes_1.default);
    app.use('/images', express_1.default.static(path_1.default.join(__dirname, '../../images')));
    // 404 핸들러 수정: * 대신 (.*) 또는 다른 방법 사용
    // Express 5.x 에서는 와일드카드 * 에도 이름을 붙여야 할 수 있습니다.
    // 가장 안전한 catch-all은 미들웨어 체인의 마지막에 두는 것입니다.
    app.use((req, res, next) => {
        res.status(404).json({ error: 'Not Found - ' + req.originalUrl });
    });
    // 에러 핸들러
    app.use((err, req, res, next) => {
        console.error('서버 오류:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    });
    return app;
}
