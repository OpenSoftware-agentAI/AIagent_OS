// BE/src/services/unifiedAiService.ts (히스토리 관리 + System Prompts 적용)

import { Agentica, IAgenticaHistoryJson } from "@agentica/core";
import { HttpLlm, OpenApi } from "@samchon/openapi";
import { OpenAI } from "openai";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ============================================
// 공통 System Prompts (모든 세션 동일)
// ============================================
const COMMON_SYSTEM_PROMPT = `
당신은 학원 데스크 업무를 돕는 AI 비서입니다.

# 업무 맥락
- 매일 약 10개 반(각 3명 이상의 학생)을 관리합니다
- 각 반마다 같은 범주의 작업을 반복합니다
- 주요 작업: CSV 업로드 (데이터베이스 저장) → 코멘트 생성 → 이미지 생성 → 문자 발송 → 작업 완료 → 데이터베이스 삭제

# 워크플로우
1. CSV 파일 업로드 (학생 정오답 데이터)
2. 문제별 코멘트 초안 작성
3. 학생별 맞춤 코멘트 생성
4. 학생별 최종 코멘트 조회
5. 학생 이미지 생성
6. 학부모에게 MMS 발송

# 중요 규칙
- 각 반마다 별도의 .csv 파일이 올라가고, 데이터베이스에 해당 반 내용이 저장됩니다
- 반(Class)가 다르다면 데이터를 절대 섞지 마세요. 각 반마다 데이터 연관성은 존재하지 않습니다
- 이전 대화의 학생 이름을 참고할 때는 현재 채팅방 내에서만
- "전체 학생"은 현재 업로드된 CSV의 학생들만 의미합니다

# 톤앤매너
- 존댓말 사용
- 간결하고 명확하게
- 진행 상황을 텍스트로 전달

# 중요: 업무 외 질문 처리
만약 학원 업무와 무관한 질문을 받으면:
1. 친절하게 거부
2. 지원 가능한 기능 안내
3. 사용자를 당황하게 하지 말 것

예시:
- "오늘 날씨 어때?" → "죄송하지만 날씨 정보는 제공할 수 없습니다. 
  대신 학생 관리, 코멘트 생성 등의 업무를 도와드립니다."
- "오늘 며칠이야?" → "현재 ${new Date().toLocaleDateString('ko-KR')}입니다. 
  학원 업무가 필요하신가요?"


`.trim();

// ============================================
// 세션별 히스토리 저장소
// ============================================
interface SessionData {
  socketId: string;
  histories: IAgenticaHistoryJson[];
  createdAt: Date;
  lastActiveAt: Date;
}

const sessions = new Map<string, SessionData>();

// ============================================
// Agent 초기화 (기존 유지)
// ============================================
let agentInitializationPromise: Promise<void> | null = null;
let isAgentInitialized = false;

/**
 * 통합 AI 에이전트 초기화 (한 번만 실행)
 * Controller 설정만 담당
 */
export const initializeAgent = async (): Promise<void> => {
  if (isAgentInitialized) {
    return;
  }

  if (agentInitializationPromise) {
    console.log("⏳ 다른 요청의 에이전트 초기화 대기 중...");
    return agentInitializationPromise;
  }

  agentInitializationPromise = (async () => {
    try {
      console.log("🚀 통합 AI 에이전트 초기화 시작...");

      // Controller 설정만 미리 로드 (실제 Agent는 세션별로 생성)
      const studentSwagger = await fetch("http://localhost:3000/students-swagger")
        .then((r) => r.json() as any)
        .catch(() => ({
          openapi: "3.0.0",
          info: { title: "Student API", version: "1.0.0" },
          paths: {
            "/api/students/all/correct-wrong": {
              get: {
                summary: "모든 학생 데이터 조회",
                responses: { "200": { description: "Success" } },
              },
            },
          },
        }));

      const integratedSwagger = await fetch("http://localhost:3000/api/integrated/swagger")
        .then((r) => r.json() as any)
        .catch(() => ({
          openapi: "3.0.0",
          info: { title: "Integrated API", version: "1.0.0" },
          paths: {
            "/api/integrated/sms/send": {
              post: {
                summary: "SMS 전송",
                responses: { "200": { description: "Success" } },
              },
            },
          },
        }));

      console.log("✅ Swagger 문서 로드 완료");
      console.log("🎯 초기화 완료: StudentManagement, IntegratedServices");

      isAgentInitialized = true;
    } catch (error) {
      console.error("❌ 통합 AI 에이전트 초기화 실패:", error);
      const errorMessage = error instanceof Error ? error.message : "알 수 없는 오류";
      throw new Error(`AI 에이전트 초기화 실패: ${errorMessage}`);
    } finally {
      agentInitializationPromise = null;
    }
  })();

  return agentInitializationPromise;
};

