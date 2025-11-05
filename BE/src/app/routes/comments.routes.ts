import { Router } from "express";
import prisma from "../../../prisma/client";

const router = Router();

router.get("/final/search", async (req, res) => {
  const { name } = req.query;

  if (!name || typeof name !== "string") {
    return res.status(400).json({
      success: false,
      message: "학생 이름(name)이 필요합니다.",
    });
  }

  try {
    console.log(`🔍 '${name}' 학생 코멘트 검색 시작`);

    const student = await prisma.studentData.findFirst({
      where: { name: { contains: name } },
      select: {
        name: true,
        studentComment: {
          select: { generatedText: true },
        },
      },
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: `'${name}' 학생을 찾을 수 없습니다.`,
      });
    }

    if (!student.studentComment) {
      return res.status(404).json({
        success: false,
        message: `'${student.name}' 학생의 코멘트가 존재하지 않습니다.`,
      });
    }

    return res.json({
      success: true,
      name: student.name,
      comment: student.studentComment.generatedText,
    });
  } catch (error) {
    console.error("❌ 학생 코멘트 검색 실패:", error);
    return res.status(500).json({
      success: false,
      message: "학생 코멘트 검색 중 오류가 발생했습니다.",
      error: error instanceof Error ? error.message : "알 수 없는 오류",
    });
  }
});

// 전체 학생 최종 코멘트 조회 (3명씩 분할)
router.get("/final/all", async (req, res) => {
   const { group } = req.query;
  try {
    console.log(`🔍 전체 학생 코멘트 조회 시작`);

    // 모든 학생 조회
    const students = await prisma.studentData.findMany({
      select: {
        name: true,
        studentComment: {
          select: { generatedText: true },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    if (students.length === 0) {
      return res.status(404).json({
        success: false,
        message: "조회된 학생이 없습니다.",
      });
    }

    // 코멘트가 있는 학생만 필터링
    const studentsWithComments = students.filter(
      (s) => s.studentComment?.generatedText
    );

    if (studentsWithComments.length === 0) {
      return res.status(404).json({
        success: false,
        message: "생성된 코멘트가 없습니다.",
      });
    }

    //  3명씩 분할
    const chunkSize = 3;
    const chunks: Array<Array<{ name: string; comment: string }>> = [];

    for (let i = 0; i < studentsWithComments.length; i += chunkSize) {
      const chunk = studentsWithComments.slice(i, i + chunkSize).map((s) => ({
        name: s.name,
        comment: s.studentComment!.generatedText,
      }));
      chunks.push(chunk);
    }
    
    // 특정 그룹만 요청된 경우
    if (group && !isNaN(Number(group))) {
      const groupIndex = Number(group) - 1;
      
      if (groupIndex < 0 || groupIndex >= chunks.length) {
        return res.status(400).json({
          success: false,
          message: `그룹 ${group}은(는) 존재하지 않습니다. (1-${chunks.length})`
        });
      }
      
      console.log(`✅ 그룹 ${group} 조회 완료 (${chunks[groupIndex].length}명)`);
      
      return res.json({
        success: true,
        total: studentsWithComments.length,
        totalChunks: chunks.length,
        currentGroup: Number(group),
        groupData: chunks[groupIndex], // 단일 그룹
      });
    }

    // 전체 조회 (모든 그룹)
    console.log(
      `✅ 전체 ${studentsWithComments.length}명의 코멘트 조회 완료 (${chunks.length}개 청크)`
    );

    return res.json({
      success: true,
      total: studentsWithComments.length,
      chunks: chunks.length,
      allGroups: chunks, // 모든 그룹 (순차 전송용)
    });
  } catch (error) {
    console.error("❌ 전체 학생 코멘트 조회 실패:", error);
    return res.status(500).json({
      success: false,
      message: "전체 학생 코멘트 조회 중 오류가 발생했습니다.",
      error: error instanceof Error ? error.message : "알 수 없는 오류",
    });
  }
});



export default router;
