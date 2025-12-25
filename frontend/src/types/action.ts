import React from 'react';
import { LucideIcon } from 'lucide-react';

/**
 * 统一操作项配置接口
 */
export interface Action<T = any> {
  /** 唯一标识 */
  key: string;
  /** 按钮文本 */
  label: string;
  /** 图标组件 (LucideIcon) */
  icon?: LucideIcon;
  /** 点击回调 (支持异步) */
  onClick?: (record: T) => void | Promise<any>;
  /** 声明式弹窗配置 */
  dialog?: {
    title: string;
    description?: string;
    component: React.ComponentType<any>;
    /** 传递给组件的额外数据 */
    extraData?: any;
  };
  /** 声明式确认配置 */
  confirm?: {
    title?: string;
    description: string | ((record: T) => string);
  };
  /** 隐藏此操作（支持静态布尔值或动态函数） */
  hidden?: boolean | ((record: T) => boolean);
  /** 禁用此操作（支持静态布尔值或动态函数） */
  disabled?: boolean | ((record: T) => boolean);
  /** 按钮变体 */
  variant?: 'default' | 'outline' | 'ghost' | 'destructive';
  /** 额外类名（用于特殊样式如危险操作） */
  className?: string;
}

/**
 * 操作组展示模式
 */
export type ActionGroupMode = 'buttons' | 'dropdown';