/**
 * 세션별 Agent 생성
 * 각 세션의 히스토리를 포함한 독립된 Agent 반환
 */

const createSessionAgent = async (socketId: string): Promise<Agentica<"chatgpt">> => {
  await initializeAgent();

  const session = sessions.get(socketId);
  const histories = session?.histories || [];

  console.log(`🤖 세션 [${socketId}] Agent 생성 (히스토리: ${histories.length}개)`);

  // ✅ 히스토리만 전달 (System Prompt는 메시지에 포함)
  const agent = new Agentica({
    model: "chatgpt",
    vendor: {
      api: openai,
      model: "gpt-4o-mini",
    },
    histories: histories, // ✅ conversate() 반환값만
    controllers: [
      {
        name: "StudentManagementController",
        protocol: "http",
        application: HttpLlm.application({
          document: OpenApi.convert(
            await fetch("http://localhost:3000/students-swagger")
              .then((r) => r.json() as any)
              .catch(() => ({
                openapi: "3.0.0",
                info: { title: "Student API", version: "1.0.0" },
                paths: {},
              }))
          ),
          model: "chatgpt",
        }),
        connection: {
          host: "http://localhost:3000",
          headers: { "Content-Type": "application/json" },
        },
      },
      {
        name: "IntegratedServicesController",
        protocol: "http",
        application: HttpLlm.application({
          document: OpenApi.convert(
            await fetch("http://localhost:3000/api/integrated/swagger")
              .then((r) => r.json() as any)
              .catch(() => ({
                openapi: "3.0.0",
                info: { title: "Integrated API", version: "1.0.0" },
                paths: {},
              }))
          ),
          model: "chatgpt",
        }),
        connection: {
          host: "http://localhost:3000",
          headers: { "Content-Type": "application/json" },
        },
      },
    ],
  });

  return agent;
};

// ============================================
// 세션 관리 함수
// ============================================

/**
 * 세션 생성 또는 업데이트
 */
const getOrCreateSession = (socketId: string): SessionData => {
  let session = sessions.get(socketId);

  if (!session) {
    session = {
      socketId,
      histories: [],
      createdAt: new Date(),
      lastActiveAt: new Date(),
    };
    sessions.set(socketId, session);
    console.log(`✅ 새 세션 생성: ${socketId}`);
  } else {
    session.lastActiveAt = new Date();
  }

  return session;
};

/**
 * 세션 삭제
 */
export const deleteSession = (socketId: string): void => {
  const session = sessions.get(socketId);
  if (session) {
    console.log(`🗑️ 세션 삭제: ${socketId} (히스토리: ${session.histories.length}개)`);
    sessions.delete(socketId);
  }
};

/**
 * 세션 통계
 */
export const getSessionStats = () => {
  return {
    totalSessions: sessions.size,
    sessions: Array.from(sessions.values()).map((s) => ({
      socketId: s.socketId,
      historyCount: s.histories.length,
      createdAt: s.createdAt,
      lastActiveAt: s.lastActiveAt,
    })),
  };
};


/**
 * 임시 세션용 Agent 생성 (REST API용)
 * 히스토리 없이 깨끗한 Agent 반환
 */
