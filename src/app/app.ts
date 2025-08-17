import express from 'express';
import bodyParser from 'body-parser';
import messagingRoutes from './routes/messaging.routes';
import { dlrRouter } from './routes/dlr.webhook';
import kakaoChatbotRoutes from './routes/kakaoChatbot.routes'; 
import path from 'path';

export function createApp() {
  const app = express();
  // 미들웨어 설정
  app.use(bodyParser.json({ limit: '5mb' }));
  app.use(bodyParser.urlencoded({ extended: true }));
  
  // 헬스체크
  app.get('/health', (_, res) => {
    res.json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      service: 'SOLAPI SMS Service'
    });
  });
  
  // 라우트 설정
  app.use('/api', messagingRoutes);
  app.use('/api', dlrRouter);
  app.use('/kakao', kakaoChatbotRoutes); 
    app.use('/images', express.static(path.join(__dirname, '../../images')));
  // 404 핸들러 수정: * 대신 (.*) 또는 다른 방법 사용
  // Express 5.x 에서는 와일드카드 * 에도 이름을 붙여야 할 수 있습니다.
  // 가장 안전한 catch-all은 미들웨어 체인의 마지막에 두는 것입니다.
  app.use((req, res, next) => { // * 대신 모든 요청을 처리하는 미들웨어
    res.status(404).json({ error: 'Not Found - ' + req.originalUrl });
  });

  // 에러 핸들러
  app.use((err: any, req: any, res: any, next: any) => {
    console.error('서버 오류:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  });
  
  return app;
}
