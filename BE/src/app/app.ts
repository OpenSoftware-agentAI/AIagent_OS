import express from "express";
import path from "path";
import cors from "cors";
import http from "http";
import { setupWebSocket } from "./socket";
import bodyParser from "body-parser";
import { Server as SocketIOServer } from "socket.io";
import messagingRoutes from "./routes/messaging.routes";
import fileRouter from "./routes/fileRouter";
import integratedApiRoutes from "./routes/integratedApi.routes";
import { setupSwagger } from "./middlewares/swaggerSetup";
import { setupStaticFiles } from "./middlewares/staticFiles";
import { corsConfig } from "./middlewares/corsConfig";

import studentRoutes from "../app/routes/classStudents.routes";
import imageRoutes from "../app/routes/images.routes";
import { createAiRouter } from "./routes/ai.routes";
import commentRoutes from "../app/routes/comments.routes";
import adminRoutes from "./routes/admin.routes";

export function createApp() {
  const app = express();
  const server = http.createServer(app);
  let io: SocketIOServer;
  io = setupWebSocket(server);

  setupSwagger(app);
  setupStaticFiles(app);

  app.use(bodyParser.json({ limit: "5mb" }));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cors(corsConfig));

  app.use(express.json());

  app.get("/students-swagger", (req, res) => {
    console.log("📄 Swagger JSON 요청");
    res.sendFile(path.join(__dirname, "../../students-swagger.json"));
  });

  app.use("/students", studentRoutes);
  app.use("/api/images", imageRoutes); 
  app.use("/ai", createAiRouter(io));
  app.use("/comments", commentRoutes);
  app.use("/admin", adminRoutes);

  app.use("/api/file", fileRouter);
  app.use("/api/integrated", integratedApiRoutes);
  app.use("/api", messagingRoutes);

  app.get("/health", (_, res) => {
    res.json({
      status: "OK",
      timestamp: new Date().toISOString(),
      services: {
        webServer: "running",
        database: "connected",
        aiService: "agentica-compatible",
        fileUpload: "enabled",
        smsService: "enabled",
        swagger: "available",
      },
      endpoints: {
        swagger: "/students-swagger",
        students: "/students",
        studentData: "/students/all/correct-wrong",
        comments: "/comments",
        aiCommentSource: "/ai/generate-comment-source",
        aiApplyComments: "/ai/apply-source-to-students",
        finalFeedbacks: "/final-feedbacks",
        files: "/api/file",
        sms: "/api/integrated/sms",
        messaging: "/api",
      },
      compatibility: "TeamMember_main.ts_compatible",
    });
  });

  app.get("/api", (req, res) => {
    res.json({
      message: "AI Agent OS API Server (팀원 호환 + AI 통합)",
      version: "1.0.0",
      documentation: "/api-docs",
      teamMemberCompatibility: true,
      availableServices: {
        students: {
         list: "GET /students/all",
         individual: "GET /students/:id",
         allData: "GET /students/all/correct-wrong",
         individualData: "GET /students/:id/correct-wrong",
        },
        ai: {
          generateCommentSource: "POST /ai/generate-comment-source",
          applyToStudents: "POST /ai/apply-source-to-students",
        },
        comments: {
          create: "POST /comments",
          finalFeedback: "POST /final-feedbacks",
          search: "GET /comments/final/search",
          all: "GET /comments/final/all",
        },
        files: {
          upload: "POST /api/file/upload",
          list: "GET /api/file/list",
        },
        sms: {
          send: "POST /api/integrated/sms/send",
          sendMMS: "POST /api/integrated/mms/send",
          sendMultiple: "POST /api/integrated/sms/send-multiple",
        },
        system: {
          swagger: "GET /students-swagger",
          health: "GET /health",
        },
      },
      websocket: {
        enabled: true,
        events: ["sendMessage", "receiveMessage", "progressUpdate"],
        aiService: "agentica-unified",
      },
    });
  });

  app.use((req, res) => {
    res.status(404).json({
      error: "Not Found",
      path: req.path,
      method: req.method,
      suggestion: "사용 가능한 엔드포인트는 GET /api, GET /health 에서 확인하세요.",
      documentation: "/api-docs",
      teamMemberEndpoints: "/students-swagger",
    });
  });

  console.log("🚀 애플리케이션 초기화(app.ts) 완료");

  return { app, server, io };
}
