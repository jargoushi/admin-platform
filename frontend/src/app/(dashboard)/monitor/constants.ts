/**
 * 监控配置模块常量配置
 *
 * @description
 * 定义模块所需的所有常量,包括下拉选项、表格列定义、消息文案等
 */

import type { MonitorConfigQueryRequest } from './types';
import type { OptionConfig } from '@/types/common';
import { DEFAULT_PAGE_REQUEST } from '@/constants/pagination';
import {
  FilterFieldConfig,
  FILTER_TYPES
} from '@/components/shared/filter-layout';
import { StatusConfig } from '@/components/shared/status-badge';

// ==================== 渠道类型配置 ====================

/**
 * 渠道类型统一配置
 */
export const CHANNEL_TYPES: OptionConfig[] = [
  { code: 1, desc: '小红书' },
  { code: 2, desc: '哔哩哔哩' },
  { code: 3, desc: 'YouTube' },
  { code: 4, desc: '微信公众号' },
  { code: 5, desc: '微信视频号' }
];

// ==================== 启用状态配置 ====================

/**
 * 启用状态统一配置
 */
export const ACTIVE_STATUSES: OptionConfig[] = [
  { code: 0, desc: '禁用' },
  { code: 1, desc: '启用' }
];

// ==================== 任务状态配置 ====================

/**
 * 任务状态统一配置
 */
export const TASK_STATUSES: OptionConfig[] = [
  { code: 0, desc: '待执行' },
  { code: 1, desc: '进行中' },
  { code: 2, desc: '成功' },
  { code: 3, desc: '失败' }
];

// ==================== 默认查询参数 ====================

/**
 * 默认查询参数(与后端 API 一致)
 * 使用全局分页配置
 */
export const DEFAULT_QUERY_PARAMS: MonitorConfigQueryRequest = {
  ...DEFAULT_PAGE_REQUEST
};

// ==================== 状态 Badge 配置 ====================

export const ACTIVE_STATUS_CONFIG: Record<number, StatusConfig> = {
  0: { label: '禁用', variant: 'secondary' },
  1: {
    label: '启用',
    variant: 'default',
    bg: 'bg-green-100',
    color: 'text-green-600'
  }
};

export const TASK_STATUS_CONFIG: Record<number, StatusConfig> = {
  0: { label: '待执行', variant: 'outline' },
  1: {
    label: '进行中',
    variant: 'secondary',
    bg: 'bg-blue-50',
    color: 'text-blue-500'
  },
  2: {
    label: '成功',
    variant: 'default',
    bg: 'bg-green-50',
    color: 'text-green-500'
  },
  3: { label: '失败', variant: 'destructive' }
};

// ==================== 筛选字段配置 ====================

export const FILTERS_CONFIG: FilterFieldConfig<MonitorConfigQueryRequest>[] = [
  {
    key: 'account_name',
    label: '账号名称',
    type: FILTER_TYPES.INPUT
  },
  {
    key: 'channel_code',
    label: '渠道',
    type: FILTER_TYPES.SELECT,
    options: CHANNEL_TYPES
  },
  {
    key: 'is_active',
    label: '状态',
    type: FILTER_TYPES.SELECT,
    options: ACTIVE_STATUSES
  },
  {
    startKey: 'created_at_start',
    endKey: 'created_at_end',
    label: '创建时间范围',
    type: FILTER_TYPES.DATE_RANGE,
    advanced: true
  }
];
