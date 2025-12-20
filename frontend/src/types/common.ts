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
 * 基础实体接口
 */
export interface BaseEntity {
  id: string | number;
  created_at?: string;
  updated_at?: string;
}

/**
 * 基础查询请求接口
 */
export interface BaseQueryRequest {
  page?: number;
  size?: number;
  [key: string]: unknown;
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
