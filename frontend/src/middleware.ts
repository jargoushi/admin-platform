/**
 * Next.js 中间件 - 路由保护
 *
 * @description
 * 使用 Cookie 标记位判断登录状态，实现路由保护：
 * - 未登录用户访问受保护路由时重定向到登录页
 * - 已登录用户访问登录/注册页时重定向到 dashboard
 *
 * 注意：Cookie 仅作为登录状态标记，实际 Token 存储在 localStorage
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Cookie 名称（与 token.ts 中保持一致）
const AUTH_COOKIE_KEY = 'auth_status';

// 公开路由（无需登录即可访问）
const publicPaths = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasAuthCookie = request.cookies.has(AUTH_COOKIE_KEY);

  // 排除静态资源和 API 路由
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 已登录用户访问登录/注册页，重定向到首页
  if (hasAuthCookie && publicPaths.includes(pathname)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 未登录用户访问受保护路由（非公开路由），重定向到登录页
  if (!hasAuthCookie && !publicPaths.includes(pathname)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// 配置需要拦截的路由
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
