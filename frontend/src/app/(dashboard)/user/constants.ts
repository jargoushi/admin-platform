/**
 * 用户管理模块常量配置
 *
 * @description
 * 定义模块所需的所有常量,包括下拉选项、默认参数等
 */

import type { UserQueryRequest } from './types';
import { DEFAULT_PAGE_REQUEST } from '@/constants/pagination';
import {
  FilterFieldConfig,
  FILTER_TYPES
} from '@/components/shared/filter-layout';

// ==================== 默认查询参数 ====================

/**
 * 默认查询参数
 * 使用全局分页配置
 */
export const DEFAULT_QUERY_PARAMS: UserQueryRequest = {
  ...DEFAULT_PAGE_REQUEST
};

// ==================== 筛选字段配置 ====================

export const FILTERS_CONFIG: FilterFieldConfig<UserQueryRequest>[] = [
  {
    key: 'username',
    label: '用户名',
    type: FILTER_TYPES.INPUT
  },
  {
    key: 'phone',
    label: '手机号',
    type: FILTER_TYPES.INPUT
  },
  {
    key: 'email',
    label: '邮箱',
    type: FILTER_TYPES.INPUT
  },
  {
    key: 'activation_code',
    label: '激活码',
    type: FILTER_TYPES.INPUT
  }
];
