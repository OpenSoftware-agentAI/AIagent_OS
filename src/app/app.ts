import express from 'express';
import bodyParser from 'body-parser';
import messagingRoutes from './routes/messaging.routes';
import { dlrRouter } from './routes/dlr.webhook';

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
  
  // 404 핸들러
  app.use('*', (_, res) => {
    res.status(404).json({ error: 'Not Found' });
  });
  
  // 에러 핸들러
  app.use((err: any, req: any, res: any, next: any) => {
    console.error('서버 오류:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  });
  
  return app;
}