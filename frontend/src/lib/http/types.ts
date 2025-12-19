import type { AxiosRequestConfig } from 'axios';

/**
 * 统一的 API 响应结构（与后端 Python ApiResponse 模型一致）
 * @template T - 响应数据的类型
 */
export interface ApiResponse<T = unknown> {
  /** 请求是否成功 */
  success: boolean;
  /** 业务状态码（200=成功，其他=失败） */
  code: number;
  /** 响应消息 */
  message: string;
  /** 响应数据（泛型） */
  data?: T;
  /** 响应时间戳（ISO 8601 格式） */
  timestamp: string;
}

/**
 * 分页响应数据结构(与后端 Python PageResponse 模型一致)
 * @template T - 列表项的类型
 */
export interface PageResponse<T = unknown> {
  /** 总记录数 */
  total: number;
  /** 当前页码 */
  page: number;
  /** 每页数量 */
  size: number;
  /** 总页数 */
  pages: number;
  /** 当前页的数据列表 */
  items: T[];
}

/**
 * 分页信息(不包含数据列表)
 * 从 PageResponse 提取,用于组件 props 传递
 */
export type PaginationInfo = Omit<PageResponse, 'items'>;

/**
 * 分页请求参数（与后端 Python PageRequest 模型一致）
 */
export interface PageRequest {
  /** 当前页码，从1开始 */
  page?: number;
  /** 每页数量，最大100 */
  size?: number;
}

/**
 * 查询参数类型
 * 使用索引签名允许任意字符串键
 */
export interface QueryParams {
  [key: string]: string | number | boolean | undefined | null;
}

/**
 * 自定义请求配置
 */
export interface RequestConfig extends AxiosRequestConfig {
  /** 是否显示 loading，默认 true */
  showLoading?: boolean;
  /** 是否显示错误提示，默认 true */
  showError?: boolean;
  /** 是否需要 Token 认证，默认 true */
  requireAuth?: boolean;
  /** 自动重试次数，默认 0 */
  retryCount?: number;
}

/**
 * RESTful 路径参数
 * @example { id: 1 } -> /api/user/1
 */
export interface PathParams {
  [key: string]: string | number;
}

/**
 * HTTP 错误响应
 */
export interface HttpError {
  /** HTTP 状态码 */
  status?: number;
  /** 错误信息 */
  message: string;
  /** 错误数据 */
  data?: unknown;
}
