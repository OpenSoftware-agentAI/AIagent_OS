/**
 * 야간 시간대 체크 (21:00 ~ 08:00)
 * 광고성 메시지 발송 제한 시간
 */
export const isQuietHours = (date: Date = new Date()): boolean => {
  const hour = date.getHours();
  return hour >= 21 || hour < 8;
};

/**
 * 발송 허용 시간 체크
 */
export const canSendMessage = (
  isAdvertisement: boolean = false,
  date: Date = new Date()
): boolean => {
  if (isAdvertisement && isQuietHours(date)) {
    return false;
  }
  return true;
};