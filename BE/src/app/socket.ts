import { Server as SocketIOServer, Socket } from "socket.io";
import { Server as HTTPServer } from "http";
import { processUnifiedMessage } from "../services/unifiedAiService";
import prisma from "../../prisma/client";
import { readClassInfo } from "../tools/readers/readClassInfo";
import { readStudentAnswers } from "../tools/readers/readStudentAnswers";
import { deleteSession } from "../services/unifiedAiService";

import {
  createMultipleStudentData,
  createClassRecord,
} from "../services/insertData";

const userStates = new Map<
  string,
  { commentSource: string | null; isProcessing: boolean }
>();

interface GenerateSourceResponse {
  success: boolean;
  commentSource?: string;
  message?: string;
}

interface ApplySourceResponse {
  success: boolean;
  commentsGenerated?: number;
  studentsAnalyzed?: number;
  preview?: Array<{
    studentId: string;
    studentName: string;
    commentPreview: string;
  }>;
  message?: string;
}

export function setupWebSocket(server: HTTPServer) {
  const io = new SocketIOServer(server, {
    cors: {
      origin: [
        "https://tory-edumate.netlify.app",
        "https://aiagent-edumate.netlify.app",
        "http://localhost:5173/chat",
        "http://localhost:3000",
      ],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  console.log("🔌 WebSocket 서버 초기화: 통합 AI 서비스 연결");

  io.on("connection", (socket) => {
    console.log("👤 사용자 연결:", socket.id);

    userStates.set(socket.id, { commentSource: null, isProcessing: false });

    socket.emit(
      "receiveMessage",
      `✅ 연결 완료! AI 교육 비서입니다.

**사용 가능한 기능:**
📊 학생 데이터 분석 및 보고서 생성
📝 맞춤형 학부모 코멘트 작성
📁 CSV 파일 업로드 및 처리

무엇을 도와드릴까요?`
    );

    socket.on("fileUploaded", async (data) => {
      console.log("📁 [fileUploaded] 파일 업로드 완료 이벤트 수신:", data);

      try {
        const { fileName, filePath, fileType } = data;

        if (fileType === "csv") {
          console.log("📊 CSV 파일 처리 시작:", filePath);

          const students = await readStudentAnswers(filePath);
          await createMultipleStudentData(students);
          console.log(
            `✅ ${students.length}명의 학생 데이터가 저장되었습니다.`
          );

          const classInfo = await readClassInfo(filePath);
          await createClassRecord(classInfo);
          console.log("✅ 학급 정보(classRecord)가 저장되었습니다.");

          const response = `✅ CSV 파일 "${fileName}"이 성공적으로 업로드되었습니다.

📊 **저장된 데이터**:
- 학생 데이터: ${students.length}명
- 학급 정보: ${classInfo.gradeAndClass}
- 1교시 교재: ${classInfo.unit1_textbook}
- 2교시 교재: ${classInfo.unit2_textbook}

이제 **"문제별 코멘트 작성해줘"**라고 말씀해주시면, 학생별 맞춤 보고서를 생성해드리겠습니다.`;

          socket.emit("receiveMessage", response);
        }
      } catch (error) {
        console.error("❌ 파일 업로드 이벤트 처리 오류:", error);
        const errorMessage =
          error instanceof Error ? error.message : "알 수 없는 오류";
        socket.emit(
          "receiveMessage",
          `파일 처리 중 오류가 발생했습니다: ${errorMessage}`
        );
      }
    });

    socket.on("sendMessage", async (message) => {
      console.log("📥 [sendMessage] 메시지 수신:", message);
      await handleUserMessage(socket, message, socket.id);
    });

    socket.on("user-message", async (data) => {
      console.log("📥 [user-message] 메시지 수신:", data);
      await handleUserMessage(socket, data, socket.id);
    });

    socket.on("disconnect", () => {
      console.log("👋 사용자 연결 해제:", socket.id);
      userStates.delete(socket.id);
      // 세션 히스토리 삭제
      deleteSession(socket.id);
    });

    socket.on("error", (error) => {
      console.error("🔴 WebSocket 에러:", error);
    });
  });

async function handleUserMessage(socket: any, data: any, userId: string) {
    const state = userStates.get(userId);
    if (!state) {
      console.error(`🚨 [${userId}] 사용자 상태를 찾을 수 없음!`);
      return;
    }

    if (state.isProcessing) {
      console.warn(`⏳ [${userId}] 이전 요청 처리 중. 새 요청 무시:`, data);
      socket.emit(
        "receiveMessage",
        "⏳ 이전 요청을 처리 중입니다. 잠시만 기다려주세요."
      );
      return;
    }

    try {
      state.isProcessing = true;
      console.log("🎯 메시지 처리 시작, 수신 데이터: ", data);

      let message = "";
      if (typeof data === "string") {
        message = data;
      } else if (data && typeof data === "object") {
        message =
          data.message || data.text || data.content || JSON.stringify(data);
      } else {
        message = "메시지를 파싱할 수 없습니다.";
      }

      const isFeatureInput = message.match(/\d+번/);
      const isRequestingComment =
        (message.includes("코멘트") || message.includes("보고서")) &&
        !(
          message.includes("조회") ||
          message.includes("확인") ||
          message.includes("검색") ||
          message.includes("보기")
        );

      const isConfirmation =
        message.toLowerCase().includes("예") ||
        message.toLowerCase().includes("적용");

      if (isFeatureInput && !state.commentSource) {
        console.log(`📌 [${userId}] 시나리오 1: 코멘트 소스 생성 진입`);

        const studentCount = await prisma.studentData.count();
        if (studentCount === 0) {
          socket.emit(
            "receiveMessage",
            "❌ 학생 데이터가 없습니다. 먼저 CSV 파일을 업로드해주세요."
          );
          return;
        }

        console.log(`✅ [Data Check] ${studentCount}명의 학생 데이터 확인.`);
        socket.emit(
          "receiveMessage",
          `⏳ 문제 특징을 분석하여 코멘트 초안을 작성 중입니다...\n(약 10-20초 소요)`
        );

        const response = await fetch(
          "http://localhost:3000/ai/generate-comment-source",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ feature: message }),
          }
        );

        if (!response.ok) {
          const errorBody = await response.text();
          console.error(`❌ API 1 호출 실패 (${response.status}):`, errorBody);
          throw new Error(`코멘트 소스 생성 실패 (${response.status})`);
        }

        const result = (await response.json()) as GenerateSourceResponse;

        if (result.success && result.commentSource) {
          state.commentSource = result.commentSource;
          console.log("✅ [Step 1] 코멘트 소스 생성 및 저장 완료.");

          const reply = `📝 **문제별 코멘트 초안 생성 완료**\n\n${result.commentSource}\n\n💬 이 초안을 ${studentCount}명의 학생에게 적용하여 개별 코멘트를 생성하시겠습니까?\n("예" 또는 "적용"이라고 답해주세요)`;
          socket.emit("receiveMessage", reply);
        } else {
          console.error("❌ API 1 응답 오류:", result);
          throw new Error(result.message || "코멘트 소스 생성 실패");
        }
        return;
      } else if (isConfirmation && state.commentSource) {
        console.log(`📌 [${userId}] 시나리오 2: 코멘트 적용 진입`);

        const sourceToUse = state.commentSource;
        state.commentSource = null;

        const studentCount = await prisma.studentData.count();
        socket.emit(
          "receiveMessage",
          `⏳ ${studentCount}명의 학생별 맞춤 코멘트를 생성하고 있습니다...\n(약 ${
            studentCount * 3
          }초 소요)\n\n📊 진행 완료 후 메세지를 전달해드릴게요.:`
        );

        console.log("📞 [Step 2] 코멘트 적용 API 호출...");

        const response = await fetch(
          "http://localhost:3000/ai/apply-source-to-students",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              commentSource: sourceToUse,
              socketId: socket.id,
            }),
          }
        );

        if (!response.ok) {
          const errorBody = await response.text();
          console.error(`❌ API 2 호출 실패 (${response.status}):`, errorBody);
          throw new Error(`코멘트 적용 실패 (${response.status})`);
        }

        const result = (await response.json()) as ApplySourceResponse;

        // ✅ 수정: 즉시 응답만 받고 진행상황은 Socket progressUpdate로 받음
        if (result.success) {
          console.log(
            `✅ [Step 2] 코멘트 적용 API 호출 완료. 백그라운드에서 처리 중...`
          );

          // ✅ 백그라운드 처리 시작 - progressUpdate 이벤트를 기다림
          console.log(
            `⏳ [${socket.id}] progressUpdate 이벤트 수신 대기 중...`
          );

          // progressUpdate 이벤트를 수신할 때까지 대기
          // (ai.routes.ts에서 io.emit("progressUpdate", ...)로 전송됨)

          return; // 즉시 반환 (Socket 이벤트로 진행상황 전송)
        } else {
          console.error("❌ API 2 응답 오류:", result);
          throw new Error(result.message || "코멘트 적용 실패");
        }
      } else if (
        isRequestingComment &&
        !isFeatureInput &&
        !state.commentSource
      ) {
        console.log(`📌 [${userId}] 시나리오 3: 특징 입력 유도 진입`);
        socket.emit(
          "receiveMessage",
          `💬 **문제별 코멘트를 생성하겠습니다.**\n\n문제 특징을 알려주세요.\n\n예시:\n1번) 이등변삼각형 밑각 증명\n2번) 삼각형의 외심\n3번) 직각삼각형의 합동 조건\n4번) 중점연결정리\n5번) 평행선과 선분의 비`
        );
        return;
      } else {
        console.log("🤖 일반 AI 서비스 호출 (processUnifiedMessage)...");
        const aiResponse = await processUnifiedMessage(message, socket.id);
        console.log("✅ AI 응답 생성 완료");

        // 그룹별 순차 전송 처리
        if (aiResponse.includes("__GROUPS_START__")) {
          const groupsMatch = aiResponse.match(
            /__GROUPS_START__\n([\s\S]*?)\n__GROUPS_END__/
          );
          const totalMatch = aiResponse.match(/__TOTAL__:(\d+)/);
          const chunksMatch = aiResponse.match(/__CHUNKS__:(\d+)/);

          if (groupsMatch && totalMatch && chunksMatch) {
            try {
              const allGroups = JSON.parse(groupsMatch[1]);
              const total = parseInt(totalMatch[1]);
              const chunks = parseInt(chunksMatch[1]);

              console.log(
                `📦 [${socket.id}] 그룹별 순차 전송 시작 (${chunks}개 그룹)`
              );

              // 각 그룹을 순차적으로 전송
              for (let i = 0; i < allGroups.length; i++) {
                const group = allGroups[i];
                let groupMessage = `📋 **그룹 ${i + 1} (${
                  group.length
                }명)**\n\n`;

                group.forEach((student: any, idx: number) => {
                  groupMessage += `🧾 **${student.name} 학생의 코멘트:**\n\n`;
                  groupMessage += `${student.comment}\n\n`;

                  if (idx < group.length - 1) {
                    groupMessage += `---\n\n`;
                  }
                });

                // 그룹 전송
                socket.emit("receiveMessage", groupMessage);
                console.log(`📤 [${socket.id}] 그룹 ${i + 1} 전송 완료`);

                // 다음 그룹 전송 전 짧은 지연
                if (i < allGroups.length - 1) {
                  await new Promise((resolve) => setTimeout(resolve, 500));
                }
              }

              // 완료 메시지
              socket.emit(
                "receiveMessage",
                `\n✅ 전체 ${total}명의 코멘트를 ${chunks}개 그룹으로 전송했습니다.`
              );
              console.log(`✅ [${socket.id}] 그룹별 순차 전송 완료`);

              return;
            } catch (parseError) {
              console.error("❌ 그룹 데이터 파싱 실패:", parseError);
            }
          }
        }

        // 일반 메시지 전송
        socket.emit("receiveMessage", aiResponse);
      }
      console.log("📤 응답 전송 완료");
    } catch (error) {
      console.error("❌ 메시지 처리 오류:", error);
      console.error(
        "🔍 에러 스택:",
        error instanceof Error ? error.stack : "스택 없음"
      );

      let errorMessage = "죄송합니다. 요청 처리 중 오류가 발생했습니다.";
      if (error instanceof Error) {
        errorMessage = `❌ 오류 발생: ${error.message}\n\n다시 시도해주시거나, 관리자에게 문의해주세요.`;
      }
      socket.emit("receiveMessage", errorMessage);
      console.log("📤 에러 응답 전송 완료");
    } finally {
      if (state) {
        state.isProcessing = false;
        console.log(`🟢 [${userId}] 처리 완료. isProcessing = false`);
      }
    }
  }

  console.log("✅ WebSocket 이벤트 핸들러 등록 완료");
  console.log(
    "📡 대기 중인 이벤트: sendMessage, user-message, fileUploaded, disconnect"
  );


  return io;
}
