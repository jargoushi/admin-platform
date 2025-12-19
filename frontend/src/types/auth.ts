/**
 * 认证模块类型定义
 *
 * @description
 * 定义认证模块所需的所有 TypeScript 接口和类型
 * 与后端 auth_router.py 接口保持一致
 */

/**
 * 登录响应（OAuth2 标准格式）
 */
export interface LoginResponse {
  /** 访问令牌 */
  access_token: string;
  /** 令牌类型 */
  token_type: string;
}

/**
 * 用户档案（与后端 /auth/profile 返回一致）
 */
export interface UserProfile {
  /** 用户 ID */
  id: number;
  /** 用户名 */
  username: string;
  /** 手机号 */
  phone?: string;
  /** 邮箱 */
  email?: string;
}

/**
 * 修改密码请求（与后端 ChangePasswordRequest 一致）
 */
export interface ChangePasswordRequest {
  /** 新密码（8-20位，必须包含大小写字母和数字） */
  new_password: string;
}
