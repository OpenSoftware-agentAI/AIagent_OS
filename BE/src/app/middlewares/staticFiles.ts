import express, { Express } from "express";
import path from "path";

export function setupStaticFiles(app: Express) {
  app.use(
    "/downloads",
    express.static(path.join(__dirname, "../../generated"))
  );
  app.use("/uploads", express.static(path.join(__dirname, "../../uploads")));
  app.use(
    "/downloads/students",
    express.static(path.join(__dirname, "../../output/students"))
  );
  // console.log("📂 학생 이미지 다운로드: /downloads/students");
  console.log("📂 Static files enabled: /downloads, /uploads");
}
