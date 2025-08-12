import { createApp } from './app';
import { ENV } from '../config/env';

const app = createApp();

app.listen(ENV.PORT, () => {
  console.log(`🚀 SOLAPI SMS 서버가 포트 ${ENV.PORT}에서 실행중입니다.`);
  console.log(`📱 Health Check: http://localhost:${ENV.PORT}/health`);
  console.log(`📨 Send API: http://localhost:${ENV.PORT}/api/send`);
});