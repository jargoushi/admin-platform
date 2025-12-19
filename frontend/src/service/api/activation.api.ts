/**
 * 激活码 API 服务
 *
 * @description
 * 提供激活码管理的完整 API 接口，包括：
 * - 批量初始化激活码
 * - 派发激活码
 * - 激活码激活
 * - 激活码作废
 * - 查询激活码详情和分页列表
 */

import { http } from '@/lib/http';
import type { PageResponse } from '@/lib/http';

// 从模块 types.ts 导入所有类型定义
import type {
  ActivationCode,
  ActivationCodeBatchCreateRequest,
  ActivationCodeBatchResponse,
  ActivationCodeGetRequest,
  ActivationCodeInvalidateRequest,
  ActivationCodeQueryRequest
} from '@/app/(dashboard)/activation/types';

// ==================== API 服务类 ====================

/**
 * 激活码 API 服务类
 */
export class ActivationApiService {
  /**
   * 初始化激活码数据（批量创建）
   *
   * @description
   * 根据类型批量生成激活码，自动维护过期时间
   *
   * @param request - 批量创建请求
   * @returns 批量创建响应（包含各类型的激活码列表和汇总信息）
   */
  static async init(
    request: ActivationCodeBatchCreateRequest
  ): Promise<ActivationCodeBatchResponse> {
    return http.post<
      ActivationCodeBatchResponse,
      ActivationCodeBatchCreateRequest
    >('/activation/init', request);
  }

  /**
   * 派发激活码
   *
   * @description
   * 根据类型查询指定数量未使用的激活码，并更新状态为已分发
   *
   * @param request - 派发请求（类型和数量）
   * @returns 激活码字符串列表
   */
  static async distribute(
    request: ActivationCodeGetRequest
  ): Promise<string[]> {
    return http.post<string[], ActivationCodeGetRequest>(
      '/activation/distribute',
      request
    );
  }

  /**
   * 激活激活码
   *
   * @description
   * 将已分发状态的激活码激活，设置激活时间和过期时间
   *
   * @param activationCode - 激活码字符串
   * @returns 激活后的激活码详细信息
   */
  static async activate(activationCode: string): Promise<ActivationCode> {
    return http.post<ActivationCode>(
      `/activation/activate?activation_code=${encodeURIComponent(activationCode)}`
    );
  }

  /**
   * 激活码作废
   *
   * @description
   * 将已分发或已激活状态的激活码作废
   *
   * @param request - 作废请求（激活码字符串）
   * @returns 作废结果（true=成功，false=失败）
   */
  static async invalidate(
    request: ActivationCodeInvalidateRequest
  ): Promise<boolean> {
    return http.post<boolean, ActivationCodeInvalidateRequest>(
      '/activation/invalidate',
      request
    );
  }

  /**
   * 获取激活码详情
   *
   * @description
   * 根据激活码字符串获取详细信息
   *
   * @param activationCode - 激活码字符串
   * @returns 激活码详细信息
   */
  static async getDetail(activationCode: string): Promise<ActivationCode> {
    return http.get<ActivationCode>(
      '/activation/{activation_code}',
      undefined,
      {
        pathParams: { activation_code: activationCode }
      }
    );
  }

  /**
   * 获取激活码分页列表
   *
   * @description
   * 分页查询激活码列表，支持多种筛选条件
   *
   * @param params - 查询参数（分页、类型、状态、时间范围等）
   * @returns 激活码分页数据
   */
  static async getPageList(
    params?: ActivationCodeQueryRequest
  ): Promise<PageResponse<ActivationCode>> {
    return http.post<
      PageResponse<ActivationCode>,
      ActivationCodeQueryRequest | undefined
    >('/activation/pageList', params);
  }
}
