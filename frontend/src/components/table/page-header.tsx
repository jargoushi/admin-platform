'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

/**
 * 操作按钮配置
 */
export interface PageHeaderAction {
  /** 按钮文本 */
  label: string;
  /** 点击回调 */
  onClick: () => void;
  /** 按钮图标 */
  icon?: React.ReactNode;
  /** 按钮变体 */
  variant?: 'default' | 'outline' | 'ghost' | 'destructive';
}

interface PageHeaderProps {
  /** 操作按钮列表 */
  actions?: PageHeaderAction[];
}

/**
 * 页面头部组件
 * 支持传入多个操作按钮
 */
export function PageHeader({ actions = [] }: PageHeaderProps) {
  if (actions.length === 0) {
    return null;
  }

  return (
    <div className='flex items-center justify-end gap-3'>
      {actions.map((action, index) => (
        <Button
          key={index}
          onClick={action.onClick}
          variant={action.variant || 'default'}
          className='cursor-pointer gap-2'
        >
          {action.icon}
          {action.label}
        </Button>
      ))}
    </div>
  );
}
