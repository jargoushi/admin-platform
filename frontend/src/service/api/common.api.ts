/**
 * 公共 API 服务
 *
 * @description
 * 提供公共数据的 API 接口
 */

import { http } from '@/lib/http';

// ==================== 枚举类型 ====================

/**
 * 枚举响应类型（与后端 EnumResponse 一致）
 */
export interface EnumItem {
  /** 枚举 code */
  code: number;
  /** 枚举描述 */
  desc: string;
}

// ==================== 设置元数据类型 ====================

/**
 * 配置值类型
 */
export type SettingValueType =
  | 'bool'
  | 'str'
  | 'int'
  | 'float'
  | 'json'
  | 'select'
  | 'multiselect'
  | 'path'
  | 'textarea';

/**
 * 配置项元数据
 */
export interface SettingMeta {
  /** 配置项编码 */
  code: number;
  /** 配置项名称 */
  name: string;
  /** 值类型 */
  type: SettingValueType;
  /** 默认值 */
  default: unknown;
  /** 选项（用于 select/multiselect） */
  options?: { value: string | number; label: string }[] | null;
  /** 是否必填 */
  required: boolean;
}

/**
 * 分组元数据
 */
export interface SettingGroupMeta {
  /** 分组编码 */
  code: number;
  /** 分组名称 */
  name: string;
  /** 图标名称，如 "settings", "bell", "wrench", "download" */
  icon?: string;
  /** 配置项列表 */
  settings: SettingMeta[];
}

/**
 * 设置元数据响应
 */
export interface SettingsMetadataResponse {
  groups: SettingGroupMeta[];
}

// ==================== API 服务 ====================

export class CommonApiService {
  /**
   * 获取所有项目列表
   */
  static async getProjects(): Promise<EnumItem[]> {
    return http.get<EnumItem[]>('/common/projects');
  }

  /**
   * 获取所有渠道列表
   */
  static async getChannels(): Promise<EnumItem[]> {
    return http.get<EnumItem[]>('/common/channels');
  }

  /**
   * 获取设置元数据
   */
  static async getSettingsMetadata(): Promise<SettingsMetadataResponse> {
    return http.get<SettingsMetadataResponse>('/common/settings/metadata');
  }
}
