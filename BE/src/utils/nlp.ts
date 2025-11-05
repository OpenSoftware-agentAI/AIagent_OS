
// src/utils/nlp.ts
// Optional chaining과 nullish coalescing 없이 동작하는 호환 버전
// replace를 사용하지 않는 버전

/**
 * 사용자 발화에서 문자(SMS/LMS/MMS) 전송에 필요한 파라미터를 추출합니다.
 * - 전화번호: 010-1234-5678 또는 01012345678 형식 허용
 * - 본문: 큰따옴표("...") 안의 텍스트 우선 추출
 * - 광고/야간 허용: 한국어 키워드 기반 간단 판정
 */
export function extractSmsParamsFromUtterance(utterance: string) {
  // 안전하게 문자열로 처리
  const text = (utterance || '').trim();

  // 1) 전화번호 추출: 010/011/016/017/018/019 허용
  // 정규식 리터럴에서는 \d, \s 그대로 사용합니다.
  const phoneRegex = /(01[016789])[-]?\d{3,4}[-]?\d{4}/;
  const phoneMatch = text.match(phoneRegex);
  // 매치 원문을 그대로 사용 (정규화 필요 시 후단에서 처리)
  const phone = phoneMatch ? phoneMatch : '';

  // 2) 큰따옴표 본문: "..."
  const quoteRegex = /"([^"]+)"/;
  const quoteMatch = text.match(quoteRegex);
  // 캡처 그룹(1번)만 꺼내 사용
  const message = (quoteMatch && quoteMatch) ? quoteMatch : '';

  // 3) 광고/야간 키워드 판정(간단 규칙)
  // 광고: '광고' 포함 && '비광고/아님/아니/아니오/아닌' 같은 부정 키워드가 없으면 true
  const isAdvertisement = /광고/.test(text) && !/(비광고|아님|아니|아니오|아닌)/.test(text);

  // 야간 허용: '야간 허용/가능/괜찮/ok/가능해/돼' 포함 && '야간 불가/안돼/안됨/금지'가 없으면 true
  const allowNightSend =
    /(야간\s*(허용|가능|괜찮|ok|가능해|돼))/i.test(text) &&
    !/(야간\s*(불가|안돼|안됨|금지))/i.test(text);

  return {
    phone,          // 예: "010-1234-5678" 또는 "01012345678" (입력 형태 그대로)
    message,        // 따옴표 안의 텍스트
    isAdvertisement,
    allowNightSend,
  };
}

/**
 * 다중 수신자 발화에서 여러 전화번호를 배열로 추출합니다.
 * 예: "010-1111-2222, 010-3333-4444로 ..." → ["010-1111-2222", "010-3333-4444"]
 *  - 여기서도 replace를 사용하지 않고, 매치 원문을 그대로 반환합니다.
 */
export function extractMultiplePhones(utterance: string) {
  const text = (utterance || '').trim();
  const phoneGlobalRegex = /(01[016789])[-]?\d{3,4}[-]?\d{4}/g;
  const matches = text.match(phoneGlobalRegex);
  const list: string[] = [];

  if (matches && matches.length > 0) {
    for (let i = 0; i < matches.length; i++) {
      const p = matches[i]; // 원문 그대로 사용
      if (list.indexOf(p) === -1) list.push(p); // 중복 제거
    }
  }

  return list;
}

/**
 * 간단한 의도 감지 유틸(문자/엑셀 등)
 */
export function detectIntent(utterance: string) {
  const text = (utterance || '').toLowerCase();

  const isSms = /(문자|sms|메시지|메세지|보내줘|전송|발송)/.test(text);
  const isExcel = /(엑셀|excel|시트|sheet)/.test(text);

  return { isSms, isExcel };
}
