/**
 * 激活码管理模块常量配置
 *
 * @description
 * 定义模块所需的所有常量,包括下拉选项、表格列定义、消息文案等
 */

import type { ActivationCodeQueryRequest } from './types';
import type { OptionConfig } from '@/types/common';
import { DEFAULT_PAGE_REQUEST } from '@/constants/pagination';
import { FilterFieldConfig, FILTER_TYPES } from '@/components/shared/filter-layout';
import { StatusConfig } from '@/components/shared/status-badge';

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

// ==================== 状态 Badge 配置 ====================

export const ACTIVATION_STATUS_CONFIG: Record<number, StatusConfig> = {
  0: { label: '未使用', variant: 'secondary' },
  1: { label: '已分发', variant: 'outline', bg: 'bg-blue-50', color: 'text-blue-500' },
  2: { label: '已激活', variant: 'default', bg: 'bg-green-100', color: 'text-green-600' },
  3: { label: '作废', variant: 'destructive' }
};

// ==================== 筛选字段配置 ====================

export const FILTERS_CONFIG: FilterFieldConfig<ActivationCodeQueryRequest>[] = [
  {
    key: 'activation_code',
    label: '激活码',
    type: FILTER_TYPES.INPUT
  },
  {
    key: 'type',
    label: '类型',
    type: FILTER_TYPES.SELECT,
    options: ACTIVATION_CODE_TYPES
  },
  {
    key: 'status',
    label: '状态',
    type: FILTER_TYPES.SELECT,
    options: ACTIVATION_CODE_STATUSES
  },
  {
    startKey: 'activated_at_start',
    endKey: 'activated_at_end',
    label: '激活时间',
    type: FILTER_TYPES.DATE_RANGE,
    advanced: true
  }
];
