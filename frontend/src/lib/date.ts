import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

/**
 * 格式化日期时间字符串
 * @param date - 日期对象、字符串或数字
 * @param formatStr - 格式模板（默认：yyyy-MM-dd HH:mm:ss）
 * @returns 格式化后的字符串或 '-'
 */
export function formatDateTime(
  date: Date | string | number | null | undefined,
  formatStr: string = 'yyyy-MM-dd HH:mm:ss'
): string {
  if (!date) return '-';
  try {
    const d =
      typeof date === 'string' || typeof date === 'number'
        ? new Date(date)
        : date;
    return format(d, formatStr, { locale: zhCN });
  } catch {
    return String(date);
  }
}

/**
 * 格式化日期 - 仅显示年月日
 * @param date - 日期对象、字符串或数字
 * @returns 格式化后的日期字符串
 */
export function formatDate(
  date: Date | string | number | null | undefined
): string {
  return formatDateTime(date, 'yyyy-MM-dd');
}

/**
 * 格式化日期时间为后端需要的格式
 * @param date - Date 对象或 ISO 字符串
 * @returns 格式化后的字符串 (YYYY-MM-DD HH:mm:ss)
 */
export function formatDateTimeForBackend(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, 'yyyy-MM-dd HH:mm:ss');
}

/**
 * ISO 8601 日期时间格式正则表达式
 */
const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/;

/**
 * 检查字符串是否为 ISO 8601 日期格式
 */
export function isISODateString(value: string): boolean {
  return ISO_DATE_REGEX.test(value);
}

/**
 * 转换对象中的所有 ISO 日期字符串为后端格式
 * @param obj - 需要转换的对象
 * @returns 转换后的对象
 */
export function convertDatesInObject(obj: unknown): unknown {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === 'string' && isISODateString(obj)) {
    return formatDateTimeForBackend(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => convertDatesInObject(item));
  }

  if (typeof obj === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = convertDatesInObject(value);
    }
    return result;
  }

  return obj;
}

export const DATE_FORMAT = 'yyyy-MM-dd';
export const TIME_FORMAT = 'HH:mm:ss';
