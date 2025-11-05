import sharp from "sharp";
import express from "express";
import { SmsTool } from "../../tools/SmsTool";
import fs from "fs";
import path from "path";

const router = express.Router();

/**
 * 이미지를 SOLAPI 요구사항에 맞게 압축
 * - 해상도: 1500x1440 이하
 * - 파일 크기: 200KB 이하
 */
async function compressImageForMMS(imagePath: string): Promise<string> {
  const stats = fs.statSync(imagePath);
  const fileSizeKB = stats.size / 1024;

  console.log(`📊 원본 이미지 정보:`);
  console.log(`  - 파일 크기: ${fileSizeKB.toFixed(2)}KB`);

  // 이미지 메타데이터 확인
  const metadata = await sharp(imagePath).metadata();
  const { width, height } = metadata;

  console.log(`  - 해상도: ${width}x${height}px`);

  // 압축이 필요한지 확인
  const needsResize = width! > 1500 || height! > 1440;
  const needsCompress = stats.size > 204800; // 200KB

  if (!needsResize && !needsCompress) {
    console.log(`✅ 이미지가 이미 SOLAPI 요구사항을 만족합니다`);
    return imagePath;
  }

  console.log(
    `🔄 이미지 압축 시작 (해상도: ${needsResize}, 크기: ${needsCompress})`
  );

  // 압축된 파일 경로 생성
  const ext = path.extname(imagePath);
  const dir = path.dirname(imagePath);
  const basename = path.basename(imagePath, ext);
  const compressedPath = path.join(dir, `${basename}_mms_compressed.jpg`);

  // Sharp로 해상도 + 파일 크기 동시 압축
  let quality = 80; // 초기 품질

  while (quality > 10) {
    await sharp(imagePath)
      .resize(1500, 1440, {
        // SOLAPI 최대 해상도
        fit: "inside", // 비율 유지
        withoutEnlargement: true, // 확대 방지
      })
      .jpeg({
        quality: quality,
        mozjpeg: true, // 더 나은 압축
      })
      .toFile(compressedPath);

    const compressedStats = fs.statSync(compressedPath);
    const compressedMetadata = await sharp(compressedPath).metadata();
    const compressedSizeKB = compressedStats.size / 1024;

    console.log(`🔍 압축 테스트 (품질: ${quality})`);
    console.log(
      `  - 해상도: ${compressedMetadata.width}x${compressedMetadata.height}px`
    );
    console.log(`  - 파일 크기: ${compressedSizeKB.toFixed(2)}KB`);

    // 두 조건 모두 만족하는지 확인
    const sizeOK = compressedStats.size <= 204800; // 200KB
    const resolutionOK =
      compressedMetadata.width! <= 1500 && compressedMetadata.height! <= 1440;

    if (sizeOK && resolutionOK) {
      console.log(`✅ 압축 성공!`);
      console.log(`  - 원본: ${width}x${height}px, ${fileSizeKB.toFixed(2)}KB`);
      console.log(
        `  - 압축: ${compressedMetadata.width}x${
          compressedMetadata.height
        }px, ${compressedSizeKB.toFixed(2)}KB`
      );
      console.log(`  - 품질: ${quality}`);
      return compressedPath;
    }

    // 품질 낮춰서 재시도
    quality -= 10;
  }

  throw new Error(
    `이미지를 SOLAPI 요구사항(1500x1440px, 200KB)에 맞게 압축할 수 없습니다.`
  );
}

/**
 * @swagger
 * /api/integrated/mms/send:
 *   post:
 *     summary: MMS 발송 (이미지 자동 최적화)
 *     description: |
 *       이미지 파일과 함께 멀티미디어 메시지를 발송합니다.
 *
 *       **자동 최적화:**
 *       - 해상도: 1500x1440px 이하로 리사이즈
 *       - 파일 크기: 200KB 이하로 압축
 *       - 원본 파일은 보존됨
 *     tags: [MMS]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               to:
 *                 type: string
 *                 example: "010-1234-5678"
 *               message:
 *                 type: string
 *                 example: "학습 결과를 첨부합니다."
 *               imagePath:
 *                 type: string
 *                 description: 이미지 파일 절대 경로 (자동 최적화됨)
 *                 example: "C:\\path\\to\\image.jpg"
 *               subject:
 *                 type: string
 *                 example: "학습 결과"
 *             required:
 *               - to
 *               - message
 *               - imagePath
 *     responses:
 *       200:
 *         description: MMS 발송 성공
 *       400:
 *         description: 잘못된 요청
 *       500:
 *         description: 서버 오류
 */
