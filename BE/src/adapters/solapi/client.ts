import { SolapiMessageService } from "solapi";
import { ENV } from "../../config/env";

export const messageService = new SolapiMessageService(
  ENV.SOLAPI_API_KEY,
  ENV.SOLAPI_API_SECRET
);

console.log("SOLAPI 클라이언트 초기화 완료");
