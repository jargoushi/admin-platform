/**
 * 实体详情展示组件
 *
 * @description
 * 统一渲染实体（如激活码）的详情数据，支持自定义渲染和徽章映射。
 */

'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Label } from '@radix-ui/react-label';

/**
 * 字段配置项
 */
export interface FieldConfig<T> {
  key: keyof T;
  label: string;
  // 自定义渲染函数,接受整个数据对象和当前字段的值
  render?: (value: unknown, data: T) => React.ReactNode;
}

/**
 * 实体详情组件属性
 */
interface EntityDetailViewProps<T extends object> {
  /** 要展示的实体数据对象 */
  data: T;
  /** 字段配置列表 */
  config: FieldConfig<T>[];
}

/**
 * 实体详情展示组件
 *
 * @param props - 组件属性
 * @returns 详情视图
 */
export function EntityDetailView<T extends object>({
  data,
  config
}: EntityDetailViewProps<T>) {
  return (
    <Card className='mt-4'>
      <CardContent className='pt-0'>
        <div className='grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2'>
          {config.map((field) => {
            const value = data[field.key];

            const content = field.render ? (
              field.render(value, data)
            ) : (
              <span
                className={cn(
                  value ? 'text-foreground' : 'text-muted-foreground italic'
                )}
              >
                {(value as React.ReactNode) || '无'}
              </span>
            );

            return (
              <div
                key={field.key.toString()}
                className='flex items-center space-x-2'
              >
                <Label className='text-muted-foreground w-20 shrink-0 text-sm font-normal'>
                  {field.label}:
                </Label>
                <div className='min-w-0 flex-1'>{content}</div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
