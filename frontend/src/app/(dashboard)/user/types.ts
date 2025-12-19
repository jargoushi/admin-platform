/**
 * 用户管理模块类型定义
 *
 * @description
 * 定义用户模块所需的所有 TypeScript 接口和类型
 * 与后端 user_router.py 接口保持一致
 */

/**
 * 用户实体（与后端 UserResponse 一致）
 */
export interface User {
  /** 用户 ID */
  id: number;
  /** 用户名 */
  username: string;
  /** 手机号 */
  phone?: string;
  /** 邮箱地址 */
  email?: string;
  /** 激活码 */
  activation_code: string;
  /** 创建时间 */
  created_at: string;
  /** 更新时间 */
  updated_at: string;
}

/**
 * 用户注册请求（与后端 UserRegisterRequest 一致）
 */
export interface UserRegisterRequest {
  /** 用户名（2-50位，只能包含字母、数字和下划线） */
  username: string;
  /** 密码（8-20位，必须包含大小写字母和数字） */
  password: string;
  /** 激活码 */
  activation_code: string;
}

/**
 * 用户更新请求（与后端 UserUpdateRequest 一致）
 */
export interface UserUpdateRequest {
  /** 用户名（可选，2-50位） */
  username?: string;
  /** 手机号（可选，中国大陆格式） */
  phone?: string;
  /** 邮箱（可选） */
  email?: string;
}

/**
 * 用户列表查询参数（与后端 UserQueryRequest 一致）
 */
export interface UserQueryRequest {
  /** 当前页码 */
  page?: number;
  /** 每页数量 */
  size?: number;
  /** 用户名模糊查询 */
  username?: string;
  /** 手机号模糊查询 */
  phone?: string;
  /** 邮箱模糊查询 */
  email?: string;
  /** 激活码模糊查询 */
  activation_code?: string;
  /** QueryParams 兼容索引签名 */
  [key: string]: string | number | undefined;
}
