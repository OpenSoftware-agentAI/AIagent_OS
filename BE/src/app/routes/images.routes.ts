import { Router } from "express";
import prisma from "../../../prisma/client";
import fs from "fs";
import path from "path";
import { ImageGeneratorTool } from "../../tools/ImageGeneratorTool";

const router = Router();

router.post("/generate-all-students", async (req, res) => {
  const requestId = Math.random().toString(36).substring(7);
  console.log(`➡️ [${requestId}] /generate-all-students 이미지 생성 시작`);

  try {
    const imageGenerator = new ImageGeneratorTool();

    console.log(`📸 [${requestId}] 모든 학생 이미지 생성 중...`);
    await imageGenerator.captureAllStudents();

    const outputDir = path.resolve(__dirname, "../../../output/students");
    const files = fs
      .readdirSync(outputDir)
      .filter((f) => f.endsWith(".jpg"))
      .map((f) => ({
        filename: f,
        url: `/downloads/students/${f}`,
        createdAt: fs.statSync(path.join(outputDir, f)).mtime,
      }))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    console.log(`✅ [${requestId}] ${files.length}개 이미지 생성 완료`);

    res.json({
      success: true,
      message: `${files.length}명의 학생 이미지가 생성되었습니다.`,
      totalImages: files.length,
      images: files.slice(0, 5),
      downloadUrl: "/downloads/students",
    });
  } catch (error) {
    console.error(`❌ [${requestId}] 이미지 생성 오류:`, error);
    const errorMessage =
      error instanceof Error ? error.message : "알 수 없는 오류";
    res.status(500).json({
      success: false,
      message: "이미지 생성 실패",
      error: errorMessage,
    });
  }
});

router.post("/generate-student/:id", async (req, res) => {
  const { id } = req.params;
  const requestId = Math.random().toString(36).substring(7);
  console.log(`➡️ [${requestId}] 학생 ${id} 이미지 생성 시작`);

  try {
    const student = await prisma.studentData.findUnique({
      where: { id },
      select: { id: true, name: true },
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "학생을 찾을 수 없습니다.",
      });
    }

    const outputDir = path.resolve(__dirname, "../../output/students");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const name = student.name.replace(/[\\/:*?"<>|]/g, "_");
    const url = `http://localhost:3000/students/${id}`;
    const outPath = path.join(outputDir, `${name}_${id}.jpg`);

    console.log(`📸 [${requestId}] ${name} 이미지 생성 중...`);

    const { renderImageFromUrl } = require("../render/renderImage");
    await renderImageFromUrl({
      url,
      outPath,
      width: 805,
      height: 1320,
      deviceScaleFactor: 2,
      quality: 90,
    });

    console.log(`✅ [${requestId}] ${name} 이미지 생성 완료`);

    res.json({
      success: true,
      message: `${name} 학생의 이미지가 생성되었습니다.`,
      studentName: name,
      imageUrl: `/downloads/students/${name}_${id}.jpg`,
    });
  } catch (error) {
    console.error(`❌ [${requestId}] 이미지 생성 오류:`, error);
    const errorMessage =
      error instanceof Error ? error.message : "알 수 없는 오류";
    res.status(500).json({
      success: false,
      message: "이미지 생성 실패",
      error: errorMessage,
    });
  }
});

export default router;