router.post("/mms/send", async (req, res) => {
  try {
    const { to, message, imagePath, subject } = req.body;

    // 필수 파라미터 검증
    if (!to || !message || !imagePath) {
      return res.status(400).json({
        success: false,
        message:
          "MMS 전송에는 수신자 번호, 메시지 내용, 이미지 경로가 모두 필요합니다.",
      });
    }

    // 파일 존재 확인
    if (!fs.existsSync(imagePath)) {
      return res.status(400).json({
        success: false,
        message: `이미지 파일을 찾을 수 없습니다: ${imagePath}`,
      });
    }

    console.log(`📸 MMS 발송 요청:`);
    console.log(`  - 수신자: ${to}`);
    console.log(`  - 메시지: ${message.substring(0, 50)}...`);
    console.log(`  - 이미지: ${imagePath}`);

    // 자동 압축 (해상도 + 파일 크기)
    let finalImagePath = imagePath;
    try {
      finalImagePath = await compressImageForMMS(imagePath);
    } catch (compressError) {
      console.error("❌ 이미지 최적화 실패:", compressError);
      return res.status(400).json({
        success: false,
        message: "이미지 최적화에 실패했습니다. 원본 이미지를 확인해주세요.",
        error:
          compressError instanceof Error
            ? compressError.message
            : "알 수 없는 오류",
      });
    }

    const smsTool = new SmsTool();

    // MMS 전송
    const result = await smsTool.sendImageMessage({
      to: to,
      text: message,
      imageFilePath: finalImagePath,
      subject: subject,
      isAdvertisement: false,
      allowNightSend: false,
    });

    // 압축된 파일 정리 (원본과 다른 경우)
    if (finalImagePath !== imagePath && fs.existsSync(finalImagePath)) {
      fs.unlinkSync(finalImagePath);
      console.log(`🗑️ 압축 임시 파일 삭제: ${finalImagePath}`);
    }

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: result.message,
        data: result,
      });
    }

    console.log("✅ MMS 발송 완료:", result);

    res.json({
      success: true,
      result: result,
      message: "MMS가 성공적으로 발송되었습니다.",
    });
  } catch (error) {
    console.error("❌ MMS 발송 실패:", error);
    const errorMessage =
      error instanceof Error ? error.message : "알 수 없는 오류";
    res.status(500).json({
      success: false,
      error: errorMessage,
      message: "MMS 발송 중 오류가 발생했습니다.",
    });
  }
});

/**
 * @swagger
 * /api/integrated/sms/send:
 *   post:
 *     summary: SMS 단건 발송
 *     tags: [SMS]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               to:
 *                 type: string
 *                 description: 수신자 전화번호
 *                 example: "010-1234-5678"
 *               message:
 *                 type: string
 *                 description: 발송할 메시지 내용
 *                 example: "안녕하세요, 학습 피드백입니다."
 *             required:
 *               - to
 *               - message
 *     responses:
 *       200:
 *         description: 메시지 발송 성공
 *       400:
 *         description: 잘못된 요청
 *       500:
 *         description: 서버 오류
 */

router.post("/sms/send", async (req, res) => {
  try {
    const { to, message } = req.body;

    if (!to || !message) {
      return res.status(400).json({
        success: false,
        message: "수신자 번호와 메시지 내용이 필요합니다.",
      });
    }

    console.log(`📱 SMS 발송 요청: ${to} -> ${message.substring(0, 30)}...`);

    const smsTool = new SmsTool();

    // 🔧 SmsTool의 실제 메서드 사용 (sendSms)
    const result = await smsTool.sendSms({
      to: to,
      text: message,
      isAdvertisement: false,
      allowNightSend: false,
    });

    console.log("✅ SMS 발송 완료:", result);

    res.json({
      success: true,
      result: result,
      message: "SMS가 성공적으로 발송되었습니다.",
    });
  } catch (error) {
    console.error("❌ SMS 발송 실패:", error);
    const errorMessage =
      error instanceof Error ? error.message : "알 수 없는 오류";
    res.status(500).json({
      success: false,
      error: errorMessage,
      message: "SMS 발송 중 오류가 발생했습니다.",
    });
  }
});

/**
 * 이미지를 200KB 이하로 자동 압축
 */