export const createTemporaryAgent = async (): Promise<Agentica<"chatgpt">> => {
  await initializeAgent();

  console.log(`🤖 임시 Agent 생성 (REST API용, 히스토리 없음)`);

  // 빈 히스토리 (System Prompt는 메시지에 포함)
  const agent = new Agentica({
    model: "chatgpt",
    vendor: {
      api: openai,
      model: "gpt-4o-mini",
    },
    histories: [], //  빈 배열
    controllers: [
      {
        name: "StudentManagementController",
        protocol: "http",
        application: HttpLlm.application({
          document: OpenApi.convert(
            await fetch("http://localhost:3000/students-swagger")
              .then((r) => r.json() as any)
              .catch(() => ({
                openapi: "3.0.0",
                info: { title: "Student API", version: "1.0.0" },
                paths: {},
              }))
          ),
          model: "chatgpt",
        }),
        connection: {
          host: "http://localhost:3000",
          headers: { "Content-Type": "application/json" },
        },
      },
      {
        name: "IntegratedServicesController",
        protocol: "http",
        application: HttpLlm.application({
          document: OpenApi.convert(
            await fetch("http://localhost:3000/api/integrated/swagger")
              .then((r) => r.json() as any)
              .catch(() => ({
                openapi: "3.0.0",
                info: { title: "Integrated API", version: "1.0.0" },
                paths: {},
              }))
          ),
          model: "chatgpt",
        }),
        connection: {
          host: "http://localhost:3000",
          headers: { "Content-Type": "application/json" },
        },
      },
    ],
  });

  return agent;
};

/**
 * 통합 AI 메시지 처리
 * @param userMessage 사용자 메시지
 * @param socketId 세션 식별자 (socket.id)
 */
