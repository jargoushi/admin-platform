'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export interface TabItem {
  /** Tab 唯一标识 */
  key: string;
  /** Tab 显示文本 */
  label: string;
  /** Tab 对应的路径（相对路径，如 'info'） */
  path: string;
}

interface PageTabsProps {
  /** Tab 配置列表 */
  tabs: TabItem[];
  /** 基础路径（如 '/account/1'） */
  basePath: string;
  /** 额外类名 */
  className?: string;
}

/**
 * 页面内 Tab 导航组件
 *
 * @description
 * 用于详情页的横向 Tab 切换导航
 * 与全局 TabsNav 不同，这是页面内的局部导航
 *
 * @example
 * ```tsx
 * <PageTabs
 *   basePath={`/account/${id}`}
 *   tabs={[
 *     { key: 'info', label: '基本信息', path: 'info' },
 *     { key: 'bindings', label: '绑定管理', path: 'bindings' },
 *   ]}
 * />
 * ```
 */
export function PageTabs({ tabs, basePath, className }: PageTabsProps) {
  const pathname = usePathname();

  // 判断当前激活的 Tab
  const isActive = (tabPath: string) => {
    const fullPath = `${basePath}/${tabPath}`;
    return pathname === fullPath || pathname.startsWith(`${fullPath}/`);
  };

  return (
    <div className={cn('border-b border-border/50', className)}>
      <nav className='-mb-px flex space-x-8' aria-label='Tabs'>
        {tabs.map((tab) => {
          const active = isActive(tab.path);
          return (
            <Link
              key={tab.key}
              href={`${basePath}/${tab.path}`}
              className={cn(
                'whitespace-nowrap border-b-2 px-1 py-3 text-sm font-medium transition-colors',
                active
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:border-muted-foreground/50 hover:text-foreground'
              )}
              aria-current={active ? 'page' : undefined}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
