import { Router } from "express";
import prisma from "../../../prisma/client";
import { createTemporaryAgent } from "../../services/unifiedAiService"; 
import { CommentSrcTool } from "../../Prompt/CommentSrcPrompt";
import { StudentCommentTool, Student } from "../../Prompt/StudentCommentPrompt";
import { Server as SocketIOServer } from "socket.io";
import { nanoid } from "nanoid";

const BATCH_SIZE = 2; // 최종 코멘트 생성 - 2명씩

export const createAiRouter = (io: SocketIOServer) => {
  const router = Router();

  router.post("/generate-comment-source", async (req, res) => {
    const { feature } = req.body;

    if (
      feature &&
      feature.includes("맞았을 때") &&
      feature.includes("틀렸을 때")
    ) {
      console.warn("🚨 이미 생성된 코멘트가 입력됨. 재귀 호출 차단!");
      return res.status(400).json({
        success: false,
        message: "이미 생성된 코멘트입니다. 문제 특징만 입력해주세요.",
      });
    }

    if (!feature) {
      const errorRequestId = Math.random().toString(36).substring(7);
      console.log(
        `➡️ [${errorRequestId}] /generate-comment-source 진입 (feature 누락)`
      );
      return res
        .status(400)
        .json({ success: false, message: "feature가 필요합니다." });
    }

    const requestId = Math.random().toString(36).substring(7);
    console.log(`➡️ [${requestId}] /generate-comment-source 핸들러 진입`);
    console.log(
      `🤖 [API 1 / ${requestId}] 코멘트 소스 생성 시작. 특징: ${feature}`
    );

    try {
      console.log(`⏳ [${requestId}] createTemporaryAgent 호출 시작`); //  로그 변경
      const agent = await createTemporaryAgent(); // 변경
      console.log(`✅ [${requestId}] createTemporaryAgent 호출 완료`); //  로그 변경

      const commentTool = new CommentSrcTool();
      const commentPrompt = commentTool.generatePrompt(feature);

      console.log(`⏳ [${requestId}] agent.conversate 호출 시작`);
      const commentResult = await agent.conversate(commentPrompt);
      console.log(`✅ [${requestId}] agent.conversate 호출 완료`);

      let commentSrc = "";
      const assistantMsg = commentResult.find(
        (r: any) => r.type === "assistantMessage" && "text" in r
      );

      if (assistantMsg) {
        commentSrc = (assistantMsg as any).text.trim();
        console.log(`✅ [API 1 / ${requestId}] 코멘트 소스 생성 완료.`);
        res.json({ success: true, commentSource: commentSrc });
        console.log(`⬅️ [${requestId}] 응답 전송 완료`);
      } else {
        console.error(`🤷 [${requestId}] Assistant 메시지 없음`);
        throw new Error("AI가 문제별 코멘트 소스를 생성하지 못했습니다.");
      }
    } catch (error) {
      console.error(`❌ [${requestId}] 코멘트 소스 생성 API 오류:`, error);
      const errorMessage =
        error instanceof Error ? error.message : "알 수 없는 오류";

      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: "AI 작업 처리 실패",
          error: errorMessage,
        });
        console.log(`⬅️ [${requestId}] 오류 응답 전송 완료`);
      } else {
        console.error(
          `🚨 [${requestId}] 오류 발생했으나 헤더가 이미 전송되어 응답 불가`
        );
      }
    } finally {
      console.log(`🏁 [${requestId}] 핸들러 실행 종료`);
    }
  });

  // ============================================
  // 🎯 수정된 학생별 코멘트 적용 (순차 2명 배치)
  // ============================================

  router.post("/apply-source-to-students", async (req, res) => {
    const { commentSource, socketId } = req.body;
    if (!commentSource) {
      return res
        .status(400)
        .json({ success: false, message: "commentSource가 필요합니다." });
    }

    const requestId = nanoid(6);
    console.log(`➡️ [${requestId}] /apply-source-to-students 핸들러 진입`);
    console.log(`🤖 [API 2 / ${requestId}] 코멘트 적용 및 저장 시작.`);


  // ✅ 즉시 응답 (Socket으로 진행 상황 전송)
    res.json({
      success: true,
      message: "코멘트 생성 시작됨. 진행 상황은 실시간으로 전송됩니다.",
      requestId,
    });

    try {
      const studentCommentTool = new StudentCommentTool();
      const students = await prisma.studentData.findMany({
        select: {
          id: true,
          name: true,
          answers: true,
          arrivalNote: true,
          participationLevel: true,
          prevHomeworkLevel: true,
          specialNote: true,
        },
        orderBy: { createdAt: "asc" },
      });

      console.log(
        `📊 총 ${students.length}명을 ${BATCH_SIZE}명씩 순차 배치 처리`
      );

      let processedCount = 0;
      const failedStudents: string[] = [];

      // ✅ 2명씩 배치 생성
      for (let i = 0; i < students.length; i += BATCH_SIZE) {
        const batch = students.slice(
          i,
          Math.min(i + BATCH_SIZE, students.length)
        );
        const batchIndex = Math.floor(i / BATCH_SIZE) + 1;
        const totalBatches = Math.ceil(students.length / BATCH_SIZE);

        console.log(
          `\n📦 [배치 ${batchIndex}/${totalBatches}] ${batch
            .map((s) => s.name)
            .join(", ")} 처리 시작`
        );

        // 배치 내 학생들 순차 처리 (2명)
        for (const student of batch) {
          try {
            console.log(
              `📝 [${processedCount + 1}/${students.length}] ${student.name} 학생 코멘트 생성 중...`
            );

            // 🎯 Socket: 처리 시작 신호
            io.emit("progressUpdate", {
              type: "student_processing",
              current: processedCount + 1,
              total: students.length,
              studentName: student.name,
              status: "processing",
              timestamp: new Date(),
            });

            // 각 학생마다 독립 Agent 생성
            const agent = await createTemporaryAgent();

            // 프롬프트 생성 (StudentCommentTool 사용 - 프롬프트 형식 기존 정의 준수)
            const prompt = studentCommentTool.generatePrompt(
              student as Student,
              commentSource
            );

            // AI 실행 (옵션 지정하지 않음 - Agentica 기본값 사용)
            const result = (await Promise.race([
              agent.conversate(prompt),
              new Promise((_, reject) =>
                setTimeout(() => reject(new Error("AI 응답 타임아웃")), 30000)
              ),
            ])) as any[];

            console.log(result);

            // assistantMessage 추출
            const finalMessage = result
              .filter((r) => r.type === "assistantMessage")
              .pop();

            if (!finalMessage?.text) {
              throw new Error("AI 응답이 없습니다");
            }

            // DB 저장 (upsert)
            await prisma.studentComment.upsert({
              where: { studentDataId: student.id },
              update: {
                generatedText: finalMessage.text,
                createdAt: new Date(),
              },
              create: {
                generatedText: finalMessage.text,
                studentData: { connect: { id: student.id } },
              },
            });

            processedCount++;
            console.log(
              `✅ [${processedCount}/${students.length}] ${student.name} 코멘트 저장 완료`
            );

            // 🎯 Socket: 성공 신호 + 코멘트 포함
            io.emit("progressUpdate", {
              type: "student_completed",
              current: processedCount,
              total: students.length,
              studentName: student.name,
              status: "success",
              comment: finalMessage.text,
              timestamp: new Date(),
            });

          } catch (error) {
            console.error(`❌ ${student.name} 코멘트 생성 실패:`, error);
            failedStudents.push(student.name);
            processedCount++;

            // 🎯 Socket: 실패 신호
            io.emit("progressUpdate", {
              type: "student_completed",
              current: processedCount,
              total: students.length,
              studentName: student.name,
              status: "failed",
              error: error instanceof Error ? error.message : "알 수 없는 오류",
              timestamp: new Date(),
            });
          }
        }

        console.log(`✅ [배치 ${batchIndex}/${totalBatches}] 완료`);

        // ⏱️ 배치 간 1초 대기
        if (i + BATCH_SIZE < students.length) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }

      console.log(
        `✅ [API 2 / ${requestId}] ${processedCount}명의 코멘트 DB 저장 완료.`
      );

      // 🎯 Socket: 최종 완료 신호
      io.emit("progressUpdate", {
        type: "all_completed",
        total: students.length,
        success: processedCount,
        failed: failedStudents.length,
        failedStudents,
        timestamp: new Date(),
      });

    } catch (error) {
      console.error(`❌ [${requestId}] 코멘트 적용 API 오류:`, error);

      // 🎯 Socket: 치명적 오류 신호
      io.emit("progressUpdate", {
        type: "error",
        message: error instanceof Error ? error.message : "알 수 없는 오류",
        timestamp: new Date(),
      });
    } finally {
      console.log(`🏁 [${requestId}] 핸들러 실행 종료`);
    }
  });


  router.post("/final-feedbacks", async (req, res) => {
    const { studentDataId, generatedText, isSentToParent } = req.body;

    if (!studentDataId) {
      return res.status(400).json({ message: "studentDataId가 필요합니다." });
    }

    try {
      console.log(`📝 최종 피드백 [UPSERT] 시작: ${studentDataId}`);

      const finalFeedback = await prisma.studentComment.upsert({
        where: {
          studentDataId: studentDataId,
        },
        update: {
          generatedText: generatedText,
          isSentToParent: isSentToParent ?? false,
          createdAt: new Date(),
        },
        create: {
          generatedText,
          isSentToParent: isSentToParent ?? false,
          studentData: {
            connect: { id: studentDataId },
          },
        },
      });

      console.log(`✅ 최종 피드백 [UPSERT] 완료: ${finalFeedback.id}`);
      res.json(finalFeedback);
    } catch (error) {
      console.error("❌ 최종 피드백 생성/수정 실패:", error);
      const errorMessage =
        error instanceof Error ? error.message : "알 수 없는 오류";
      res
        .status(500)
        .json({ message: "최종 피드백 처리 실패", error: errorMessage });
    }
  });

  return router;
};
