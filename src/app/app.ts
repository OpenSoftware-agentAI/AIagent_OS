// src/app/app.ts
import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import kakaoRoutes from './routes/kakaoChatbot.routes';
// import indexRoutes from './routes/index'; // 사용 안 함: 제거
import messagingRoutes from './routes/messaging.routes';
import { dlrRouter } from './routes/dlr.webhook'; // default가 아닌 named import

export function createApp() {
  const app = express();

  app.use(bodyParser.json({ limit: '5mb' }));
  app.use(bodyParser.urlencoded({ extended: true }));

  // 정적 파일: 서버가 생성한 파일을 다운로드로 제공
  app.use('/downloads', express.static(path.join(__dirname, '../../generated')));

  // 헬스체크
  app.get('/health', (_, res) => {
    res.json({ status: 'OK', at: new Date().toISOString() });
  });

  // 라우트
  // app.use('/', indexRoutes); // 제거
  app.use('/kakao', kakaoRoutes);
  app.use('/api', messagingRoutes);
  app.use('/', dlrRouter); // dlrRouter가 내부에서 /callbacks/dlr 경로를 가짐

  // 404 핸들러(간단)
  app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
  });

  return app;
}
