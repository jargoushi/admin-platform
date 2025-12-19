/**
 * 监控配置模块类型定义
 *
 * @description
 * 定义监控配置模块所需的所有 TypeScript 接口和类型
 * 包括后端 API 约定的类型和前端特有的类型
 */

/**
 * 监控配置实体（与后端 MonitorConfigResponse 一致）
 */
export interface MonitorConfig {
  /** 配置ID */
  id: number;
  /** 用户ID */
  user_id: number;
  /** 渠道编码 (1-5) */
  channel_code: number;
  /** 渠道名称 */
  channel_name: string;
  /** 监控目标链接 */
  target_url: string;
  /** 平台唯一ID */
  target_external_id?: string;
  /** 账号名称 */
  account_name?: string;
  /** 账号头像 */
  account_avatar?: string;
  /** 是否启用 (0=否, 1=是) */
  is_active: number;
  /** 上次执行时间 */
  last_run_at?: string;
  /** 上次执行结果 */
  last_run_status?: number;
  /** 创建时间 */
  created_at: string;
  /** 更新时间 */
  updated_at: string;
}

/**
 * 创建监控配置请求
 */
export interface MonitorConfigCreateRequest {
  /** 渠道编码 (1-5) */
  channel_code: number;
  /** 监控目标链接 */
  target_url: string;
}

/**
 * 修改监控配置请求
 */
export interface MonitorConfigUpdateRequest {
  /** 配置ID */
  id: number;
  /** 监控目标链接 */
  target_url: string;
}

/**
 * 切换监控状态请求
 */
export interface MonitorConfigToggleRequest {
  /** 配置ID */
  id: number;
  /** 是否启用 (0=否, 1=是) */
  is_active: number;
}

/**
 * 监控配置查询参数
 */
export interface MonitorConfigQueryRequest {
  /** 当前页码 */
  page?: number;
  /** 每页数量 */
  size?: number;
  /** 账号名称（模糊查询） */
  account_name?: string;
  /** 渠道编码 (1-5) */
  channel_code?: number;
  /** 是否启用 (0=否, 1=是) */
  is_active?: number;
  /** 创建时间开始 */
  created_at_start?: string;
  /** 创建时间结束 */
  created_at_end?: string;
  /** QueryParams 兼容索引签名 */
  [key: string]: string | number | undefined;
}

/**
 * 每日明细数据查询请求
 */
export interface MonitorDailyStatsQueryRequest {
  /** 配置ID */
  config_id: number;
  /** 开始日期 */
  start_date: string;
  /** 结束日期 */
  end_date: string;
}

/**
 * 每日明细数据响应
 */
export interface MonitorDailyStats {
  /** 记录ID */
  id: number;
  /** 配置ID */
  config_id: number;
  /** 统计日期 */
  stat_date: string;
  /** 粉丝数 */
  follower_count: number;
  /** 获赞数 */
  liked_count: number;
  /** 播放量 */
  view_count: number;
  /** 内容数 */
  content_count: number;
  /** 扩展数据 */
  extra_data?: Record<string, unknown>;
  /** 创建时间 */
  created_at: string;
}
