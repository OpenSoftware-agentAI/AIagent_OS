//BE\src\routes\messaging.routes.ts
import { Router } from "express";
import {
  postSendMessage,
  postSendMultiple,
} from "../../features/messaging/messaging.controller";

const router = Router();

export default router;
