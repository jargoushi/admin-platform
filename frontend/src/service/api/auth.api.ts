/**
 * 认证 API 服务
 *
 * @description
 * 提供用户认证的完整 API 接口，包括：
 * - 用户登录
 * - 用户登出
 * - 获取用户档案
 * - 修改密码
 */

import axios from 'axios';
import { http } from '@/lib/http';
import { TokenManager } from '@/lib/http/token';
import { ENV_CONFIG } from '@/lib/http/config';

import type {
  LoginResponse,
  UserProfile,
  ChangePasswordRequest
} from '@/types/auth';

// ==================== API 服务类 ====================

/**
 * 认证 API 服务类
 */
export class AuthApiService {
  /**
   * 用户登录
   *
   * @description
   * 用户登录（支持 OAuth2 表单格式）
   * 注意：登录接口返回 OAuth2 格式，不是标准 ApiResponse，需单独处理
   *
   * @param username - 用户名
   * @param password - 密码
   * @returns 登录响应（access_token, token_type）
   */
  static async login(
    username: string,
    password: string
  ): Promise<LoginResponse> {
    // OAuth2 要求使用 application/x-www-form-urlencoded 格式
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    // 直接使用 axios，不经过响应拦截器（因为登录返回 OAuth2 格式，不是 ApiResponse）
    const response = await axios.post<LoginResponse>(
      `${ENV_CONFIG.baseURL}/auth/login`,
      formData.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    // 登录成功后保存 Token
    if (response.data.access_token) {
      TokenManager.setToken(response.data.access_token);
    }

    return response.data;
  }

  /**
   * 用户登出
   *
   * @description
   * 用户注销，清除本地 Token
   *
   * @returns 登出结果
   */
  static async logout(): Promise<boolean> {
    const result = await http.post<boolean>('/auth/logout');

    // 清除本地 Token
    TokenManager.removeToken();

    return result;
  }

  /**
   * 获取用户档案
   *
   * @description
   * 获取当前用户的基本信息
   *
   * @returns 用户档案信息
   */
  static async getProfile(): Promise<UserProfile> {
    return http.get<UserProfile>('/auth/profile');
  }

  /**
   * 修改密码
   *
   * @description
   * 修改用户密码
   *
   * @param newPassword - 新密码（8-20位，必须包含大小写字母和数字）
   * @returns 修改结果
   */
  static async changePassword(newPassword: string): Promise<boolean> {
    const request: ChangePasswordRequest = { new_password: newPassword };
    return http.post<boolean, ChangePasswordRequest>(
      '/auth/change-password',
      request
    );
  }
}
