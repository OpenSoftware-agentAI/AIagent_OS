import { Router } from "express";
import prisma from "../../../prisma/client";
import fs from "fs";
import path from "path";

const router = Router();

router.get("/all", async (_, res) => {
  try {
    console.log("👥 학생 목록 조회");
    const students = await prisma.studentData.findMany({
      select: { id: true, name: true },
    });
    res.json(students);
  } catch (error) {
    console.error("❌ 학생 목록 조회 실패:", error);
    const errorMessage =
      error instanceof Error ? error.message : "알 수 없는 오류";
    res.status(500).json({ message: "DB 조회 실패", error: errorMessage });
  }
});

router.get("/all/ids", async (req, res) => {
  try {
    console.log("🆔 학생 ID 목록 조회");
    const students = await prisma.studentData.findMany({
      select: { id: true, name: true },
      orderBy: { createdAt: "asc" },
    });
    console.log(`✅ ${students.length}명의 학생 ID 반환`);
    res.json(students);
  } catch (error) {
    console.error("❌ 학생 ID 목록 조회 실패:", error);
    const errorMessage =
      error instanceof Error ? error.message : "알 수 없는 오류";
    res.status(500).json({ message: "DB 조회 실패", error: errorMessage });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const student = await prisma.studentData.findUnique({
      where: { id },
      include: {
        studentComment: true,
      },
    });

    if (!student) {
      return res.status(404).send("<h1>학생을 찾을 수 없습니다.</h1>");
    }

    const classInfo = await prisma.classRecord.findFirst({
      orderBy: { createdAt: "desc" },
    });

    const templatePath = path.join(__dirname, "../../templates/student.html");
    let html = fs.readFileSync(templatePath, "utf-8");

    const replacements: Record<string, string> = {
      classDate: new Date().toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long",
      }),
      gradeAndClass: classInfo?.gradeAndClass || "미입력",
      name: student.name,

      arrivalNote: student.arrivalNote || "-",
      specialNote: student.specialNote || "-",

      textbook_1: classInfo?.textbook_1 || "-",
      contents_1_1: classInfo?.contents_1?.[0] || "",
      contents_1_2: classInfo?.contents_1?.[1] || "",
      contents_1_3: classInfo?.contents_1?.[2] || "",

      textbook_2: classInfo?.textbook_2 || "-",
      contents_2_1: classInfo?.contents_2?.[0] || "",
      contents_2_2: classInfo?.contents_2?.[1] || "",
      contents_2_3: classInfo?.contents_2?.[2] || "",

      participation_1: student.participationLevel?.[0] || "",
      participation_2: student.participationLevel?.[1] || "",
      participation_3: student.participationLevel?.[2] || "",
      participation_4: student.participationLevel?.[3] || "",
      participation_5: student.participationLevel?.[4] || "",
      participation_6: student.participationLevel?.[5] || "",

      prevHomework_1: student.prevHomeworkLevel?.[0] || "",
      prevHomework_2: student.prevHomeworkLevel?.[1] || "",
      prevHomework_3: student.prevHomeworkLevel?.[2] || "",
      prevHomework_4: student.prevHomeworkLevel?.[3] || "",
      prevHomework_5: student.prevHomeworkLevel?.[4] || "",
      prevHomework_6: student.prevHomeworkLevel?.[5] || "",

      homework_1: classInfo?.this_homework?.[0] || "",
      homework_2: classInfo?.this_homework?.[1] || "",

      simple_range_1: classInfo?.simple_exam_range?.[0] || "",
      simple_range_2: classInfo?.simple_exam_range?.[1] || "",
      simple_range_3: classInfo?.simple_exam_range?.[2] || "",
      simple_range_4: classInfo?.simple_exam_range?.[3] || "",
      simple_range_5: classInfo?.simple_exam_range?.[4] || "",

      detailed_range_1: classInfo?.detailed_exam_range?.[0] || "",
      detailed_range_2: classInfo?.detailed_exam_range?.[1] || "",
      detailed_range_3: classInfo?.detailed_exam_range?.[2] || "",
      detailed_range_4: classInfo?.detailed_exam_range?.[3] || "",
      detailed_range_5: classInfo?.detailed_exam_range?.[4] || "",

      answer_1: student.answers?.[0] || "",
      answer_2: student.answers?.[1] || "",
      answer_3: student.answers?.[2] || "",
      answer_4: student.answers?.[3] || "",
      answer_5: student.answers?.[4] || "",

      generatedText:
        student.studentComment?.generatedText ||
        "코멘트가 아직 생성되지 않았습니다.",
    };

    for (const [key, value] of Object.entries(replacements)) {
      const regex = new RegExp(`{{${key}}}`, "g");
      html = html.replace(regex, value);
    }

    res.send(html);
  } catch (error) {
    console.error("❌ 학생 페이지 생성 오류:", error);
    res.status(500).send("<h1>페이지 생성 중 오류가 발생했습니다.</h1>");
  }
});

router.get("/all/correct-wrong", async (req, res) => {
  try {
    console.log("📊 모든 학생 정오답 조회");
    const students = await prisma.studentData.findMany();
    console.log(`✅ ${students.length}명의 학생 데이터 반환`);
    res.json(students);
  } catch (error) {
    console.error("❌ 학생 정오답 조회 실패:", error);
    const errorMessage =
      error instanceof Error ? error.message : "알 수 없는 오류";
    res.status(500).json({ message: "DB 조회 실패", error: errorMessage });
  }
});


/**
 * @swagger
 * /students/{id}/correct-wrong:
 *   get:
 *     summary: 특정 학생의 정오답 정보 조회 (AI용)
 *     operationId: students_correct_wrong_getById
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

export default router;
