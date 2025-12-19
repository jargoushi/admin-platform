/**
 * 任务管理 API 服务
 *
 * @description
 * 提供任务管理的完整 API 接口，包括：
 * - 分页查询任务列表
 */

import { http } from '@/lib/http';
import type { PageResponse } from '@/lib/http';

// 从模块 types.ts 导入所有类型定义
import type {
  MonitorTask,
  MonitorTaskQueryRequest
} from '@/app/(dashboard)/task/types';

// ==================== API 服务类 ====================

/**
 * 任务管理 API 服务类
 */
export class TaskApiService {
  /**
   * 获取任务分页列表
   *
   * @description
   * 分页查询任务列表，支持多种筛选条件
   *
   * @param params - 查询参数（分页、渠道、类型、状态、日期范围等）
   * @returns 任务分页数据
   */
  static async getPageList(
    params?: MonitorTaskQueryRequest
  ): Promise<PageResponse<MonitorTask>> {
    return http.post<
      PageResponse<MonitorTask>,
      MonitorTaskQueryRequest | undefined
    >('/task/pageList', params);
  }
}
