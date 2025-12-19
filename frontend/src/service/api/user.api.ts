/**
 * 用户 API 服务
 *
 * @description
 * 提供用户管理的完整 API 接口，包括：
 * - 用户注册
 * - 获取当前用户信息
 * - 更新用户信息
 * - 分页获取用户列表
 */

import { http } from '@/lib/http';
import type { PageResponse } from '@/lib/http';

import type {
  User,
  UserRegisterRequest,
  UserUpdateRequest,
  UserQueryRequest
} from '@/app/(dashboard)/user/types';

// ==================== API 服务类 ====================

/**
 * 用户 API 服务类
 */
export class UserApiService {
  /**
   * 用户注册
   *
   * @description
   * 用户注册（需要用户名、密码和激活码）
   *
   * @param request - 注册请求
   * @returns 注册成功后的用户信息
   */
  static async register(request: UserRegisterRequest): Promise<User> {
    return http.post<User, UserRegisterRequest>('/users/register', request);
  }

  /**
   * 获取当前用户信息
   *
   * @description
   * 根据当前登录用户的 Token 获取用户信息
   *
   * @returns 当前用户信息
   */
  static async getCurrentUser(): Promise<User> {
    return http.get<User>('/users/');
  }

  /**
   * 更新用户信息
   *
   * @description
   * 更新用户信息（支持更新用户名、手机号、邮箱）
   *
   * @param userId - 用户 ID
   * @param request - 更新请求
   * @returns 更新后的用户信息
   */
  static async update(
    userId: number,
    request: UserUpdateRequest
  ): Promise<User> {
    return http.put<User, UserUpdateRequest>('/users/{user_id}', request, {
      pathParams: { user_id: userId }
    });
  }

  /**
   * 分页获取用户列表
   *
   * @description
   * 获取用户列表（分页+条件查询）
   *
   * @param params - 查询参数（分页、用户名、手机号等）
   * @returns 用户分页数据
   */
  static async getPageList(
    params?: UserQueryRequest
  ): Promise<PageResponse<User>> {
    return http.post<PageResponse<User>, UserQueryRequest | undefined>(
      '/users/pageList',
      params
    );
  }
}
