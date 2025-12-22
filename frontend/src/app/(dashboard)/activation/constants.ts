/**
 * 激活码管理模块常量配置
 *
 * @description
 * 定义模块所需的所有常量,包括下拉选项、表格列定义、消息文案等
 */

import type { ActivationCodeQueryRequest } from './types';
import { DEFAULT_PAGE_REQUEST } from '@/constants/pagination';
import {
  FilterFieldConfig,
  FILTER_TYPES
} from '@/components/shared/filter-layout';
import { SmartEnum } from '@/lib/enum';

// ==================== 枚举配置 (单一事实来源) ====================

/** 激活码类型枚举 */
export const ACTIVATION_TYPE_ENUM = new SmartEnum([
  { code: 0, label: '日卡', variant: 'secondary' },
  {
    code: 1,
    label: '月卡',
    variant: 'outline',
    bg: 'bg-blue-50',
    color: 'text-blue-500'
  },
  {
    code: 2,
    label: '年卡',
    variant: 'outline',
    bg: 'bg-amber-50',
    color: 'text-amber-500'
  },
  {
    code: 3,
    label: '永久卡',
    variant: 'default',
    bg: 'bg-purple-100',
    color: 'text-purple-600'
  }
]);

/** 激活码状态枚举 */
export const ACTIVATION_STATUS_ENUM = new SmartEnum([
  { code: 0, label: '未使用', variant: 'secondary' },
  {
    code: 1,
    label: '已分发',
    variant: 'outline',
    bg: 'bg-blue-50',
    color: 'text-blue-500'
  },
  {
    code: 2,
    label: '已激活',
    variant: 'default',
    bg: 'bg-green-100',
    color: 'text-green-600'
  },
  { code: 3, label: '作废', variant: 'destructive' }
]);

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
 */
export const MAX_INIT_ITEMS = ACTIVATION_TYPE_ENUM.items.length;

// ... (INIT_COUNT_RANGE, DISTRIBUTE_COUNT_RANGE 不变)

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
    options: ACTIVATION_TYPE_ENUM
  },
  {
    key: 'status',
    label: '状态',
    type: FILTER_TYPES.SELECT,
    options: ACTIVATION_STATUS_ENUM
  },
  {
    startKey: 'activated_at_start',
    endKey: 'activated_at_end',
    label: '激活时间',
    type: FILTER_TYPES.DATE_RANGE,
    advanced: true
  }
];
