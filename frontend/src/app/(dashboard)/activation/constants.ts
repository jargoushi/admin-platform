/**
 * 激活码管理模块常量配置
 *
 * @description
 * 定义模块所需的所有常量,包括下拉选项、表格列定义、消息文案等
 */

import type { ActivationCodeQueryRequest } from './types';
import type { OptionConfig } from '@/types/common';
import { DEFAULT_PAGE_REQUEST } from '@/constants/pagination';

// ==================== 激活码类型配置 ====================

/**
 * 激活码类型统一配置
 */
export const ACTIVATION_CODE_TYPES: OptionConfig[] = [
  { code: 0, desc: '日卡' },
  { code: 1, desc: '月卡' },
  { code: 2, desc: '年卡' },
  { code: 3, desc: '永久卡' }
];

// ==================== 激活码状态配置 ====================

/**
 * 激活码状态统一配置
 */
export const ACTIVATION_CODE_STATUSES: OptionConfig[] = [
  { code: 0, desc: '未使用' },
  { code: 1, desc: '已分发' },
  { code: 2, desc: '已激活' },
  { code: 3, desc: '作废' }
];

// ==================== 默认查询参数 ====================

/**
 * 默认查询参数(与后端 API 一致)
 * 使用全局分页配置
 */
export const DEFAULT_QUERY_PARAMS: ActivationCodeQueryRequest = {
  ...DEFAULT_PAGE_REQUEST
};

// ==================== 验证规则 ====================

/**
 * 批量初始化最大项数
 * 根据激活码类型数量动态计算
 * 每种激活码类型只能初始化一次
 */
export const MAX_INIT_ITEMS = ACTIVATION_CODE_TYPES.length;

/**
 * 单次生成数量范围
 */
export const INIT_COUNT_RANGE = {
  MIN: 1,
  MAX: 1000
} as const;

/**
 * 派发数量范围
 */
export const DISTRIBUTE_COUNT_RANGE = {
  MIN: 1,
  MAX: 100
} as const;
