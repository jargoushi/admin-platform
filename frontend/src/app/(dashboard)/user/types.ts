import { BaseEntity, BaseQueryRequest } from '@/types/common';

/**
 * 用户实体
 */
export interface User extends BaseEntity {
  /** 用户名 */
  username: string;
  /** 手机号 */
  phone?: string;
  /** 邮箱地址 */
  email?: string;
  /** 激活码 */
  activation_code: string;
}

/**
 * 用户注册请求
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
 * 用户更新请求
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
 * 用户列表查询参数
 */
export interface UserQueryRequest extends BaseQueryRequest {
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
