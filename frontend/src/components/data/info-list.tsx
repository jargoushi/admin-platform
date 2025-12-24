/**
 * 信息列表组件 (InfoList)
 *
 * @description
 * 统一的详情展示组件，支持分组、自适应网格布局和声明式配置。
 * 采用简洁的命名体系，替代原有的 DescriptionList。
 */

'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * 单个信息项配置
 */
export interface InfoItem<T = any> {
  /** 字段键名 */
  key: keyof T | string;
  /** 标签文字 */
  label: React.ReactNode;
  /** 自定义渲染函数 */
  render?: (value: any, data: T) => React.ReactNode;
  /** 跨列数 (1-4) */
  span?: number;
  /** 额外类名 */
  className?: string;
  /** 标签类名 */
  labelClassName?: string;
  /** 内容类名 */
  contentClassName?: string;
}

/**
 * 分组配置
 */
export interface InfoSection<T = any> {
  /** 分组标题 */
  title?: React.ReactNode;
  /** 分组描述 */
  description?: React.ReactNode;
  /** 字段项配置 */
  items: InfoItem<T>[];
  /** 列数 (默认 2) */
  columns?: number;
  /** 额外类名 */
  className?: string;
}

interface InfoListProps<T extends object> {
  /** 数据对象 */
  data: T;
  /** 分组配置列表 */
  sections: InfoSection<T>[];
  /** 整体类名 */
  className?: string;
}

/**
 * 信息列表组件
 */
export function InfoList<T extends object>({
  data,
  sections,
  className
}: InfoListProps<T>) {
  return (
    <div className={cn('space-y-8', className)}>
      {sections.map((section, sIdx) => (
        <section key={sIdx} className={cn('space-y-4', section.className)}>
          {/* 分组头部 */}
          {(section.title || section.description) && (
            <div className='space-y-1'>
              {section.title && (
                <h3 className='text-foreground text-sm font-medium leading-none'>
                  {section.title}
                </h3>
              )}
              {section.description && (
                <p className='text-muted-foreground text-xs'>
                  {section.description}
                </p>
              )}
            </div>
          )}

          {/* 字段网格 */}
          <dl
            className={cn(
              'bg-muted/30 grid gap-px overflow-hidden rounded-lg border shadow-sm',
              {
                'grid-cols-1 sm:grid-cols-2': (section.columns || 2) === 2,
                'grid-cols-1 sm:grid-cols-3': section.columns === 3,
                'grid-cols-1 sm:grid-cols-4': section.columns === 4
              }
            )}
          >
            {section.items.map((item) => {
              const value = (data as any)[item.key];
              const span = item.span || 1;

              return (
                <div
                  key={item.key.toString()}
                  className={cn(
                    'bg-background flex flex-col space-y-1.5 p-4',
                    {
                      'sm:col-span-2': span === 2,
                      'sm:col-span-3': span === 3,
                      'sm:col-span-4': span === 4
                    },
                    item.className
                  )}
                >
                  <dt
                    className={cn(
                      'text-muted-foreground text-xs font-medium uppercase tracking-wider',
                      item.labelClassName
                    )}
                  >
                    {item.label}
                  </dt>
                  <dd
                    className={cn(
                      'text-foreground min-w-0 flex-1 text-sm leading-relaxed break-all',
                      item.contentClassName
                    )}
                  >
                    {item.render ? (
                      item.render(value, data)
                    ) : (
                      <span
                        className={cn({
                          'text-muted-foreground italic':
                            value === null || value === undefined || value === ''
                        })}
                      >
                        {value ?? '-'}
                      </span>
                    )}
                  </dd>
                </div>
              );
            })}
          </dl>
        </section>
      ))}
    </div>
  );
}
