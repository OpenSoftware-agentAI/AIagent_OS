import { Router } from 'express';
import {
  Agentica,
  AgenticaHistory,
  AgenticaAssistantMessageHistory,
  AgenticaExecuteHistory,
} from '@agentica/core';
import { OpenAI } from 'openai';
import { ExcelTool } from '../../tools/ExcelTool';
import { SmsTool } from '../../tools/SmsTool';
import { StudentExcelTool } from '../../tools/StudentExcelTool';
import typia from 'typia';
import { extractSmsParamsFromUtterance } from '../../utils/nlp';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const agent = new Agentica({
  model: 'chatgpt',
  vendor: {
    model: 'gpt-4o-mini',
    api: openai,
  },
  controllers: [
    {
      name: 'Excel Tool',
      protocol: 'class',
      application: typia.llm.application<ExcelTool, 'chatgpt'>(),
      execute: new ExcelTool(),
    },
    {
      name: 'Student Excel Tool',
      protocol: 'class',
      application: typia.llm.application<StudentExcelTool, 'chatgpt'>(),
      execute: new StudentExcelTool(),
    },
    {
      name: 'Sms Tool',
      protocol: 'class',
      application: typia.llm.application<SmsTool, 'chatgpt'>(),
      execute: new SmsTool(),
    },
  ],
});

const router = Router();

// 타입 가드
function isAgenticaExecute(
  answer: AgenticaHistory<'chatgpt'>
): answer is AgenticaExecuteHistory<'chatgpt'> {
  return answer.type === 'execute';
}
function isAgenticaAssistantMessage(
  answer: AgenticaHistory<'chatgpt'>
): answer is AgenticaAssistantMessageHistory {
  return answer.type === 'assistantMessage';
}

// 타임아웃 래퍼
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`timeout(${ms}ms)`)), ms)
    ),
  ]);
}

// 카카오 간단 텍스트 응답
function kakaoText(text: string) {
  return {
    version: '2.0',
    template: {
      outputs: [{ simpleText: { text } }],
    },
  };
}

// 간단 의도(도움말/헬스) 즉시 응답
function quickIntentReplyOrNull(utterance?: string) {
  if (!utterance) return kakaoText('메시지 내용을 찾을 수 없습니다.');
  const msg = utterance.trim();
  if (/^(도움말|help|사용법)$/i.test(msg)) {
    return kakaoText(
      [
        '📋 사용 가이드',
        '',
        '• SMS: 010-0000-0000로 "내용" 문자 보내줘',
        '• LMS/MMS도 동일, 이미지 파일은 업로드 후 지시',
        '• 엑셀: 엑셀 데이터 정리/분석/요약 요청',
      ].join('\n')
    );
  }
  if (/^(헬스체크|상태|health)$/i.test(msg)) {
    return kakaoText('서버는 정상 동작 중입니다.');
  }
  return null;
}

router.post('/webhook', async (req, res) => {
  const utterance: string = req.body?.userRequest?.utterance || '';
  const userId = req.body?.userRequest?.user?.id;
  console.log('--- 카카오 웹훅 ---', { userId, utterance });

  try {
    // 1) 간단 의도라면 즉시 응답
    const quick = quickIntentReplyOrNull(utterance);
    if (quick) return res.json(quick);

    // 2) 먼저 즉시 응답 (5초 제한 회피)
    res.json(kakaoText('요청을 접수했습니다. 잠시만 기다려 주세요.'));

    // 3) 백그라운드에서 자유 대화 + 업무 처리
    setImmediate(async () => {
      try {
        // 우선 LLM에게 자유 대화 전달
        const answers = await withTimeout(agent.conversate(utterance), 4000);

        // SMS 의도 감지(간단 키워드)
        const maybeSms =
          /(문자|sms|메시지|메세지|보내줘|전송|발송)/i.test(utterance);

        if (maybeSms) {
          const { phone, message, isAdvertisement, allowNightSend } =
            extractSmsParamsFromUtterance(utterance);

          if (!phone || !message) {
            console.log('SMS 파라미터 부족:', { phone, message });
            return;
          }

          // 도구 호출 지시 프롬프트(Agentica가 SmsTool을 선택하도록 유도)
          const toolPrompt = `사용자 요청에 따라 SMS를 전송해.
to=${phone}, text="${message}", isAdvertisement=${isAdvertisement}, allowNightSend=${allowNightSend}`;
          try {
            const toolAnswers = await withTimeout(
              agent.conversate(toolPrompt),
              4000
            );
            const last = toolAnswers[toolAnswers.length - 1];
            if (isAgenticaExecute(last)) {
              console.log('SMS Tool 실행:', last.operation?.name);
              console.log('결과:', JSON.stringify(last.value ?? {}, null, 2));
            } else if (isAgenticaAssistantMessage(last)) {
              console.log('LLM 응답:', last.text);
            } else {
              console.log('SMS 처리 응답(기타):', JSON.stringify(last ?? {}));
            }
          } catch (e) {
            console.error('SMS 처리 오류:', e);
          }
          return;
        }

        // 엑셀 의도(간단 예)
        if (/(엑셀|excel|시트|sheet)/i.test(utterance)) {
          console.log('엑셀 관련 요청 감지');
          // 필요 시 추가 지시 프롬프트 구성
        }

        // 자유 대화 응답 로그
        const last = answers[answers.length - 1];
        if (isAgenticaAssistantMessage(last)) {
          console.log('AI 응답:', last.text);
        } else {
          console.log('AI 응답(요약):', JSON.stringify(last ?? {}));
        }
      } catch (err) {
        console.error('백그라운드 처리 오류:', err);
      }
    });
  } catch (error: any) {
    console.error('웹훅 처리 오류:', error?.message || error);
    return res.json(
      kakaoText('처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.')
    );
  }
});

export default router;
