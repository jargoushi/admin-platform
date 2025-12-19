const TOKEN_KEY = 'access_token';
// Cookie 名称（仅用于 Middleware 检查登录状态，不存储实际 Token）
const AUTH_COOKIE_KEY = 'auth_status';

/**
 * Token 管理工具类
 */
export class TokenManager {
  /**
   * 获取访问令牌
   * @returns Token 字符串或 null
   */
  static getToken(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }
    return localStorage.getItem(TOKEN_KEY);
  }

  /**
   * 设置访问令牌
   * @param token - Token 字符串
   */
  static setToken(token: string): void {
    if (typeof window === 'undefined') {
      return;
    }
    localStorage.setItem(TOKEN_KEY, token);
    // 同步设置 Cookie（供 Middleware 检查登录状态）
    document.cookie = `${AUTH_COOKIE_KEY}=1; path=/; max-age=86400; SameSite=Lax`;
  }

  /**
   * 移除访问令牌（登出时调用）
   */
  static removeToken(): void {
    if (typeof window === 'undefined') {
      return;
    }
    localStorage.removeItem(TOKEN_KEY);
    // 清除 Cookie
    document.cookie = `${AUTH_COOKIE_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }

  /**
   * 检查 Token 是否存在
   * @returns true 如果存在，否则 false
   */
  static hasToken(): boolean {
    return !!this.getToken();
  }
}
