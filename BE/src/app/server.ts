import { createApp } from "./app";
import { ENV } from "../config/env";

const { app, server } = createApp();

server.listen(ENV.PORT, () => {
  console.log(`🚀 통합 서버가 포트 ${ENV.PORT}에서 실행중입니다.`);
  console.log(`💬 웹소켓 서버가 함께 실행됩니다.`);
});
