// src/app/routes/kakaoChatbot.routes.ts

import { Router } from 'express';
// AgenticaHistory와 함께, 필요한 구체적인 History 타입들을 임포트합니다.
// AgenticaHistory.d.ts에 정의된 모든 타입을 가져와야 합니다.
import {
  Agentica,
  AgenticaHistory,
  AgenticaAssistantMessageHistory,
  AgenticaExecuteHistory, // <-- 추가: AgenticaExecuteHistory 임포트
  // 다른 타입들도 필요하면 임포트:
  // AgenticaCancelHistory, AgenticaDescribeHistory, AgenticaSelectHistory,
  // AgenticaSystemMessageHistory, AgenticaUserMessageHistory
} from '@agentica/core';

import { OpenAI } from 'openai';
import { ExcelTool } from '../../tools/ExcelTool'; // 경로 조정
import { SmsTool } from '../../tools/SmsTool';     // 새로 추가한 도구
import typia from 'typia';

// Agentica 인스턴스 (main.ts와 동일하게 설정)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const agent = new Agentica({
  model: "chatgpt",
  vendor: {
    model: "gpt-4o-mini", // main.ts와 동일한 모델
    api: openai,
  },
  controllers: [
    {
      name: "Excel Tool",
      protocol: "class",
      application: typia.llm.application<ExcelTool, "chatgpt">(),
      execute: new ExcelTool(),
    },
    {
      name: "Sms Tool",
      protocol: "class",
      application: typia.llm.application<SmsTool, "chatgpt">(),
      execute: new SmsTool(),
    },
    // 다른 도구들도 여기에 등록 (예: PdfParserTool)
  ],
});

const router = Router();

// AgenticaHistory의 실제 타입을 바탕으로 사용자 정의 타입 가드 정의
// AgenticaExecuteHistory의 'type'은 "execute" 입니다.
// 이 타입 가드들은 answer가 특정 History 타입의 인스턴스임을 TypeScript에 알려줍니다.

// AgenticaExecuteHistory 타입 가드 (도구 호출 및 결과 포함)
function isAgenticaExecute(answer: AgenticaHistory<"chatgpt">): answer is AgenticaExecuteHistory<"chatgpt"> {
  return answer.type === 'execute';
}

// AgenticaAssistantMessageHistory 타입 가드
function isAgenticaAssistantMessage(answer: AgenticaHistory<"chatgpt">): answer is AgenticaAssistantMessageHistory {
  return answer.type === 'assistantMessage';
}

router.post('/webhook', async (req, res) => {
  console.log('--- 카카오톡 웹훅 수신 ---');
  console.log(JSON.stringify(req.body, null, 2));

  try {
    const userMessage = req.body?.userRequest?.utterance; // 사용자의 발화 내용

    if (!userMessage) {
      console.log('사용자 메시지가 없습니다.');
      return res.json({
        version: "2.0",
        template: { outputs: [{ simpleText: { text: "메시지 내용을 찾을 수 없습니다." } }] }
      });
    }

    // Agentica에게 사용자 메시지 전달 및 응답 받기
    // conversate는 여러 개의 History 객체를 반환할 수 있습니다.
    // 마지막 히스토리를 주로 사용하거나, 모든 히스토리를 조합하여 응답을 만듭니다.
    const agentAnswers: AgenticaHistory<"chatgpt">[] = await agent.conversate(userMessage);

    let replyText = "명령을 이해하지 못했습니다. 다시 시도해 주세요.";

    if (agentAnswers && agentAnswers.length > 0) {
      // 가장 최신 또는 가장 관련성 높은 답변을 찾기 위해 배열을 역순으로 탐색하거나,
      // 특정 타입의 답변이 나올 때까지 기다릴 수 있습니다.
      // 여기서는 배열의 마지막 답변을 기준으로 처리합니다.
      const lastAnswer = agentAnswers[agentAnswers.length - 1];

      if (isAgenticaExecute(lastAnswer)) {
        // AgenticaExecuteHistory는 도구 호출 정보 (operation)와 반환값 (value)을 모두 포함합니다.
        // LLM이 함수 호출을 지시했을 때 이 타입이 반환됩니다.
        console.log(`Agentica가 도구를 호출했습니다 (execute): ${lastAnswer.operation.name}`);
        // `value` 속성에 실제 도구 실행 결과가 담겨 있습니다.
        // `value`는 `unknown` 타입이므로 사용 전에 타입 확인 또는 캐스팅이 필요합니다.
        const toolResult = lastAnswer.value as any; // toolResult는 IHttpResponse 또는 클래스 함수의 반환값

        // 여기서 toolResult가 SMS Tool의 반환값인 { success: boolean, message: string, data?: any } 형태라고 가정합니다.
        if (toolResult && typeof toolResult === 'object' && 'success' in toolResult) {
            if (toolResult.success) {
                replyText = `${toolResult.message || '요청이 성공적으로 처리되었습니다.'} GroupID: ${toolResult.data?.groupId || 'N/A'}`;
            } else {
                replyText = `요청 처리 중 오류가 발생했습니다: ${toolResult.message || '알 수 없는 오류'}`;
            }
        } else {
            // toolResult가 예상했던 형태가 아닐 때
            replyText = `요청 처리 완료. 결과: ${JSON.stringify(toolResult)}`;
        }
      } else if (isAgenticaAssistantMessage(lastAnswer)) {
        // Agentica가 직접 생성한 일반 텍스트 응답
        replyText = lastAnswer.text;
      }
      // 다른 History 타입들 (예: UserMessage, SystemMessage 등)은 여기에서 추가 처리할 수 있습니다.
      // else if (isAgenticaUserMessage(lastAnswer)) { /* ... */ }
      // else if (isAgenticaSystemMessage(lastAnswer)) { /* ... */ }
    } else {
      replyText = "Agentica가 응답을 생성하지 못했습니다.";
    }

    // 카카오톡 챗봇 응답 형식에 맞춰 JSON 반환
    res.json({
      version: "2.0",
      template: {
        outputs: [
          {
            simpleText: {
              text: replyText
            }
          }
        ]
      }
    });

  } catch (error: any) {
    console.error('카카오톡 웹훅 처리 중 오류 발생:', error);
    res.status(500).json({
      version: "2.0",
      template: { outputs: [{ simpleText: { text: `오류가 발생했습니다: ${error.message}` } }] }
    });
  }
});

export default router;
