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

// 액션 파라미터 취합(시스템/사용자 엔티티가 담기는 영역 보조)
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

// 아이템포턴시: 요청 중복 차단(10초)
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
  // 간단 청소
  if (recentRequests.size > 1000) {
    const threshold = now - 60000;
    for (const [k, t] of recentRequests) if (t < threshold) recentRequests.delete(k);
  }
  return false;
}

// 아이템포턴시: 동일 SMS 내용 중복 발송 차단(10초)
const recentSends = new Map<string, number>();
function isDuplicateSend(userId: string, phone: string, message: string, ttlMs = 10000) {
  const key = `${userId}::${phone}::${message}`;
  const now = Date.now();
  const prev = recentSends.get(key) || 0;
  if (now - prev < ttlMs) return true;
  recentSends.set(key, now);
  return false;
}

router.post('/webhook', async (req, res) => {
  const utterance: string = (req.body?.userRequest?.utterance || '').trim();
  const userId = req.body?.userRequest?.user?.id || 'unknown';
  const params = getActionParams(req.body);

  // 시스템 엔티티/사용자 파라미터 후보(필요 시 확장)
  const textCandidate = (params.textCandidate || '').toString();
  const urlCandidate = (params.urlCandidate || '').toString();
  const imageUrlCandidate = (params.imageUrlCandidate || '').toString();
  const dateCandidate = (params.dateCandidate || '').toString();
  const timeCandidate = (params.timeCandidate || '').toString();

  // 요청 중복 차단
  const reqKey = makeReqKey(req.body);
  if (isDuplicateAndMark(reqKey)) {
    console.warn('중복 요청 차단:', reqKey);
    return res.json(kakaoText('요청을 처리 중입니다.'));
  }

  console.log('--- 카카오 웹훅 ---', { userId, utterance });

  try {
    // 1) 간단 의도라면 즉시 응답
    const quick = quickIntentReplyOrNull(utterance);
    if (quick) return res.json(quick);

    // 2) 빠른 경로: 2.5초 내 텍스트 응답 시도
    let fastHandled = false;
    try {
      const answers = await withTimeout(agent.conversate(utterance), 2500);
      const last = answers[answers.length - 1];

      // 도구 실행 감지 시: 빠른 경로에서는 실행하지 않고 '접수'로 폴백
      if (isAgenticaExecute(last)) {
        res.json(kakaoText('요청을 접수했습니다. 잠시만 기다려 주세요.'));
        fastHandled = true;
      } else if (isAgenticaAssistantMessage(last)) {
        res.json(kakaoText(last.text || '요청을 처리했습니다.'));
        fastHandled = true;
      } else {
        res.json(kakaoText('요청을 처리했습니다.'));
        fastHandled = true;
      }
    } catch {
      // 타임아웃/오류 시: 접수
      res.json(kakaoText('요청을 접수했습니다. 잠시만 기다려 주세요.'));
      fastHandled = true;
    }

    // 3) 백그라운드 처리(무거운 작업/도구 실행은 여기서만)
    setImmediate(async () => {
      try {
        // 자유 대화 해석(백그라운드)
        const bgAnswers = await withTimeout(agent.conversate(utterance), 6000);

        // SMS 의도 감지
        const maybeSms =
          /(문자|sms|메시지|메세지|보내줘|전송|발송)/i.test(utterance);

        if (maybeSms) {
          const {
            phone: rxPhone,
            message: rxMessage,
            isAdvertisement,
            allowNightSend,
          } = extractSmsParamsFromUtterance(utterance);

          // 메시지는 시스템 엔티티 보조값 우선 적용
          const finalMessageRaw = (typeof rxMessage === 'string' && rxMessage) ? rxMessage : (textCandidate || '');
          const finalMessage = String(finalMessageRaw);

          // 전화번호는 정규식 추출값을 사용하되, 항상 문자열로 확정
          const phoneRaw = (typeof rxPhone === 'string' && rxPhone) ? rxPhone : '';
          // 필요 시 하이픈 제거 등 정규화
          const finalPhone = phoneRaw.replace ? phoneRaw.replace(/-/g, '') : String(phoneRaw);
          if (!finalPhone || !finalMessage) {
            console.log('SMS 파라미터 부족:', {
              phone: finalPhone,
              message: finalMessage,
            });
            return;
          }

          // 동일 메시지 중복 발송 차단(10초) 
          if (isDuplicateSend(userId, finalPhone, finalMessage)) {
            console.warn('중복 발송 차단:', { userId, finalPhone, finalMessage });
            return;
          }

          // 이미지 MMS 분기
          const hasImage = !!imageUrlCandidate;
          const smsPrompt = hasImage
            ? `이미지 MMS를 전송해:
to=${finalPhone}, text="${finalMessage}", imageUrl="${imageUrlCandidate}", isAdvertisement=${isAdvertisement}, allowNightSend=${allowNightSend}`
            : `SMS/LMS를 전송해:
to=${finalPhone}, text="${finalMessage}", isAdvertisement=${isAdvertisement}, allowNightSend=${allowNightSend}`;

          try {
            const toolAnswers = await withTimeout(
              agent.conversate(smsPrompt),
              6000
            );
            const last = toolAnswers[toolAnswers.length - 1];
            if (isAgenticaExecute(last)) {
              console.log('SMS/MMS Tool 실행:', last.operation?.name);
              console.log('결과:', JSON.stringify(last.value ?? {}, null, 2));
            } else if (isAgenticaAssistantMessage(last)) {
              console.log('LLM 응답:', last.text);
            } else {
              console.log('문자 처리 응답(기타):', JSON.stringify(last ?? {}));
            }
          } catch (smsErr) {
            console.error('문자 처리 오류:', smsErr);
          }
          return;
        }

        // 엑셀 의도(간단 예)
        if (/(엑셀|excel|시트|sheet)/i.test(utterance)) {
          console.log('엑셀 관련 요청 감지');
          // 필요 시 bgAnswers/params 기반 후속 처리
        }

        // 백그라운드 자유 대화 응답 로그(후속 카카오 전송은 별도 경로 필요)
        const last = bgAnswers[bgAnswers.length - 1];
        if (isAgenticaAssistantMessage(last)) {
          console.log('백그라운드 AI 응답:', last.text);
        } else {
          console.log('백그라운드 AI 응답(요약):', JSON.stringify(last ?? {}));
        }
      } catch (bgErr) {
        console.error('백그라운드 처리 오류:', bgErr);
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
