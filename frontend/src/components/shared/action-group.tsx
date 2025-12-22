'use client';

import React, { useCallback } from 'react';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useConfirmation } from '@/contexts/confirmation-provider';
import { useDialog } from '@/contexts/dialog-provider';
import { toast } from 'sonner';
import { Action, ActionGroupMode } from '@/types/action';

interface ActionGroupProps<T> {
  /** 当前行数据 (如果是 Header 操作则为 undefined) */
  record?: T;
  /** 操作项列表 */
  actions: Action<T>[];
  /** 展示模式 */
  mode?: ActionGroupMode;
  /** 刷新回调 */
  onRefresh?: () => void;
  /** 混合模式下直接展示的数量 */
  maxVisible?: number;
  /** 容器类名 */
  className?: string;
}

export function ActionGroup<T>({
  record,
  actions,
  mode = 'buttons',
  onRefresh,
  maxVisible = 2,
  className = ''
}: ActionGroupProps<T>) {
  const { confirm } = useConfirmation();
  const { open } = useDialog();

  // 1. 过滤可见操作
  const visibleActions = actions.filter((action) => {
    if (typeof action.hidden === 'function') {
      return !action.hidden(record as T);
    }
    return !action.hidden;
  });

  // 2. 核心执行引擎
  const handleAction = useCallback(
    async (action: Action<T>) => {
      const execute = async () => {
        try {
          // 处理弹窗逻辑
          if (action.dialog) {
            // 只有当 record 存在或 extraData 存在时才传递 data
            const dialogData = record || action.dialog.extraData
              ? { ...record, ...action.dialog.extraData }
              : undefined;

            open({
              title: action.dialog.title,
              description: action.dialog.description,
              component: action.dialog.component,
              data: dialogData,
              className: action.dialog.className,
              onClose: () => onRefresh?.()
            });
            return;
          }

          // 处理点击逻辑
          if (action.onClick) {
            const result = action.onClick(record as T);
            if (result instanceof Promise) {
              await result;
              toast.success(`${typeof action.label === 'function' ? action.label(record as T) : action.label}成功`);
              onRefresh?.();
            }
          }
        } catch (error) {
          console.error('Action execution failed:', error);
          // 错误提示通常由 API 层处理，这里做兜底
        }
      };

      // 处理确认逻辑
      if (action.confirm) {
        const description =
          typeof action.confirm.description === 'function'
            ? action.confirm.description(record as T)
            : action.confirm.description;

        confirm({
          title: action.confirm.title || '确认操作',
          description,
          onConfirm: execute
        });
      } else {
        await execute();
      }
    },
    [confirm, open, record, onRefresh]
  );

  if (visibleActions.length === 0) return null;

  // 3. 渲染逻辑 - 按钮模式 (Header 用)
  if (mode === 'buttons') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        {visibleActions.map((action) => {
          const Icon = action.icon;
          const isDisabled =
            typeof action.disabled === 'function'
              ? action.disabled(record as T)
              : action.disabled;

          return (
            <Button
              key={action.key}
              variant={action.variant || 'default'}
              onClick={() => handleAction(action)}
              disabled={isDisabled}
              className={`gap-2 ${action.className || ''}`}
            >
              {Icon && <Icon className='h-4 w-4' />}
              {typeof action.label === 'function' ? action.label(record as T) : action.label}
            </Button>
          );
        })}
      </div>
    );
  }

  // 4. 渲染逻辑 - 下拉模式 (Table 用)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='h-8 w-8 p-0 cursor-pointer'>
          <MoreHorizontal className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='min-w-[120px]'>
        {visibleActions.map((action) => {
          const Icon = action.icon;
          const isDisabled =
            typeof action.disabled === 'function'
              ? action.disabled(record as T)
              : action.disabled;

          return (
            <DropdownMenuItem
              key={action.key}
              onClick={() => handleAction(action)}
              disabled={isDisabled}
              className={`${action.className || ''} cursor-pointer py-2`}
            >
              {Icon && <Icon className='mr-2 h-4 w-4 flex-shrink-0' />}
              <span className='flex-1'>
                {typeof action.label === 'function' ? action.label(record as T) : action.label}
              </span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
