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
const pendingResults = new Map<string, { result: string; timestamp: number }>();

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

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`timeout(${ms}ms)`)), ms)
    ),
  ]);
}

function kakaoText(text: string) {
  return {
    version: '2.0',
    template: {
      outputs: [{ simpleText: { text } }],
    },
  };
}

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
        '• 결과 확인: "결과 확인" 또는 "어떻게 됐어?"',
      ].join('\n')
    );
  }
  if (/^(헬스체크|상태|health)$/i.test(msg)) {
    return kakaoText('서버는 정상 동작 중입니다.');
  }
  return null;
}

function getActionParams(body: any) {
  const p = (body && body.action && body.action.params) || {};
  const d = (body && body.action && body.action.detailParams) || {};
  const flatDetail: Record<string, any> = {};
  Object.keys(d).forEach((k) => {
    const v = d[k];
    if (v && typeof v === 'object') {
      flatDetail[k] = v.value ?? v.origin ?? '';
    } else {
      flatDetail[k] = v;
    }
  });
  return { ...p, ...flatDetail };
}

const recentRequests = new Map<string, number>();
function makeReqKey(body: any) {
  const userId = body?.userRequest?.user?.id || 'unknown';
  const actionId = body?.action?.id || 'noaction';
  const utter = (body?.userRequest?.utterance || '').trim();
  return `${userId}::${actionId}::${utter}`;
}

function isDuplicateAndMark(key: string, ttlMs = 10000) {
  const now = Date.now();
  const prev = recentRequests.get(key) || 0;
  if (now - prev < ttlMs) return true;
  recentRequests.set(key, now);
  if (recentRequests.size > 1000) {
    const threshold = now - 60000;
    for (const [k, t] of recentRequests) if (t < threshold) recentRequests.delete(k);
  }
  return false;
}

function summarizeToolResult(executeResult: any): string {
  const toolName = executeResult.operation?.name;
  const success = executeResult.value?.success;
  if (toolName?.includes('Sms')) {
    return success ? '문자 메시지를 성공적으로 전송했습니다!' : '문자 전송 중 오류가 발생했습니다.';
  }
  if (toolName?.includes('Excel')) {
    return success ? '엑셀 데이터 처리를 완료했습니다!' : '엑셀 처리 중 오류가 발생했습니다.';
  }
  return success ? '요청을 성공적으로 처리했습니다!' : '처리 중 오류가 발생했습니다.';
}

function isResultCheckRequest(utterance: string): boolean {
  return /^(결과|확인|어떻게|완료|됐어|상황|어떡|처리|끝났)/i.test(utterance.trim());
}

router.post('/webhook', async (req, res) => {
  const utterance: string = (req.body?.userRequest?.utterance || '').trim();
  const userId = req.body?.userRequest?.user?.id || 'unknown';
  const params = getActionParams(req.body);
  const textCandidate = (params.textCandidate || '').toString();
  const urlCandidate = (params.urlCandidate || '').toString();
  const imageUrlCandidate = (params.imageUrlCandidate || '').toString();
  const dateCandidate = (params.dateCandidate || '').toString();
  const timeCandidate = (params.timeCandidate || '').toString();

  const reqKey = makeReqKey(req.body);
  if (isDuplicateAndMark(reqKey)) {
    console.warn('중복 요청 차단:', reqKey);
    return res.json(kakaoText('요청을 처리 중입니다.'));
  }

  console.log('--- 카카오 웹훅 ---', { userId, utterance });

  try {
    const quick = quickIntentReplyOrNull(utterance);
    if (quick) return res.json(quick);

    if (isResultCheckRequest(utterance)) {
      const pending = pendingResults.get(userId);
      if (pending && Date.now() - pending.timestamp < 300000) {
        pendingResults.delete(userId);
        return res.json(kakaoText(pending.result));
      } else {
        return res.json(kakaoText('확인할 결과가 없거나 만료되었습니다. 새로운 요청을 해주세요.'));
      }
    }

    let toolExecutedInFastPath = false;

    try {
      const answers = await withTimeout(agent.conversate(utterance), 4000);
      const last = answers[answers.length - 1];
      
      if (isAgenticaExecute(last)) {
        res.json(kakaoText(summarizeToolResult(last)));
        toolExecutedInFastPath = true;
      } else if (isAgenticaAssistantMessage(last)) {
        res.json(kakaoText(last.text || '요청을 처리했습니다.'));
      } else {
        res.json(kakaoText('요청을 처리했습니다.'));
      }
    } catch {
      res.json(kakaoText('요청을 처리 중입니다. 완료되면 "결과 확인"이라고 말씀해 주세요.'));
    }

    setImmediate(async () => {
      if (toolExecutedInFastPath) {
        console.log('빠른 경로에서 도구 실행 완료. 백그라운드 처리 전체 스킵.');
        return;
      }

      const maybeSms = /(문자|sms|메시지|메세지|보내줘|전송|발송)/i.test(utterance);
      if (maybeSms) {
        console.log('SMS 의도는 빠른 경로에서 처리. 백그라운드 스킵.');
        return;
      }

      try {
        const bgAnswers = await withTimeout(agent.conversate(utterance), 6000);
        const last = bgAnswers[bgAnswers.length - 1];
        let backgroundResult = '';

        if (isAgenticaAssistantMessage(last)) {
          backgroundResult = last.text || '요청이 처리되었습니다.';
          console.log('백그라운드 AI 응답:', last.text);
        } else if (isAgenticaExecute(last)) {
          backgroundResult = summarizeToolResult(last);
          console.log('백그라운드 도구 실행:', last.operation?.name, last.value ?? {});
        } else {
          backgroundResult = '요청이 처리되었습니다.';
          console.log('백그라운드 AI 응답(요약):', JSON.stringify(last ?? {}));
        }

        if (/(엑셀|excel|시트|sheet)/i.test(utterance)) {
          console.log('엑셀 관련 요청 감지');
        }

        if (backgroundResult) {
          pendingResults.set(userId, {
            result: backgroundResult,
            timestamp: Date.now()
          });
          console.log(`백그라운드 결과 저장됨 (${userId}):`, backgroundResult);
        }

      } catch (bgErr) {
        const errorMessage = '처리 중 오류가 발생했습니다. 다시 시도해주세요.';
        pendingResults.set(userId, {
          result: errorMessage,
          timestamp: Date.now()
        });
        console.error('백그라운드 처리 오류:', bgErr);
      }
    });
    
  } catch (error: any) {
    console.error('웹훅 처리 오류:', error?.message || error);
    return res.json(kakaoText('처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.'));
  }
});

export default router;
