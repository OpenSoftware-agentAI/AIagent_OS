import express from "express";
import prisma from "../../../prisma/client";
import fs from "fs";
import path from "path";
import { CommentSrcTool } from "../../Prompt/CommentSrcPrompt";
import { StudentCommentTool, Student } from "../../Prompt/StudentCommentPrompt";
import { createMultipleStudentData } from "../../services/insertData";
import { readStudentAnswers } from "../../tools/readers/readStudentAnswers";

const router = express.Router();

// ============================================
// 📌 주의: 이 라우터는 레거시 코드입니다.
// classStudents.routes.ts가 대체하고 있으므로
// 실제 사용되는 엔드포인트는 /students로 시작합니다.
// ============================================

// ❌ 삭제됨 (classStudents.routes.ts에서 구현)
// router.get("/", ...)                    // GET /students/all
// router.get("/:id", ...)                 // GET /students/:id (중복)
// router.get("/all/ids", ...)             // GET /students/all/ids
// router.get("/:id", ...)                 // GET /students/:id (HTML) (중복)
// router.get("/all/correct-wrong", ...)   // GET /students/all/correct-wrong

/**
 * @swagger
 * /students/{id}/correct-wrong:
 *   get:
 *     summary: 특정 학생의 상세 정보 및 정오답 데이터 조회 (AI용)
 *     description: |
 *       Agentica AI Agent가 개별 학생 정오답을 조회하는 엔드포인트입니다.
 *       각 학생의 학습 코멘트 생성 시 필요한 정오답 정보를 반환합니다.
 *     tags: [Students]
 *     operationId: students_correct_wrong_getById
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: "string" }
 *         description: 학생 ID (UUID)
 *     responses:
 *       200:
 *         description: 학생 정보 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: 학생 UUID
 *                 name:
 *                   type: string
 *                   description: 학생 이름
 *                 answers:
 *                   type: array
 *                   items: { type: string }
 *                   description: 정오답 배열 (예: ["O", "X", "O", "X", "O"])
 *                 arrivalNote:
 *                   type: string
 *                 participationLevel:
 *                   type: array
 *                 specialNote:
 *                   type: string
 *       404:
 *         description: 학생을 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.get("/:id/correct-wrong", async (req, res) => {
  const { id } = req.params;
  
  try {
    console.log(`📊 학생 ${id} 정오답 조회 (AI용)`);
    
    const student = await prisma.studentData.findUnique({
      where: { id }
    });

    if (!student) {
      console.warn(`⚠️ 학생 ${id} 없음`);
      return res.status(404).json({
        error: "Not Found",
        message: "학생 정오답 정보를 찾을 수 없음",
        studentId: id
      });
    }

    console.log(`✅ ${student.name} 정오답 조회 완료`);
    res.json(student);
    
  } catch (error) {
    console.error(`❌ 학생 정오답 조회 실패 (ID: ${id}):`, error);
    const errorMessage =
      error instanceof Error ? error.message : "알 수 없는 오류";
    res.status(500).json({
      error: "Internal Server Error",
      message: "DB 조회 실패",
      details: errorMessage
    });
  }
});

// ============================================
// ❌ 이하 엔드포인트는 미사용 (주석 처리)
// classStudents.routes.ts에서 구현되고 있음
// ============================================

// /**
//  * @swagger
//  * /api/students:
//  *   get:
//  *     summary: 모든 학생 목록 조회 (레거시)
//  */
// router.get("/", async (req, res) => { ... });

// /**
//  * @swagger
//  * /api/students/{id}:
//  *   get:
//  *     summary: 특정 학생 조회 (레거시)
//  */
// router.get("/:id", async (req, res) => { ... });

// /**
//  * @swagger
//  * /api/students/all/ids:
//  *   get:
//  *     summary: 학생 ID 목록 (레거시)
//  */
// router.get("/all/ids", async (req, res) => { ... });

// /**
//  * @swagger
//  * /api/students/{id}:
//  *   get:
//  *     summary: 학생 상세 정보 HTML (레거시)
//  */
// router.get("/:id", async (req, res) => { ... });

// /**
//  * @swagger
//  * /api/students/all/correct-wrong:
//  *   get:
//  *     summary: 모든 학생 정오답 (레거시)
//  */
// router.get("/all/correct-wrong", async (req, res) => { ... });

/**
 * @swagger
 * /api/students/upload-csv:
 *   post:
 *     summary: CSV 파일로 학생 데이터 일괄 업로드
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               filePath:
 *                 type: string
 *                 description: 업로드된 CSV 파일 경로
 *             required:
 *               - filePath
 *     responses:
 *       200:
 *         description: CSV 업로드 및 DB 저장 성공
 */
