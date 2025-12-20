/**
 * 浏览器管理 API 服务
 */

import { http } from '@/lib/http';
import type { PageResponse } from '@/lib/http';
import type {
  BrowserListItem,
  BrowserListRequest,
  BrowserDetail,
  BrowserOpenRequest,
  BrowserBatchOpenResponse,
  WindowArrangeRequest
} from '@/app/(dashboard)/browser/types';

/**
 * 浏览器管理 API 服务类
 */
export class BrowserApiService {
  /**
   * 健康检查
   */
  static async healthCheck(): Promise<boolean> {
    return http.post<boolean, undefined>('/browser/health', undefined);
  }

  /**
   * 获取浏览器列表
   */
  static async getPageList(
    params: BrowserListRequest
  ): Promise<PageResponse<BrowserListItem>> {
    return http.post<PageResponse<BrowserListItem>, BrowserListRequest>(
      '/browser/list',
      params
    );
  }

  /**
   * 获取浏览器详情
   */
  static async getDetail(id: string): Promise<BrowserDetail> {
    return http.post<BrowserDetail, { id: string }>('/browser/detail', { id });
  }

  /**
   * 批量打开浏览器
   */
  static async open(
    request: BrowserOpenRequest
  ): Promise<BrowserBatchOpenResponse> {
    return http.post<BrowserBatchOpenResponse, BrowserOpenRequest>(
      '/browser/open',
      request
    );
  }

  /**
   * 关闭浏览器
   */
  static async close(id: string): Promise<boolean> {
    return http.post<boolean, { id: string }>('/browser/close', { id });
  }

  /**
   * 关闭所有浏览器
   */
  static async closeAll(): Promise<boolean> {
    return http.post<boolean, undefined>('/browser/close-all', undefined);
  }

  /**
   * 删除浏览器
   */
  static async delete(id: string): Promise<boolean> {
    return http.post<boolean, { id: string }>('/browser/delete', { id });
  }

  /**
   * 排列窗口
   */
  static async arrange(seqlist?: number[]): Promise<boolean> {
    return http.post<boolean, WindowArrangeRequest>('/browser/arrange', {
      seqlist
    });
  }
}
