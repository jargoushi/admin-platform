import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { toast } from 'sonner';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 获取字符串的首字母并大写
 * @param name 输入字符串
 * @returns 首字母大写
 */
export function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * 复制到剪贴板工具配置
 */
interface CopyToClipboardOptions {
  /** 成功提示信息 */
  successMessage?: string;
  /** 失败提示信息 */
  errorMessage?: string;
  /** 是否显示提示 */
  showToast?: boolean;
}

/**
 * 复制文本到剪贴板
 */
export async function copyToClipboard(
  text: string,
  options: CopyToClipboardOptions = {}
): Promise<boolean> {
  const {
    successMessage = '已复制到剪贴板',
    errorMessage = '复制失败，请重试',
    showToast = true
  } = options;

  try {
    await navigator.clipboard.writeText(text);
    if (showToast) {
      toast.success(successMessage);
    }
    return true;
  } catch {
    if (showToast) {
      toast.error(errorMessage);
    }
    return false;
  }
}

/**
 * 检查是否有活跃的筛选条件
 * @param values 筛选值对象
 * @returns 是否有活跃筛选
 */
export function hasActiveFilters(values: Record<string, unknown>): boolean {
  return Object.values(values).some(
    (value) =>
      value && value !== '' && !(Array.isArray(value) && value.length === 0)
  );
}
