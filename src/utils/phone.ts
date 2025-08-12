/**
 * 전화번호를 010XXXXXXXX 형식으로 정규화
 */
export const normalizePhone = (phone: string): string => {
  return phone.replace(/[^\d]/g, '');
};

/**
 * 한국 휴대폰 번호 형식 검증
 */
export const isValidKRMobile = (phone: string): boolean => {
  const normalized = normalizePhone(phone);
  return /^010\d{8}$/.test(normalized);
};

/**
 * 전화번호 마스킹 (로그용)
 */
export const maskPhone = (phone: string): string => {
  const normalized = normalizePhone(phone);
  if (normalized.length >= 8) {
    return normalized.substring(0, 3) + '****' + normalized.substring(7);
  }
  return '***';
};