router.post("/upload-csv", async (req, res) => {
  try {
    const { filePath } = req.body;
    if (!filePath) {
      return res.status(400).json({
        success: false,
        message: "파일 경로가 제공되지 않았습니다.",
      });
    }
    const students = await readStudentAnswers(filePath);
    const dbResults = await createMultipleStudentData(students);
    res.json({
      success: true,
      message: "CSV 파일 업로드 및 DB 저장이 완료되었습니다.",
      data: {
        studentsProcessed: students.length,
        studentsStored: dbResults.length,
      },
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "알 수 없는 오류";
    res.status(500).json({
      success: false,
      error: errorMessage,
      message: "CSV 파일 처리 중 오류가 발생했습니다.",
    });
  }
});

/**
 * @swagger
 * /api/students/generate-comments:
 *   post:
 *     summary: 학생별 맞춤 코멘트 생성 (목업)
 *     tags: [Students]
 *     description: 이 API는 현재 CLI 로직을 이식하는 과정에 있으며, 곧 업데이트될 예정입니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               feature:
 *                 type: string
 *                 description: 문제 특징 또는 분석 기준
 *     responses:
 *       200:
 *         description: 코멘트 생성 성공
 */
router.post("/generate-comments", async (req, res) => {
  try {
    const { feature } = req.body;
    // ⚠️ 목업 로직 (실제 구현은 /ai/apply-source-to-students에서)
    res.json({
      success: true,
      message: `"${feature}"에 대한 목업 코멘트가 생성되었습니다.`,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "알 수 없는 오류";
    res.status(500).json({
      success: false,
      error: errorMessage,
      message: "학생 코멘트 생성 중 오류가 발생했습니다.",
    });
  }
});

/**
 * @swagger
 * /api/students/comments/recent:
 *   get:
 *     summary: 최근 생성된 학생 코멘트 조회
 *     tags: [Students]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: 조회할 코멘트 수
 *     responses:
 *       200:
 *         description: 코멘트 조회 성공
 */
router.get("/comments/recent", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;

    console.log(`💬 최근 ${limit}개 학생 코멘트 조회`);

    const comments = await prisma.studentComment.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    console.log(`✅ ${comments.length}개의 코멘트 조회 완료`);

    res.json({
      success: true,
      data: {
        comments: comments,
        count: comments.length,
        hasMore: comments.length === limit,
      },
      message: `최근 ${comments.length}개의 학생 코멘트를 조회했습니다.`,
    });
  } catch (error) {
    console.error("❌ 학생 코멘트 조회 실패:", error);
    const errorMessage =
      error instanceof Error ? error.message : "알 수 없는 오류";
    res.status(500).json({
      success: false,
      error: errorMessage,
      message: "학생 코멘트 조회에 실패했습니다.",
    });
  }
});

/**
 * @swagger
 * /api/students/stats:
 *   get:
 *     summary: 학생 데이터 통계 조회
 *     tags: [Students]
 *     responses:
 *       200:
 *         description: 통계 조회 성공
 */
router.get("/stats", async (req, res) => {
  try {
    console.log("📊 학생 데이터 통계 조회");

    const [studentCount, commentCount, recentStudents] = await Promise.all([
      prisma.studentData.count(),
      prisma.studentComment.count(),
      prisma.studentData.findMany({
        select: { name: true, answers: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

    // 평균 성취도 계산
    let totalCorrect = 0;
    let totalQuestions = 0;

    recentStudents.forEach((student: { name: string; answers: string[] }) => {
      const correct = student.answers.filter(
        (a) => a === "1" || a === "O"
      ).length;
      totalCorrect += correct;
      totalQuestions += student.answers.length;
    });

    const averageScore =
      totalQuestions > 0
        ? Math.round((totalCorrect / totalQuestions) * 100)
        : 0;

    res.json({
      success: true,
      data: {
        overview: {
          totalStudents: studentCount,
          totalComments: commentCount,
          averageScore: averageScore,
        },
        recentActivity: {
          recentStudentsCount: recentStudents.length,
          lastUpdated: recentStudents[0]?.name || "N/A",
        },
      },
      message: "학생 데이터 통계 조회가 완료되었습니다.",
    });
  } catch (error) {
    console.error("❌ 학생 통계 조회 실패:", error);
    const errorMessage =
      error instanceof Error ? error.message : "알 수 없는 오류";
    res.status(500).json({
      success: false,
      error: errorMessage,
      message: "통계 조회에 실패했습니다.",
    });
  }
});

/**
 * @swagger
 * /api/students/swagger:
 *   get:
 *     summary: 학생 관리 API Swagger 문서 (레거시)
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Swagger 문서 반환
 */
// ⚠️ 이 엔드포인트는 현재 미사용 (students-swagger.json 사용)
router.get("/swagger", (req, res) => {
  const swaggerDoc = {
    openapi: "3.0.0",
    info: {
      title: "Student Management API",
      version: "1.0.0",
      description: "학생 데이터 관리 및 코멘트 생성 API",
    },
    paths: {
      "/students/all/correct-wrong": {
        get: {
          summary: "모든 학생 데이터 조회",
          tags: ["Students"],
          responses: {
            "200": { description: "성공" },
          },
        },
      },
      "/students/{id}/correct-wrong": {
        get: {
          summary: "개별 학생 정오답 조회 (AI용)",
          tags: ["Students"],
          responses: {
            "200": { description: "성공" },
          },
        },
      },
      "/api/students/upload-csv": {
        post: {
          summary: "CSV 파일 업로드",
          tags: ["Students"],
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