async function compressImageIfNeeded(imagePath: string): Promise<string> {
  const stats = fs.statSync(imagePath);
  const fileSizeKB = stats.size / 1024;

  // 이미 200KB 이하면 그대로 반환
  if (stats.size <= 204800) {
    console.log(
      `✅ 이미지가 이미 200KB 이하입니다 (${fileSizeKB.toFixed(2)}KB)`
    );
    return imagePath;
  }

  console.log(`🔄 이미지 압축 시작 (${fileSizeKB.toFixed(2)}KB → 200KB 이하)`);

  // 압축된 파일 경로 생성
  const ext = path.extname(imagePath);
  const dir = path.dirname(imagePath);
  const basename = path.basename(imagePath, ext);
  const compressedPath = path.join(dir, `${basename}_compressed${ext}`);

  // Sharp로 압축
  let quality = 80; // 초기 품질

  while (quality > 10) {
    await sharp(imagePath)
      .resize(1024, 1024, {
        // 최대 1024x1024로 리사이즈
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({ quality: quality }) // JPEG로 압축
      .toFile(compressedPath);

    const compressedStats = fs.statSync(compressedPath);
    const compressedSizeKB = compressedStats.size / 1024;

    if (compressedStats.size <= 204800) {
      console.log(
        `✅ 압축 성공! ${fileSizeKB.toFixed(2)}KB → ${compressedSizeKB.toFixed(
          2
        )}KB (품질: ${quality})`
      );
      return compressedPath;
    }

    // 품질 낮춰서 재시도
    quality -= 10;
  }

  throw new Error("이미지를 200KB 이하로 압축할 수 없습니다.");
}

/**
 * @swagger
 * /api/integrated/sms/send-multiple:
 *   post:
 *     summary: SMS 다중 발송
 *     tags: [SMS]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               recipients:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     to:
 *                       type: string
 *                     message:
 *                       type: string
 *                 description: 수신자 목록
 *               template:
 *                 type: string
 *                 description: 공통 템플릿 메시지 (선택사항)
 *             required:
 *               - recipients
 *     responses:
 *       200:
 *         description: 다중 메시지 발송 성공
 *       400:
 *         description: 잘못된 요청
 *       500:
 *         description: 서버 오류
 */

router.post("/sms/send-multiple", async (req, res) => {
  try {
    const { recipients, template } = req.body;

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({
        success: false,
        message: "수신자 목록이 필요합니다.",
      });
    }

    if (recipients.length > 100) {
      return res.status(400).json({
        success: false,
        message: "한 번에 최대 100명까지만 발송 가능합니다.",
      });
    }

    console.log(`📱 SMS 다중 발송 요청: ${recipients.length}명`);

    const smsTool = new SmsTool();

    // 🔧 SmsTool의 실제 다중 발송 메서드 사용
    const recipientList = recipients.map((r) => r.to);
    const messageText = template || recipients[0]?.message || "안녕하세요";

    const result = await smsTool.sendBulkMessage({
      recipients: recipientList,
      text: messageText,
      isAdvertisement: false,
      allowNightSend: false,
    });

    console.log("✅ SMS 다중 발송 완료:", result);

    res.json({
      success: true,
      data: result.data,
      message: result.message,
    });
  } catch (error) {
    console.error("❌ SMS 다중 발송 처리 실패:", error);
    const errorMessage =
      error instanceof Error ? error.message : "알 수 없는 오류";
    res.status(500).json({
      success: false,
      error: errorMessage,
      message: "SMS 다중 발송 처리 중 오류가 발생했습니다.",
    });
  }
});

/**
 * @swagger
 * /api/integrated/files/analyze:
 *   post:
 *     summary: 업로드된 파일 분석
 *     tags: [Files]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               filePath:
 *                 type: string
 *                 description: 분석할 파일 경로
 *               fileName:
 *                 type: string
 *                 description: 원본 파일명
 *               analysisType:
 *                 type: string
 *                 enum: [basic, comprehensive, student-data]
 *                 description: 분석 유형
 *                 default: basic
 *             required:
 *               - filePath
 *     responses:
 *       200:
 *         description: 파일 분석 성공
 *       400:
 *         description: 잘못된 요청
 *       404:
 *         description: 파일을 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.post("/files/analyze", async (req, res) => {
  try {
    const { filePath, fileName, analysisType = "basic" } = req.body;

    if (!filePath) {
      return res.status(400).json({
        success: false,
        message: "파일 경로가 필요합니다.",
      });
    }

    // 파일 존재 확인
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "파일을 찾을 수 없습니다.",
      });
    }

    console.log(`🔍 파일 분석 시작: ${fileName || filePath}`);

    const stats = fs.statSync(filePath);
    const fileExt = path.extname(filePath).toLowerCase();

    // 🔧 타입 정의 개선
    interface FileAnalysis {
      type: string;
      rowCount?: number;
      hasHeader?: boolean;
      encoding?: string;
      preview?: string;
      message?: string;
      error?: string;
    }

    interface AnalysisResult {
      basic: {
        fileName: string;
        filePath: string;
        fileSize: number;
        fileSizeMB: string;
        fileExtension: string;
        createdAt: Date;
        modifiedAt: Date;
      };
      analysis: FileAnalysis | null;
      recommendations: string[];
    }

    // 기본 파일 정보
    const basicInfo = {
      fileName: fileName || path.basename(filePath),
      filePath: filePath,
      fileSize: stats.size,
      fileSizeMB: (stats.size / 1024 / 1024).toFixed(2),
      fileExtension: fileExt,
      createdAt: stats.birthtime,
      modifiedAt: stats.mtime,
    };

    // 🔧 타입 안전한 분석 결과 초기화
    let analysisResult: AnalysisResult = {
      basic: basicInfo,
      analysis: null,
      recommendations: [],
    };

    // 파일 형식별 분석
    if (fileExt === ".csv") {
      try {
        const csvContent = fs.readFileSync(filePath, "utf-8");
        const lines = csvContent.split("\n").filter((line) => line.trim());

        // 🔧 타입 안전한 analysis 할당
        analysisResult.analysis = {
          type: "CSV",
          rowCount: lines.length - 1, // 헤더 제외
          hasHeader: true,
          encoding: "UTF-8",
          preview: lines.slice(0, 3).join("\n"),
        };

        // 🔧 타입 안전한 recommendations 할당
        if (analysisType === "student-data") {
          analysisResult.recommendations = [
            "학생 데이터 CSV로 판단됩니다.",
            "/api/students/upload-csv 엔드포인트를 사용하여 DB에 저장할 수 있습니다.",
            "데이터 분석 후 개별 학생 코멘트 생성이 가능합니다.",
          ];
        } else {
          analysisResult.recommendations = [
            "CSV 파일 형식이 확인되었습니다.",
            "데이터 처리 및 분석이 가능합니다.",
          ];
        }
      } catch (csvError) {
        console.warn("⚠️ CSV 분석 중 오류:", csvError);
        analysisResult.analysis = {
          type: "CSV",
          error: "CSV 파일 내용을 읽을 수 없습니다.",
        };
        analysisResult.recommendations = ["파일 형식을 확인해주세요."];
      }
    } else if ([".xlsx", ".xls"].includes(fileExt)) {
      analysisResult.analysis = {
        type: "Excel",
        message:
          "Excel 파일이 감지되었습니다. 상세 분석을 원하시면 전용 도구를 사용해주세요.",
      };

      analysisResult.recommendations = [
        "Excel 파일 전용 분석 도구 사용 권장",
        "CSV 형식으로 변환 후 분석 가능",
      ];
    } else if ([".pdf"].includes(fileExt)) {
      analysisResult.analysis = {
        type: "PDF",
        message:
          "PDF 파일이 감지되었습니다. PDF 전용 분석 도구 개발 예정입니다.",
      };

      analysisResult.recommendations = [
        "PDF 전용 분석 도구 개발 예정",
        "텍스트 추출 후 분석 가능",
      ];
    } else if ([".jpg", ".jpeg", ".png"].includes(fileExt)) {
      analysisResult.analysis = {
        type: "Image",
        message: "이미지 파일이 감지되었습니다. OCR 기능 개발 예정입니다.",
      };

      analysisResult.recommendations = [
        "이미지 OCR 기능 개발 예정",
        "MMS 발송에 활용 가능",
      ];
    } else {
      analysisResult.analysis = {
        type: "Unknown",
        message: "지원하지 않는 파일 형식입니다.",
      };

      analysisResult.recommendations = [
        "지원되는 파일 형식: CSV, Excel, PDF, 이미지",
        "파일 형식을 확인해주세요.",
      ];
    }

    console.log(`✅ 파일 분석 완료: ${fileExt} 형식`);

    res.json({
      success: true,
      data: analysisResult,
      message: `파일 분석이 완료되었습니다. (${analysisType} 모드)`,
    });
  } catch (error) {
    console.error("❌ 파일 분석 실패:", error);
    const errorMessage =
      error instanceof Error ? error.message : "알 수 없는 오류";
    res.status(500).json({
      success: false,
      error: errorMessage,
      message: "파일 분석 중 오류가 발생했습니다.",
    });
  }
});

/**
 * @swagger
 * /api/integrated/system/status:
 *   get:
 *     summary: 통합 시스템 상태 확인
 *     tags: [System]
 *     responses:
 *       200:
 *         description: 시스템 상태 조회 성공
 */
router.get("/system/status", async (req, res) => {
  try {
    const status = {
      server: {
        status: "running",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      },
      features: {
        sms: {
          available: true,
          provider: "SOLAPI",
        },
        fileAnalysis: {
          available: true,
          supportedFormats: [
            ".csv",
            ".xlsx",
            ".xls",
            ".pdf",
            ".jpg",
            ".jpeg",
            ".png",
          ],
        },
        studentManagement: {
          available: true,
          dbConnected: true,
        },
      },
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      },
    };

    res.json({
      success: true,
      data: status,
      message: "시스템이 정상적으로 작동 중입니다.",
    });
  } catch (error) {
    console.error("❌ 시스템 상태 확인 실패:", error);
    const errorMessage =
      error instanceof Error ? error.message : "알 수 없는 오류";
    res.status(500).json({
      success: false,
      error: errorMessage,
      message: "시스템 상태 확인에 실패했습니다.",
    });
  }
});

