'use client';

import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useConfirmation } from '@/contexts/confirmation-provider';

export interface ActionItem<T = any> {
  key: string;
  label: string;
  icon?: React.ReactNode;
  onClick: (record: T) => void | Promise<void>;
  /** 声明式隐藏逻辑 */
  hidden?: boolean | ((record: T) => boolean);
  /** 声明式禁用逻辑 */
  disabled?: boolean | ((record: T) => boolean);
  /** 自动确认配置 */
  confirm?: {
    title?: string;
    description: string | ((record: T) => string);
  };
  className?: string;
}

interface ActionDropdownProps<T> {
  /** 当前行数据 */
  record: T;
  /** 操作项列表 */
  actions: ActionItem<T>[];
  /** 触发按钮类名 */
  triggerClassName?: string;
}

export function ActionDropdown<T>({
  record,
  actions,
  triggerClassName = 'h-8 w-8 p-0 cursor-pointer'
}: ActionDropdownProps<T>) {
  const { confirm } = useConfirmation();

  // 过滤掉隐藏的项
  const visibleActions = actions.filter((action) => {
    if (typeof action.hidden === 'function') {
      return !action.hidden(record);
    }
    return !action.hidden;
  });

  if (visibleActions.length === 0) return null;

  const handleActionClick = (action: ActionItem<T>) => {
    // 如果配置了确认逻辑
    if (action.confirm) {
      const description =
        typeof action.confirm.description === 'function'
          ? action.confirm.description(record)
          : action.confirm.description;

      confirm({
        title: action.confirm.title || '确认操作',
        description,
        onConfirm: () => action.onClick(record)
      });
    } else {
      action.onClick(record);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className={triggerClassName}>
          <MoreHorizontal className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        {visibleActions.map((action) => {
          const isDisabled =
            typeof action.disabled === 'function'
              ? action.disabled(record)
              : action.disabled;

          return (
            <DropdownMenuItem
              key={action.key}
              onClick={() => handleActionClick(action)}
              className={`${action.className || ''} cursor-pointer`}
              disabled={isDisabled}
            >
              {action.icon && <span className='mr-2'>{action.icon}</span>}
              {action.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
