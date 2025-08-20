"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const env_1 = require("../config/env");
const app = (0, app_1.createApp)();
app.listen(env_1.ENV.PORT, () => {
    console.log(`🚀 SOLAPI SMS 서버가 포트 ${env_1.ENV.PORT}에서 실행중입니다.`);
    console.log(`📱 Health Check: http://localhost:${env_1.ENV.PORT}/health`);
    console.log(`📨 Send API: http://localhost:${env_1.ENV.PORT}/api/send`);
});