/**
 * @swagger
 * /api/integrated/swagger:
 *   get:
 *     summary: 통합 API Swagger 문서
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Swagger 문서 반환
 */
router.get("/swagger", (req, res) => {
  const swaggerDoc = {
    openapi: "3.0.0",
    info: {
      title: "Integrated Services API",
      version: "1.0.0",
      description: "SMS, MMS, 파일 분석 등 통합 서비스 API",
    },
    paths: {
      "/api/integrated/sms/send": {
        post: {
          summary: "SMS 단건 발송",
          tags: ["SMS"],
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    to: { type: "string" },
                    message: { type: "string" },
                  },
                  required: ["to", "message"],
                },
              },
            },
          },
          responses: {
            "200": { description: "성공" },
          },
        },
      },

      "/api/integrated/mms/send": {
        post: {
          summary: "MMS 발송 (이미지 첨부)",
          description: "이미지 파일과 함께 멀티미디어 메시지를 발송합니다",
          tags: ["MMS"],
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    to: {
                      type: "string",
                      description: "수신자 전화번호",
                      example: "010-1234-5678",
                    },
                    message: {
                      type: "string",
                      description: "메시지 내용",
                      example: "학습 결과를 첨부합니다.",
                    },
                    imagePath: {
                      type: "string",
                      description: "이미지 파일 절대 경로 (200KB 미만)",
                      example:
                        "C:\\Users\\user\\Documents\\GitHub\\AIagent_OS\\BE\\uploads\\image.jpg",
                    },
                    subject: {
                      type: "string",
                      description: "메시지 제목 (선택)",
                      example: "학습 결과",
                    },
                  },
                  required: ["to", "message", "imagePath"],
                },
              },
            },
          },
          responses: {
            "200": { description: "MMS 발송 성공" },
            "400": { description: "잘못된 요청" },
            "500": { description: "서버 오류" },
          },
        },
      },
      "/api/integrated/sms/send-multiple": {
        post: {
          summary: "SMS 다중 발송",
          tags: ["SMS"],
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    recipients: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          to: { type: "string" },
                          message: { type: "string" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          responses: {
            "200": { description: "성공" },
          },
        },
      },
      "/api/integrated/files/analyze": {
        post: {
          summary: "파일 분석",
          description:
            "업로드된 파일의 형식을 분석하고 기본 정보를 반환합니다. CSV, PDF, Excel, 이미지 파일을 지원합니다.",
          operationId: "analyzeFile",
          tags: ["Files"],
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    filePath: { type: "string" },
                    fileName: { type: "string" },
                    analysisType: { type: "string" },
                  },
                  required: ["filePath"],
                },
              },
            },
          },
          responses: {
            "200": { description: "성공" },
          },
        },
      },
    },
  };

  res.json(swaggerDoc);
});

export default router;
