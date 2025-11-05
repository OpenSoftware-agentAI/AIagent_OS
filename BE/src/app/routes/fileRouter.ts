import * as XLSX from "xlsx";
import * as fs from "fs";
import express from "express";
import multer from "multer";
import path from "path";
import { processUnifiedMessage } from "../../services/unifiedAiService";
import { readStudentAnswers } from "../../tools/readers/readStudentAnswers";
import { readClassInfo } from "../../tools/readers/readClassInfo";
import {
  createMultipleStudentData,
  createClassRecord,
} from "../../services/insertData";

const router = express.Router();

const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const originalName = Buffer.from(file.originalname, "latin1").toString(
      "utf8"
    );
    const uniqueName = `${Date.now()}_${originalName}`;

    console.log(`📝 원본 파일명: ${file.originalname}`);
    console.log(`✅ 수정된 파일명: ${originalName}`);
    console.log(`💾 저장될 파일명: ${uniqueName}`);

    cb(null, uniqueName);
  },
});

const fileFilter = (req: any, file: any, cb: any) => {
  const correctedName = Buffer.from(file.originalname, "latin1").toString(
    "utf8"
  );

  console.log("🔍 업로드 시도 파일:", {
    originalname: file.originalname,
    correctedName: correctedName,
    mimetype: file.mimetype,
  });

  const allowedTypes = [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
    "text/csv",
    "application/pdf",
    "image/jpeg",
    "image/jpg",
    "image/png",
    "application/octet-stream",
  ];

  const fileExt = path.extname(correctedName).toLowerCase();
  const allowedExts = [
    ".xlsm",
    ".xlsx",
    ".xls",
    ".csv",
    ".pdf",
    ".jpg",
    ".jpeg",
    ".png",
  ];

  if (allowedTypes.includes(file.mimetype) || allowedExts.includes(fileExt)) {
    console.log("✅ 파일 허용됨");
    cb(null, true);
  } else {
    console.log("❌ 거부된 파일:", file.mimetype, fileExt);
    cb(
      new Error(
        `지원하지 않는 파일 형식입니다. 현재: ${file.mimetype}, 확장자: ${fileExt}`
      ),
      false
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

router.post("/upload", upload.single("file"), async (req, res) => {
  console.log("🔍 파일 업로드 엔드포인트 호출됨");

  try {
    if (!req.file) {
      console.log("❌ req.file이 없음");
      return res.status(400).json({
        success: false,
        message: "파일이 업로드되지 않았습니다.",
      });
    }

    const correctedOriginalName = Buffer.from(
      req.file.originalname,
      "latin1"
    ).toString("utf8");
    console.log("✅ 파일 업로드 성공:", req.file.filename);

    const fileExt = path.extname(correctedOriginalName).toLowerCase();

    let csvPath = req.file.path;

    if (fileExt === ".xlsm" || fileExt === ".xlsx") {
      console.log("📊 XLSM 파일 감지, CSV 변환 시작...");
      const workbook = XLSX.readFile(req.file.path, { cellDates: true });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const csvData = XLSX.utils.sheet_to_csv(worksheet);

      csvPath = req.file.path.replace(/\.(xlsm|xlsx)$/i, ".csv");
      fs.writeFileSync(csvPath, csvData, "utf8");
      console.log(`✅ XLSM → CSV 변환 완료: ${csvPath}`);
    }

    if (fileExt === ".csv" || fileExt === ".xlsm" || fileExt === ".xlsx") {
      try {
        console.log("📊 CSV 파일 감지, 학생 데이터 처리 시작...");

        const students = await readStudentAnswers(csvPath);
        console.log(`📋 ${students.length}명의 학생 데이터 파싱 완료`);

        await createMultipleStudentData(students);
        console.log(`✅ ${students.length}명의 학생 데이터 DB 저장 완료`);

        const classInfo = await readClassInfo(csvPath);
        await createClassRecord(classInfo);
        console.log("✅ 학급 정보(classRecord)가 저장되었습니다.");
        console.log("✅ CSV 학생 데이터가 DB에 저장되었습니다!");

        res.json({
          success: true,
          message: "CSV 파일 업로드 및 데이터 저장 완료",
          file: {
            filename: req.file.filename,
            originalName: correctedOriginalName,
            size: req.file.size,
            path: req.file.path,
            type: "csv",
          },
          data: {
            studentsProcessed: students.length,
            classInfo: {
              gradeAndClass: classInfo.gradeAndClass,
              textbook_1: classInfo.unit1_textbook,
              textbook_2: classInfo.unit2_textbook,
            },
          },
        });
      } catch (csvError) {
        console.error("❌ CSV 처리 실패:", csvError);
        const csvErrorMessage =
          csvError instanceof Error
            ? csvError.message
            : "알 수 없는 CSV 처리 오류";

        res.status(500).json({
          success: false,
          message: "CSV 파일 처리 중 오류가 발생했습니다.",
          error: csvErrorMessage,
        });
      }
    } else {
      try {
        const analysisMessage = `업로드된 파일 "${correctedOriginalName}"을 분석해주세요. 파일 경로: ${req.file.path}`;
        const tempSocketId = `file-upload-${Date.now()}-${Math.random()
          .toString(36)
          .substring(7)}`;

        const aiAnalysis = await processUnifiedMessage(
          analysisMessage,
          tempSocketId
        );

        res.json({
          success: true,
          message: "파일 업로드 및 AI 분석 완료",
          file: {
            filename: req.file.filename,
            originalName: correctedOriginalName,
            size: req.file.size,
            path: req.file.path,
            type: fileExt.replace(".", ""),
          },
          aiAnalysis: aiAnalysis,
        });
      } catch (aiError) {
        console.error("❌ AI 분석 실패:", aiError);

        res.json({
          success: true,
          message: "파일 업로드 성공, AI 분석은 백그라운드에서 처리됩니다",
          file: {
            filename: req.file.filename,
            originalName: correctedOriginalName,
            size: req.file.size,
            path: req.file.path,
            type: fileExt.replace(".", ""),
          },
          aiAnalysis:
            "AI 분석 중입니다. 잠시 후 채팅에서 파일에 대해 질문해보세요.",
        });
      }
    }
  } catch (error) {
    console.error("❌ 파일 업로드 실패:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "알 수 없는 오류가 발생했습니다.";
    res.status(500).json({
      success: false,
      message: "파일 업로드 중 오류가 발생했습니다.",
      error: errorMessage,
    });
  }
});

router.get("/list", (req, res) => {
  try {
    const files = fs.readdirSync(uploadDir);
    const fileDetails = files.map((filename) => {
      const filePath = path.join(uploadDir, filename);
      const stats = fs.statSync(filePath);
      const fileExt = path.extname(filename).toLowerCase();
      const originalName = filename.replace(/^\d+_/, "");

      return {
        filename,
        originalName,
        path: filePath,
        size: stats.size,
        sizeMB: (stats.size / 1024 / 1024).toFixed(2),
        type: fileExt.replace(".", ""),
        uploadedAt: stats.birthtime,
        modifiedAt: stats.mtime,
      };
    });

    res.json({
      success: true,
      message: `${files.length}개의 업로드된 파일을 찾았습니다.`,
      files: fileDetails,
      totalFiles: files.length,
      totalSize: fileDetails.reduce((sum, file) => sum + file.size, 0),
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "알 수 없는 오류가 발생했습니다.";
    res.status(500).json({
      success: false,
      message: "파일 목록 조회 실패",
      error: errorMessage,
    });
  }
});

export default router;
