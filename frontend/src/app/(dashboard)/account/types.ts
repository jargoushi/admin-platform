/**
 * 账号管理模块类型定义
 *
 * @description
 * 定义账号模块所需的所有 TypeScript 接口和类型
 * 与后端 account_router.py 接口保持一致
 */

// ==================== 账号相关 ====================

/**
 * 账号实体（与后端 AccountResponse 一致）
 */
export interface Account {
  /** 账号 ID */
  id: number;
  /** 账号名称 */
  name: string;
  /** 第三方平台账号 */
  platform_account?: string;
  /** 第三方平台密码 */
  platform_password?: string;
  /** 账号描述 */
  description?: string;
  /** 创建时间 */
  created_at: string;
}

/**
 * 账号分页查询请求（与后端 AccountQueryRequest 一致）
 */
export interface AccountQueryRequest {
  /** 当前页码 */
  page?: number;
  /** 每页数量 */
  size?: number;
  /** 用户 ID（不传则查询所有） */
  user_id?: number;
  /** 账号名称（模糊搜索） */
  name?: string;
  /** QueryParams 兼容索引签名 */
  [key: string]: string | number | undefined;
}

/**
 * 创建账号请求（与后端 AccountCreateRequest 一致）
 */
export interface AccountCreateRequest {
  /** 账号名称（必填，最长100字符） */
  name: string;
  /** 第三方平台账号（可选） */
  platform_account?: string;
  /** 第三方平台密码（可选） */
  platform_password?: string;
  /** 账号描述（可选，最长500字符） */
  description?: string;
}

/**
 * 更新账号请求（与后端 AccountUpdateRequest 一致）
 */
export interface AccountUpdateRequest {
  /** 账号 ID（必填） */
  id: number;
  /** 账号名称（可选） */
  name?: string;
  /** 第三方平台账号（可选） */
  platform_account?: string;
  /** 第三方平台密码（可选） */
  platform_password?: string;
  /** 账号描述（可选） */
  description?: string;
}

/**
 * 删除账号请求
 */
export interface AccountDeleteRequest {
  /** 账号 ID */
  id: number;
}

// ==================== 项目渠道绑定相关 ====================

/**
 * 绑定实体（与后端 BindingResponse 一致）
 */
export interface Binding {
  /** 绑定 ID */
  id: number;
  /** 项目枚举 code */
  project_code: number;
  /** 项目名称 */
  project_name: string;
  /** 渠道枚举 code 列表 */
  channel_codes: number[];
  /** 渠道名称列表 */
  channel_names: string[];
  /** 浏览器 ID */
  browser_id?: string;
}

/**
 * 绑定请求（与后端 BindingRequest 一致）
 */
export interface BindingRequest {
  /** 项目枚举 code */
  project_code: number;
  /** 渠道枚举 code 列表 */
  channel_codes: number[];
  /** 浏览器 ID（可选） */
  browser_id?: string;
}

/**
 * 更新绑定请求
 */
export interface BindingUpdateRequest {
  /** 绑定 ID */
  id: number;
  /** 渠道枚举 code 列表（可选） */
  channel_codes?: number[];
  /** 浏览器 ID */
  browser_id?: string;
}

/**
 * 解绑请求
 */
export interface BindingDeleteRequest {
  /** 绑定 ID */
  id: number;
}

// ==================== 账号配置相关 ====================

/**
 * 配置项（与后端 SettingResponse 一致）
 */
export interface Setting {
  /** 配置项编码 */
  setting_key: number;
  /** 配置项名称 */
  setting_key_name: string;
  /** 配置值 */
  setting_value: unknown;
  /** 所属分组名称 */
  group: string;
  /** 值类型 */
  value_type: string;
  /** 是否为默认值 */
  is_default: boolean;
}

/**
 * 分组配置响应
 */
export interface SettingGroup {
  /** 分组名称 */
  group: string;
  /** 分组编码 */
  group_code: number;
  /** 该分组下的配置列表 */
  settings: Setting[];
}

/**
 * 所有配置响应
 */
export interface AllSettingsResponse {
  /** 按分组组织的配置 */
  groups: SettingGroup[];
}

/**
 * 更新配置请求
 */
export interface SettingUpdateRequest {
  /** 配置项编码 */
  setting_key: number;
  /** 配置值 */
  setting_value: unknown;
}
