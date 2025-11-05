import { Router } from "express";
import prisma from "../../../prisma/client";

const router = Router();

router.delete("/delete-all", async (req, res) => {
  try {
    const confirm = String(req.query.confirm || "").toLowerCase();
    if (confirm !== "true") {
      return res.status(400).json({
        success: false,
        message:
          "삭제를 실행하려면 쿼리 파라미터 ?confirm=true 를 포함하여 요청하세요. (주의: 복구 불가)",
      });
    }

    console.log("🗑️ [ADMIN] DB 전체 삭제 요청 수신 (인증 없이 실행)");

    const [deletedComments, deletedStudents, deletedClassRecords] =
      await prisma.$transaction([
        prisma.studentComment.deleteMany(),
        prisma.studentData.deleteMany(),
        prisma.classRecord.deleteMany(),
      ]);

    console.log(
      `✅ 삭제 완료: studentComments=${deletedComments.count}, studentData=${deletedStudents.count}, classRecords=${deletedClassRecords.count}`
    );

    return res.json({
      success: true,
      message:
        "DB 내 StudentComment, StudentData, ClassRecord 데이터가 삭제되었습니다.",
      deleted: {
        studentComments: deletedComments.count,
        studentData: deletedStudents.count,
        classRecords: deletedClassRecords.count,
      },
    });
  } catch (error) {
    console.error("❌ DB 전체 삭제 실패:", error);
    const errorMessage =
      error instanceof Error ? error.message : "알 수 없는 오류";
    return res.status(500).json({
      success: false,
      message: "DB 전체 삭제 도중 오류가 발생했습니다.",
      error: errorMessage,
    });
  }
});

export default router;
