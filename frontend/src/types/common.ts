/**
 * 通用类型定义
 *
 * @description
 * 存放项目中多个模块共享的通用类型定义
 */

// ==================== 选项配置相关 ====================

/**
 * 选项配置（统一格式，与后端保持一致）
 */
export interface OptionConfig {
  /** 选项代码 */
  code: number;
  /** 选项描述（用于显示） */
  desc: string;
}

/**
 * 从 OptionConfig 数组中根据 code 查找描述
 */
export function findDescByCode(
  options: OptionConfig[],
  code: number | undefined
): string {
  if (code === undefined) return '';
  return options.find((opt) => opt.code === code)?.desc || '';
}
