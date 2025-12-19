import type { PageRequest } from '@/lib/http/types';

/**
 * 默认分页请求参数
 */
export const DEFAULT_PAGE_REQUEST: PageRequest = {
  page: 1,
  size: 10
};

/**
 * 默认分页响应状态 (用于初始化)
 */
export const DEFAULT_PAGINATION = {
  total: 0,
  page: 1,
  size: 10,
  pages: 0
};
