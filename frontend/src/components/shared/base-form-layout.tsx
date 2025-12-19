/**
 * 基础表单布局组件
 *
 * @description
 * 提供表单的统一布局和提交按钮管理:
 * - 自动管理提交按钮(loading、禁用状态)
 * - 自动处理表单/结果模式切换
 * - 统一的布局样式
 * - 移除冗余的取消按钮(弹窗本身有关闭功能)
 */
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SubmitConfig {
  /** 按钮文字 */
  text: string;
  /** 提交处理函数 */
  onSubmit: () => void | Promise<void> | Promise<unknown>;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否加载中 */
  loading?: boolean;
}

interface BaseFormLayoutProps {
  /** 表单内容 */
  children: React.ReactNode;

  /** 结果内容(可选,有值则进入结果模式,不显示提交按钮) */
  resultContent?: React.ReactNode;

  /** 提交按钮配置(可选,不传则不显示提交按钮,适用于纯展示场景) */
  submit?: SubmitConfig;

  /** 容器类名 */
  className?: string;
}

/**
 * 基础表单布局组件
 */
export function BaseFormLayout({
  children,
  resultContent,
  submit,
  className
}: BaseFormLayoutProps) {
  // 判断是否为结果模式
  const isResultMode = !!resultContent;

  // 显示的内容
  const content = isResultMode ? resultContent : children;

  // 提交处理
  const handleSubmit = async () => {
    if (submit && !submit.disabled && !submit.loading) {
      await submit.onSubmit();
    }
  };

  return (
    <div className={cn('flex flex-col space-y-4', className)}>
      {/* 内容区域 */}
      <div className='flex-1'>{content}</div>

      {/* 提交按钮: 仅在表单模式且传入 submit 配置时显示 */}
      {!isResultMode && submit && (
        <div className='flex justify-end'>
          <Button
            onClick={handleSubmit}
            disabled={submit.disabled || submit.loading}
          >
            {submit.loading && (
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            )}
            {submit.text}
          </Button>
        </div>
      )}
    </div>
  );
}
