/**
 * 任务管理模块常量配置
 *
 * @description
 * 定义模块所需的所有常量,包括下拉选项、表格列定义、消息文案等
 */

import type { MonitorTaskQueryRequest } from './types';
import type { OptionConfig } from '@/types/common';
import { DEFAULT_PAGE_REQUEST } from '@/constants/pagination';

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

// ==================== 任务类型配置 ====================

/**
 * 任务类型统一配置
 */
export const TASK_TYPES: OptionConfig[] = [
  { code: 1, desc: '每日数据采集' },
  { code: 2, desc: '手动刷新' }
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
export const DEFAULT_QUERY_PARAMS: MonitorTaskQueryRequest = {
  ...DEFAULT_PAGE_REQUEST
};
