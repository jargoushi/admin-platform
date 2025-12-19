/**
 * 设置 API 服务
 *
 * @description
 * 提供设置管理的 API 接口
 */

import { http } from '@/lib/http';

// ==================== 类型定义 ====================

/**
 * 配置项响应（与后端 SettingResponse 一致）
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
  /** 配置列表 */
  settings: Setting[];
}

/**
 * 所有配置响应
 */
export interface AllSettingsResponse {
  groups: SettingGroup[];
}

/**
 * 更新配置请求
 */
export interface SettingUpdateRequest {
  setting_key: number;
  setting_value: unknown;
}

// ==================== API 服务 ====================

export class SettingApiService {
  /**
   * 获取所有配置（按分组）
   */
  static async getAll(): Promise<AllSettingsResponse> {
    return http.get<AllSettingsResponse>('/settings/');
  }

  /**
   * 获取单个配置
   */
  static async get(settingKey: number): Promise<Setting> {
    return http.get<Setting>(`/settings/${settingKey}`);
  }

  /**
   * 更新配置
   */
  static async update(request: SettingUpdateRequest): Promise<Setting> {
    return http.post<Setting, SettingUpdateRequest>(
      '/settings/update',
      request
    );
  }

  /**
   * 重置配置为默认值
   */
  static async reset(settingKey: number): Promise<Setting> {
    return http.post<Setting>(`/settings/${settingKey}/reset`);
  }

  /**
   * 按分组获取配置
   */
  static async getByGroup(groupCode: number): Promise<SettingGroup> {
    return http.get<SettingGroup>(`/settings/group/${groupCode}`);
  }
}