export async function processUnifiedMessage(
  userMessage: string,
  socketId: string // ✅ socketId 추가
): Promise<string> {
  try {
    console.log(`🔧 [${socketId}] 통합 AI 메시지 처리 시작`);
    console.log(`📝 입력 메시지: ${userMessage}`);

    const session = getOrCreateSession(socketId);

    // 첫 대화인 경우 System Prompt를 메시지 앞에 추가
    let contextualMessage = userMessage;
    
    if (session.histories.length === 0) {
      console.log(`📋 [${socketId}] 첫 대화 - System Prompt 추가`);
      contextualMessage = `${COMMON_SYSTEM_PROMPT}\n\n===사용자 요청===\n${userMessage}`;
    }

    // ========== 1단계: 컨텍스트 추가 ==========

    if (
      userMessage.includes("파일") ||
      userMessage.includes("업로드") ||
      userMessage.includes("CSV")
    ) {
      contextualMessage += `\n\n[시스템 정보: 파일 업로드 기능이 활성화되어 있습니다. 필요시 /api/integrated/files/analyze 엔드포인트를 활용하세요.]`;
    }

    if (
      userMessage.includes("학생") ||
      userMessage.includes("성적 코멘트") ||
      userMessage.includes("코멘트")
    ) {
      contextualMessage += `\n\n[시스템 정보: 학생 관리 기능이 활성화되어 있습니다. /api/students/ 엔드포인트들을 활용하세요.]`;
    }

    if (
      (userMessage.includes("문자") || userMessage.includes("SMS")) &&
      !userMessage.includes("MMS") &&
      !userMessage.includes("이미지")
    ) {
      contextualMessage += `\n\n[시스템 정보: SMS 발송 기능이 활성화되어 있습니다. /api/integrated/sms/send 엔드포인트를 활용하세요.]`;
    }

    if (
      userMessage.includes("MMS") ||
      (userMessage.includes("문자") && userMessage.includes("이미지")) ||
      (userMessage.includes("전송") && userMessage.includes("이미지")) ||
      userMessage.includes(".jpg") ||
      userMessage.includes(".png") ||
      userMessage.includes(".jpeg")
    ) {
      contextualMessage += `\n\n[시스템 정보: MMS 발송 기능이 활성화되어 있습니다. 이미지 파일과 함께 메시지를 전송하려면 /api/integrated/sms/send-mms 엔드포인트를 사용하세요. 필수 파라미터: to(전화번호), text(메시지 내용), imageFilePath(이미지 파일 절대 경로)]`;
    }

    if (
      userMessage.includes("이미지") ||
      userMessage.includes("캡처") ||
      userMessage.includes("사진")
    ) {
      if (
        userMessage.includes("모든") ||
        userMessage.includes("전체") ||
        userMessage.includes("학생들") ||
        userMessage.includes("전원") ||
        userMessage.match(/\d+명/) ||
        !userMessage.match(/\w+\s*(학생|님)/)
      ) {
        contextualMessage += `\n\n[시스템 정보: 모든 학생의 이미지를 생성하려면 /api/images/generate-all-students 엔드포인트를 사용하세요. 이 API는 데이터베이스의 모든 학생에 대해 이미지를 일괄 생성합니다.]`;
      } else if (userMessage.match(/[가-힣]+\s*(학생|님)/)) {
        contextualMessage += `\n\n[시스템 정보: 특정 학생의 이미지를 생성하려면 /api/images/generate-student/{id} 엔드포인트를 사용하세요. 먼저 /api/students/all/ids로 학생 ID를 조회한 후 사용하세요.]`;
      } else {
        contextualMessage += `\n\n[시스템 정보: 학생 이미지 생성 기능이 활성화되어 있습니다. "학생 이미지"는 모든 학생을 의미하므로 /api/images/generate-all-students 엔드포인트를 사용하세요.]`;
      }
    }

    console.log(`📝 컨텍스트 추가된 메시지: ${contextualMessage.substring(0, 100)}...`);

    // ========== 2단계: Agent 생성 (히스토리 포함) ==========
    const agent = await createSessionAgent(socketId);

    // ========== 3단계: AI 호출 ==========
    console.log(`🤖 [${socketId}] AI 에이전트 대화 시작...`);
    
    const answers = await agent.conversate(contextualMessage);
    console.log(`📋 [${socketId}] AI 에이전트 응답 수신 (${answers.length}개)`);

    if (!Array.isArray(answers)) {
      console.warn("⚠️ AI 응답 형식이 예상과 다릅니다:", answers);
      return "AI 응답을 처리하는 중 문제가 발생했습니다.";
    }

    // ========== 4단계: 히스토리 저장 ==========
    answers.forEach((answer) => {
      if (answer && typeof answer.toJSON === "function") {
        const historyJson = answer.toJSON();
        session.histories.push(historyJson);
      }
    });

    // 히스토리 크기 제한 (최근 20개만 유지)
    const MAX_HISTORY = 20;
    if (session.histories.length > MAX_HISTORY) {
      const removed = session.histories.length - MAX_HISTORY;
      session.histories = session.histories.slice(-MAX_HISTORY);
      console.log(`📦 [${socketId}] 히스토리 정리: ${removed}개 삭제 (현재: ${session.histories.length}개)`);
    }

    console.log(`💾 [${socketId}] 히스토리 저장 완료 (총: ${session.histories.length}개)`);

    // ========== 5단계: 응답 파싱 (기존 로직 유지) ==========
    let response = "";
    let hasExecuted = false;
    let hasAssistantMessage = false;
    const executedResults: Array<{
      operationName: string;
      result: any;
      status: number;
    }> = [];

    // processUnifiedMessage 내부 - Execute 처리 부분
    executedResults.forEach((executed) => {
      console.log(`🔍 [디버깅] 실행된 API: ${executed.operationName}`);
      console.log(`   - 결과: ${JSON.stringify(executed.result).substring(0, 100)}`);
    });

    let skipAssistantMessage = false;


      // assistantMessage 먼저 추출
    for (const answer of answers) {
    if (answer && answer.type === "assistantMessage") {
    hasAssistantMessage = true;
    response += answer.text;
    console.log(`✅ [${socketId}] assistantMessage 추출: ${answer.text.substring(0, 50)}...`);
  }
}

   for (const answer of answers) {
  if (answer && answer.type === "execute") {
    hasExecuted = true;
    const executeResult = answer as any;
    let apiResponse = executeResult.value?.body;
    const status = executeResult.value?.status || 200;

    // ✅ 추가: body가 문자열이면 JSON 파싱
    if (typeof apiResponse === 'string') {
      try {
        console.log(`🔄 [${socketId}] JSON 파싱 시작: ${apiResponse.substring(0, 50)}...`);
        apiResponse = JSON.parse(apiResponse);
        console.log(`✅ [${socketId}] JSON 파싱 완료:`, Object.keys(apiResponse));
      } catch (parseError) {
        console.error(`❌ [${socketId}] JSON 파싱 실패:`, parseError);
        apiResponse = null;
      }
    }

    if (status >= 400) {
      console.warn(`⚠️ API ${executeResult.operation?.name}가 에러 (Status: ${status})`);
    }

    //  수정: apiResponse가 있으면 저장
    if (apiResponse) {
      executedResults.push({
        operationName: executeResult.operation?.name || "unknown",
        result: apiResponse,
        status: status,
      });
      
      console.log(`✅ [${socketId}] executedResults에 저장됨:`, {
        operationName: executeResult.operation?.name,
        resultKeys: typeof apiResponse === 'object' ? Object.keys(apiResponse) : typeof apiResponse
      });
    }
  }
}


    console.log(`📋 [${socketId}] 최종 응답:`, response.substring(0, 100)); 

    // ========== 6단계: 실행 결과 포맷팅 (기존 로직 유지) ==========
    const hasImageGeneration = executedResults.some(
      (r) =>
        r.operationName.includes("generate") &&
        r.operationName.includes("image")
    );
    const hasStudentList = executedResults.some(
      (r) =>
        r.operationName.includes("students_all") ||
        r.operationName.includes("students_all_ids") ||
        r.operationName.includes("students_get")
    );

    const shouldSkipStudentList = hasImageGeneration && hasStudentList;

    if (executedResults.length > 0) {
      for (const executed of executedResults) {
        const { operationName, result, status } = executed;

        if (operationName.includes("files_analyze")) {
      if (result && result.success && result.data) {
        const { basic, analysis, recommendations } = result.data;
        
        response += `\n📋 **파일 분석 결과**\n\n`;
        response += `**파일 정보:**\n`;
        response += `- 파일명: ${basic.fileName}\n`;
        response += `- 파일 크기: ${basic.fileSizeMB}MB\n`;
        response += `- 파일 형식: ${basic.fileExtension}\n\n`;
        
        if (analysis) {
          response += `**분석 결과:**\n`;
          response += `- 파일 타입: ${analysis.type}\n`;
          
          if (analysis.message) {
            response += `- ${analysis.message}\n`;
          }
          
          if (analysis.rowCount) {
            response += `- 행 수: ${analysis.rowCount}개\n`;
          }
          
          if (analysis.preview) {
            response += `\n**미리보기:**\n\`\`\`\n${analysis.preview.substring(0, 200)}\n\`\`\`\n`;
          }
        }
        
        if (recommendations && recommendations.length > 0) {
          response += `\n**추천:**\n`;
          recommendations.forEach((rec: string) => {
            response += `- ${rec}\n`;
          });
        }
      } else if (result && !result.success) {
        response += `\n❌ 파일 분석 실패: ${result.message}\n`;
      }
      continue;
    }

// [케이스: 전체 학생 코멘트 조회]
 if (operationName.includes("comments_final_all")) {
   if (result.success) {
     // 단일 그룹 조회 (group 파라미터)
     if (result.currentGroup && result.groupData) {
       response += `\n📋 **그룹 ${result.currentGroup} (${result.groupData.length}명)**\n\n`;
       
       result.groupData.forEach((student: any, idx: number) => {
         response += `🧾 **${student.name} 학생의 코멘트:**\n\n`;
         response += `${student.comment}\n\n`;
        
         if (idx < result.groupData.length - 1) {
           response += `---\n\n`;
         }
       });
       
       if (result.currentGroup < result.totalChunks) {
         response += `\n💬 다음 그룹을 보시려면 "그룹 ${result.currentGroup + 1} 조회"라고 말씀해주세요.\n`;
       } else {
        response += `\n✅ 마지막 그룹입니다.\n`;
       }
     }
      // 전체 조회 (순차 전송용 마커)
     else if (result.allGroups) {
       //  특수 마커로 socket.ts에서 처리하도록 신호
        response += `__GROUPS_START__\n`;
        response += JSON.stringify(result.allGroups);
         response += `\n__GROUPS_END__`;
        response += `\n__TOTAL__:${result.total}`;
       response += `\n__CHUNKS__:${result.chunks}`;
     }
   } else {
     response += `\n❌ 코멘트 조회 실패: ${result.message}\n`;
   }
   continue;
 }

        // 이미지 생성 API
        if (
          operationName.includes("generate") &&
          operationName.includes("image")
        ) {
          if (result.success) {
            response += `\n✅ **이미지 생성 완료**\n\n`;
            response += `- ${result.message}\n`;

            if (result.totalImages) {
              response += `- 생성된 이미지 수: ${result.totalImages}개\n`;
            }

            if (result.imageUrl) {
              const fullUrl = `http://localhost:3000${result.imageUrl}`;
              response += `\n📥 **다운로드**: [${
                result.studentName || "학생"
              } 이미지](${fullUrl})\n`;
            } else if (result.downloadUrl) {
              const fullUrl = `http://localhost:3000${result.downloadUrl}`;
              response += `\n📂 **다운로드 폴더**: ${fullUrl}\n`;
            }

            if (
              result.images &&
              Array.isArray(result.images) &&
              result.images.length > 0
            ) {
              response += `\n**생성된 이미지 목록 (최신 ${Math.min(
                5,
                result.images.length
              )}개)**:\n`;
              result.images.forEach((img: any, idx: number) => {
                const fullUrl = `http://localhost:3000${img.url}`;
                response += `${idx + 1}. [${img.filename}](${fullUrl})\n`;
              });
            }
          } else {
            response += `\n❌ 이미지 생성 실패: ${result.message}\n`;
          }
          continue;
        }

        // [케이스 2] 학생 코멘트 생성 API

        if (
          operationName.includes("apply") &&
          operationName.includes("students") &&
          !skipAssistantMessage
        ) {
          if (result.success) {
             response += "\n📊 **학생별 코멘트 생성 완료**\n\n";
             response += `- **처리된 학생**: ${result.commentsGenerated || 0}명\n`;
             response += `- **분석 대상**: ${result.studentsAnalyzed || 0}명\n\n`;

         // 미리보기 표시 (showPreview 플래그 확인)
          if (
           result.showPreview &&
           result.preview &&
           Array.isArray(result.preview) &&
           result.preview.length > 0
          ) {
           response += `**생성된 코멘트 미리보기 (처음 3명)**:\n\n`;
           result.preview.forEach((preview: any, idx: number) => {
           response += `${idx + 1}. **${preview.studentName}**\n${
           preview.commentPreview
             }\n\n`;
           });
         }
             response += `✅ 모든 코멘트가 데이터베이스에 저장되었습니다.\n`;
          } else {
            response += `\n❌ 코멘트 생성 실패: ${result.message}\n`;
          }
          continue;
        }

        // [케이스 3] 학생 정오답 조회
        if (operationName.includes("correct_wrong") && Array.isArray(result)) {
          const students = result as any[];

          response += `\n📊 **조회된 학생 정오 정보 (총 ${students.length}명)**\n\n`;
          response += "| 이름 | 정답 현황 | 출결 | 참여도 |\n";
          response += "|---|---|---|---|\n";

          students.slice(0, 10).forEach((student) => {
            response += `| ${student.name} | ${
              student.answers?.join(", ") || "-"
            } | ${student.arrivalNote || "-"} | ${
              student.participationLevel?.join(", ") || "-"
            } |\n`;
          });

          if (students.length > 10) {
            response += `\n...외 ${
              students.length - 10
            }명의 데이터가 있습니다.`;
          }
          response += "\n\n정오 정보 조회가 완료되었습니다.\n";
          continue;
        }

        // [케이스 4] 학생 목록 조회
        if (
          (operationName.includes("students_all") ||
            operationName.includes("students_get") ||
            operationName.includes("students_all_ids")) &&
          Array.isArray(result)
        ) {
          if (shouldSkipStudentList) {
            console.log(
              "ℹ️ 이미지 생성과 함께 호출된 학생 목록 조회는 출력하지 않습니다."
            );
            continue;
          }

          const students = result as Array<{ id: string; name: string }>;

          response += `\n👥 **조회된 학생 목록 (총 ${students.length}명)**\n\n`;
          response += "| 이름 | ID (식별자) |\n";
          response += "|---|---|\n";
          students.forEach((student) => {
            response += `| ${student.name} | ${student.id} |\n`;
          });
          response += "\n\n조회가 완료되었습니다.\n";
          continue;
        }

        // [케이스 5] 그 외 모든 API 실행 결과
        response += "\n✅ 실행이 완료되었습니다.\n\n";
      }
    }

    // ========== 7단계: 최종 응답 반환 ==========

    let finalResponse = "";

if (hasExecuted && response.trim()) {
  // 1순위: API 실행 결과 (학원 업무)
  finalResponse = response.trim();
  console.log(`✅ [${socketId}] 학원 업무 결과 기반 응답`);
} else if (hasAssistantMessage && response.trim()) {
  // 2순위: assistantMessage (자연어 응답 + 거부/안내)
  finalResponse = response.trim();
  console.log(`✅ [${socketId}] AI의 자연어 응답 사용`);
} else if (hasExecuted) {
  // 3순위: API 실행됨 (결과 없음)
  finalResponse = "요청하신 작업이 처리되었습니다.";
  console.log(`✅ [${socketId}] API 실행 완료 메시지`);
} else {
  // 4순위: Fallback
  finalResponse = "안녕하세요! 무엇을 도와드릴까요?";
  console.log(`✅ [${socketId}] 기본 Fallback 메시지`);
}
console.log(`📤 [${socketId}] 최종 AI 응답 생성 완료`);
return finalResponse;
  } catch (error) {
    console.error(`❌ [${socketId}] 통합 AI 메시지 처리 오류:`, error);

    if (error instanceof Error) {
      if (error.message?.includes("fetch")) {
        return "API 서버와의 연결에 문제가 있습니다. 서버가 실행 중인지 확인해주세요.";
      }
      console.error("🔍 에러 스택:", error.stack);
    }

    return "현재 AI 서비스가 초기화 중입니다. 창을 새로고침하시거나 잠시 후 다시 시도해주세요.";
  }
}

