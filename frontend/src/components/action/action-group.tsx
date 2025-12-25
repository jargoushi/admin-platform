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
}

export function ActionGroup<T>({
  record,
  actions,
  mode = 'buttons',
  onRefresh
}: ActionGroupProps<T>) {
  const { confirm } = useConfirmation();
  const { open } = useDialog();

  // 判断是否隐藏
  const isHidden = (action: Action<T>) => {
    if (typeof action.hidden === 'function') {
      return action.hidden(record as T);
    }
    return action.hidden;
  };

  // 判断是否禁用
  const isDisabled = (action: Action<T>) => {
    if (typeof action.disabled === 'function') {
      return action.disabled(record as T);
    }
    return action.disabled;
  };

  // 过滤可见操作
  const visibleActions = actions.filter((action) => !isHidden(action));

  // 核心执行引擎
  const handleAction = useCallback(
    async (action: Action<T>) => {
      const execute = async () => {
        try {
          // 处理弹窗逻辑
          if (action.dialog) {
            const dialogData = record || action.dialog.extraData
              ? { ...record, ...action.dialog.extraData }
              : undefined;

            open({
              title: action.dialog.title,
              description: action.dialog.description,
              component: action.dialog.component,
              data: dialogData,
              onClose: () => onRefresh?.()
            });
            return;
          }

          // 处理点击逻辑
          if (action.onClick) {
            const result = action.onClick(record as T);
            if (result instanceof Promise) {
              await result;
              toast.success(`${action.label}成功`);
              onRefresh?.();
            }
          }
        } catch (error) {
          console.error('Action execution failed:', error);
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

  // 渲染逻辑 - 按钮模式 (Header 用)
  if (mode === 'buttons') {
    return (
      <div className='flex items-center gap-3'>
        {visibleActions.map((action) => {
          const Icon = action.icon;
          return (
            <Button
              key={action.key}
              variant={action.variant || 'default'}
              onClick={() => handleAction(action)}
              disabled={isDisabled(action)}
              className={`gap-2 ${action.className || ''}`}
            >
              {Icon && <Icon className='h-4 w-4' />}
              {action.label}
            </Button>
          );
        })}
      </div>
    );
  }

  // 渲染逻辑 - 下拉模式 (Table 用)
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
          return (
            <DropdownMenuItem
              key={action.key}
              onClick={() => handleAction(action)}
              disabled={isDisabled(action)}
              className={`${action.className || ''} cursor-pointer py-2`}
            >
              {Icon && <Icon className='mr-2 h-4 w-4 flex-shrink-0' />}
              <span className='flex-1'>{action.label}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

