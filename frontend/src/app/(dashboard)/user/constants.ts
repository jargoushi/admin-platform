/**
 * 用户管理模块常量配置
 *
 * @description
 * 定义模块所需的所有常量,包括下拉选项、默认参数等
 */

import type { UserQueryRequest } from './types';
import { DEFAULT_PAGE_REQUEST } from '@/constants/pagination';

// ==================== 默认查询参数 ====================

/**
 * 默认查询参数(与后端 API 一致)
 * 使用全局分页配置
 */
export const DEFAULT_QUERY_PARAMS: UserQueryRequest = {
  ...DEFAULT_PAGE_REQUEST
};