// 기타 함수 (기존 유지)
export async function processFileUploadMessage(
  fileName: string,
  filePath: string,
  socketId: string // socketId 추가
): Promise<string> {
  try {
    console.log(`📁 파일 분석 처리 시작: ${fileName}`);

    const originalName = fileName.replace(/^\d+_/, "");
    const fileExt = path.extname(originalName).toLowerCase();

    let analysisContext = "";

    if (fileExt === ".csv") {
      analysisContext = `\n\n[파일 정보: CSV 파일로 학생 데이터일 가능성이 높습니다. 파일 구조와 내용을 분석하여 데이터 처리 방안을 제시해주세요.]`;
    } else if ([".xlsx", ".xls"].includes(fileExt)) {
      analysisContext = `\n\n[파일 정보: Excel 파일입니다. 워크시트 구조와 데이터 형식을 분석해서 활용 방안을 알려주세요.]`;
    } else if (fileExt === ".pdf") {
      analysisContext = `\n\n[파일 정보: PDF 문서입니다. 문서의 주요 내용과 구조를 파악해서 요약해주세요.]`;
    } else if ([".jpg", ".jpeg", ".png"].includes(fileExt)) {
      analysisContext = `\n\n[파일 정보: 이미지 파일입니다. 이미지 내용을 분석하고 활용 가능한 방법을 제시해주세요.]`;
    }

    const message = `업로드된 파일 "${originalName}"을 상세히 분석해주세요. 파일 경로: ${filePath}${analysisContext}`;

    const result = await processUnifiedMessage(message, socketId); // ✅ socketId 전달

    console.log(`✅ 파일 분석 완료: ${fileName}`);
    return result;
  } catch (error) {
    console.error("❌ 파일 업로드 메시지 처리 오류:", error);
    return `파일 "${fileName}" 분석 중 오류가 발생했습니다. 파일 형식을 확인하거나 다시 시도해주세요.`;
  }
}

