/**
 * 任务管理模块常量配置
 *
 * @description
 * 定义模块所需的所有常量,包括下拉选项、表格列定义、消息文案等
 */

import type { MonitorTaskQueryRequest } from './types';
import { DEFAULT_PAGE_REQUEST } from '@/constants/pagination';
import {
  FilterFieldConfig,
  FILTER_TYPES
} from '@/components/form/filter-layout';
import { SmartEnum } from '@/lib/enum';

// ==================== 枚举配置 (单一事实来源) ====================

/** 渠道类型枚举 */
export const CHANNEL_ENUM = new SmartEnum([
  {
    code: 1,
    label: '抖音',
    variant: 'outline',
    bg: 'bg-pink-50',
    color: 'text-pink-500'
  },
  {
    code: 2,
    label: 'YouTube',
    variant: 'outline',
    bg: 'bg-red-100',
    color: 'text-red-600'
  },
  {
    code: 3,
    label: '哔哩哔哩',
    variant: 'outline',
    bg: 'bg-blue-50',
    color: 'text-blue-500'
  },
  {
    code: 4,
    label: '视频号',
    variant: 'outline',
    bg: 'bg-green-50',
    color: 'text-green-500'
  }
]);

/** 任务类型枚举 */
export const TASK_TYPE_ENUM = new SmartEnum([
  {
    code: 1,
    label: '每日数据采集',
    variant: 'outline',
    bg: 'bg-indigo-50',
    color: 'text-indigo-500'
  },
  {
    code: 2,
    label: '手动刷新',
    variant: 'outline',
    bg: 'bg-sky-50',
    color: 'text-sky-500'
  }
]);

/** 任务状态枚举 */
export const TASK_STATUS_ENUM = new SmartEnum([
  { code: 0, label: '待执行', variant: 'outline' },
  {
    code: 1,
    label: '进行中',
    variant: 'secondary',
    bg: 'bg-blue-50',
    color: 'text-blue-500'
  },
  {
    code: 2,
    label: '成功',
    variant: 'default',
    bg: 'bg-green-50',
    color: 'text-green-500'
  },
  { code: 3, label: '失败', variant: 'destructive' }
]);

// ==================== 默认查询参数 ====================

/**
 * 默认查询参数
 * 使用全局分页配置
 */
export const DEFAULT_QUERY_PARAMS: MonitorTaskQueryRequest = {
  ...DEFAULT_PAGE_REQUEST
};

// ==================== 筛选字段配置 ====================

export const FILTERS_CONFIG: FilterFieldConfig<MonitorTaskQueryRequest>[] = [
  {
    key: 'channel_code',
    label: '渠道',
    type: FILTER_TYPES.SELECT,
    options: CHANNEL_ENUM
  },
  {
    key: 'task_type',
    label: '任务类型',
    type: FILTER_TYPES.SELECT,
    options: TASK_TYPE_ENUM
  },
  {
    key: 'task_status',
    label: '任务状态',
    type: FILTER_TYPES.SELECT,
    options: TASK_STATUS_ENUM
  },
  {
    startKey: 'start_date',
    endKey: 'end_date',
    label: '调度日期范围',
    type: FILTER_TYPES.DATE_RANGE,
    advanced: true
  }
];
