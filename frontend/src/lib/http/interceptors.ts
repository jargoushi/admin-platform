import type {
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError
} from 'axios';
import { toast } from 'sonner';
import { TokenManager } from './token';
import type { ApiResponse, HttpError } from './types';
import { convertDatesInObject } from '@/lib/date';

/**
 * 请求拦截器 - 成功处理
 * 主要功能：
 * 1. 注入 Authorization Token
 * 2. 转换 ISO 日期格式为后端需要的格式 (YYYY-MM-DD HH:mm:ss)
 */
export function requestInterceptor(
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig {
  // 获取 Token
  const token = TokenManager.getToken();

  // 注入 Authorization Token
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // 转换请求参数中的 ISO 日期格式
  if (config.params) {
    config.params = convertDatesInObject(config.params);
  }

  // 转换请求体中的 ISO 日期格式
  if (config.data) {
    config.data = convertDatesInObject(config.data);
  }

  return config;
}

/**
 * 请求拦截器 - 错误处理
 */
export function requestErrorInterceptor(error: AxiosError): Promise<never> {
  console.error('[HTTP Request Error]', error);
  return Promise.reject(error);
}

/**
 * 响应拦截器 - 成功处理
 * 主要功能：
 * 1. 统一业务码判断（success === true 或 code === 200 为成功）
 * 2. 业务失败时显示错误提示
 * 3. 打印响应日志（开发环境）
 */
export function responseInterceptor<T = unknown>(
  response: AxiosResponse<ApiResponse<T>>
): ApiResponse<T> {
  const { data, config } = response;

  // 开发环境打印响应日志
  if (process.env.NODE_ENV === 'development') {
    console.log(
      `%c[HTTP Response] ${config.url}`,
      'color: #10b981; font-weight: bold',
      data
    );
  }

  // 业务成功判断（优先使用 success 字段，兼容 code）
  const isSuccess = data.success === true || data.code === 200;

  if (isSuccess) {
    return data;
  }

  // 业务失败
  const errorMessage = data.message || '请求失败';
  toast.error(errorMessage);
  throw new Error(errorMessage);
}

/**
 * 响应拦截器 - 错误处理
 * 主要功能：
 * 1. 处理 HTTP 状态码错误（401, 403, 404, 500 等）
 * 2. 401 自动跳转登录页
 * 3. 网络错误处理
 * 4. 统一错误提示
 */
export function responseErrorInterceptor(
  error: AxiosError<ApiResponse>
): Promise<never> {
  const httpError: HttpError = {
    message: '请求失败',
    status: error.response?.status,
    data: error.response?.data
  };

  // HTTP 状态码错误
  if (error.response) {
    const { status, data } = error.response;

    switch (status) {
      case 401:
        // 未授权，清除 Token 并跳转登录
        httpError.message = '登录已过期，请重新登录';
        toast.error(httpError.message);
        TokenManager.removeToken();

        // 跳转到登录页
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        break;

      case 403:
        // 无权限
        httpError.message = '没有权限访问该资源';
        toast.error(httpError.message);
        break;

      case 404:
        // 资源不存在
        httpError.message = '请求的资源不存在';
        toast.error(httpError.message);
        break;

      case 500:
        // 服务器错误
        httpError.message = data?.message || '服务器内部错误';
        toast.error(httpError.message);
        break;

      default:
        // 其他错误
        httpError.message = data?.message || `请求失败 (${status})`;
        toast.error(httpError.message);
    }
  } else if (error.request) {
    // 请求已发出，但没有收到响应（网络错误）
    httpError.message = '网络连接失败，请检查网络';
    toast.error(httpError.message);
  } else {
    // 请求配置错误
    httpError.message = error.message || '请求失败';
    toast.error(httpError.message);
  }

  return Promise.reject(httpError);
}
