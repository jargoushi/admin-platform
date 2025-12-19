import { http } from '@/lib/http';
import type { PageResponse } from '@/lib/http';

import type {
  Account,
  AccountQueryRequest,
  AccountCreateRequest,
  AccountUpdateRequest,
  Binding,
  BindingRequest,
  BindingUpdateRequest,
  AllSettingsResponse,
  Setting,
  SettingUpdateRequest
} from '@/app/(dashboard)/account/types';

// ==================== 账号管理 ====================

/**
 * 账号 API 服务类
 */
export class AccountApiService {
  /**
   * 分页获取账号列表
   *
   * @param params - 查询参数（分页、用户ID、名称模糊搜索）
   * @returns 账号分页数据
   */
  static async getPageList(
    params?: AccountQueryRequest
  ): Promise<PageResponse<Account>> {
    return http.post<PageResponse<Account>, AccountQueryRequest | undefined>(
      '/accounts/pageList',
      params
    );
  }

  /**
   * 创建账号
   *
   * @param request - 创建请求
   * @returns 创建的账号
   */
  static async create(request: AccountCreateRequest): Promise<Account> {
    return http.post<Account, AccountCreateRequest>(
      '/accounts/create',
      request
    );
  }

  /**
   * 更新账号
   *
   * @param request - 更新请求
   * @returns 更新后的账号
   */
  static async update(request: AccountUpdateRequest): Promise<Account> {
    return http.post<Account, AccountUpdateRequest>(
      '/accounts/update',
      request
    );
  }

  /**
   * 删除账号
   *
   * @param id - 账号 ID
   */
  static async delete(id: number): Promise<void> {
    return http.post<void>('/accounts/delete', { id });
  }

  // ==================== 项目渠道绑定 ====================

  /**
   * 获取账号的绑定列表
   *
   * @param accountId - 账号 ID
   * @returns 绑定列表
   */
  static async getBindings(accountId: number): Promise<Binding[]> {
    return http.get<Binding[]>(`/accounts/{account_id}/binddings`, undefined, {
      pathParams: { account_id: accountId }
    });
  }

  /**
   * 绑定项目渠道
   *
   * @param accountId - 账号 ID
   * @param request - 绑定请求
   * @returns 绑定结果
   */
  static async bind(
    accountId: number,
    request: BindingRequest
  ): Promise<Binding> {
    return http.post<Binding, BindingRequest>(
      `/accounts/{account_id}/binddings/bindding`,
      request,
      { pathParams: { account_id: accountId } }
    );
  }

  /**
   * 更新绑定
   *
   * @param request - 更新请求
   * @returns 更新后的绑定
   */
  static async updateBinding(request: BindingUpdateRequest): Promise<Binding> {
    return http.post<Binding, BindingUpdateRequest>(
      `/accounts/binddings/update`,
      request
    );
  }

  /**
   * 解除绑定
   *
   * @param bindingId - 绑定 ID
   */
  static async unbind(bindingId: number): Promise<void> {
    return http.post<void>(`/accounts/binddings/unbind`, { id: bindingId });
  }

  // ==================== 账号配置 ====================

  /**
   * 获取账号配置
   *
   * @param accountId - 账号 ID
   * @returns 所有配置（含继承）
   */
  static async getSettings(accountId: number): Promise<AllSettingsResponse> {
    return http.get<AllSettingsResponse>(
      `/accounts/{account_id}/settings`,
      undefined,
      { pathParams: { account_id: accountId } }
    );
  }

  /**
   * 更新账号配置
   *
   * @param accountId - 账号 ID
   * @param request - 更新请求
   * @returns 更新后的配置项
   */
  static async updateSetting(
    accountId: number,
    request: SettingUpdateRequest
  ): Promise<Setting> {
    return http.post<Setting, SettingUpdateRequest>(
      `/accounts/{account_id}/settings/update`,
      request,
      { pathParams: { account_id: accountId } }
    );
  }

  /**
   * 重置账号配置
   *
   * @param accountId - 账号 ID
   * @param settingKey - 配置项编码
   * @returns 重置后的配置项
   */
  static async resetSetting(
    accountId: number,
    settingKey: number
  ): Promise<Setting> {
    return http.post<Setting>(
      `/accounts/{account_id}/settings/reset`,
      undefined,
      {
        pathParams: { account_id: accountId },
        params: { setting_key: settingKey }
      }
    );
  }
}
