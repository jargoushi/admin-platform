/**
 * 账号管理模块常量配置
 *
 * @description
 * 定义模块所需的所有常量，包括默认查询参数等
 */

import type { AccountQueryRequest } from './types';
import { DEFAULT_PAGE_REQUEST } from '@/constants/pagination';
import {
  FilterFieldConfig,
  FILTER_TYPES
} from '@/components/shared/filter-layout';

// ==================== 默认查询参数 ====================

/**
 * 默认查询参数（与后端 API 一致）
 * 使用全局分页配置
 */
export const DEFAULT_QUERY_PARAMS: AccountQueryRequest = {
  ...DEFAULT_PAGE_REQUEST
};

/**
 * 账号表单默认值
 */
export const DEFAULT_ACCOUNT_FORM = {
  name: '',
  platform_account: '',
  platform_password: '',
  description: ''
};

// ==================== 筛选字段配置 ====================

export const FILTERS_CONFIG: FilterFieldConfig<AccountQueryRequest>[] = [
  {
    key: 'name',
    label: '账号名称',
    type: FILTER_TYPES.INPUT
  }
];
