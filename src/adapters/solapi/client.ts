import { SolapiMessageService } from 'solapi';
import { ENV } from '../../config/env';

// SOLAPI 메시지 서비스 인스턴스 생성 (싱글톤)
export const messageService = new SolapiMessageService(
  ENV.SOLAPI_API_KEY,
  ENV.SOLAPI_API_SECRET
);

console.log('SOLAPI 클라이언트 초기화 완료'); 