export async function processStudentDataMessage(
  action: "analyze" | "comment" | "list",
  socketId: string, // ✅ socketId 추가
  params?: any
): Promise<string> {
  try {
    let message = "";

    switch (action) {
      case "analyze":
        message = "학생 데이터를 분석하고 보고서를 생성해주세요.";
        break;
      case "comment":
        message = `"${
          params?.feature || "학습 능력"
        }"에 대한 학생별 맞춤 코멘트를 생성해주세요.`;
        break;
      case "list":
        message = "현재 저장된 모든 학생 데이터를 조회해주세요.";
        break;
      default:
        message = "학생 관련 작업을 처리해주세요.";
    }

    return await processUnifiedMessage(message, socketId); // ✅ socketId 전달
  } catch (error) {
    console.error("❌ 학생 데이터 메시지 처리 오류:", error);
    return "학생 데이터 요청 처리에 실패했습니다.";
  }
}

/**
 * AI 에이전트 리소스 정리
 */
export function cleanupUnifiedAgent() {
  sessions.clear();
  console.log("🧹 모든 세션 및 히스토리가 정리되었습니다.");
}

/**
 * 에이전트 상태 확인
 */
export function getAgentStatus() {
  return {
    initialized: isAgentInitialized,
    totalSessions: sessions.size,
    timestamp: new Date().toISOString(),
  };
}
