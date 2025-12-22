/**
 * 表格操作通用 Hook
 *
 * @description
 * 封装常用的表格操作模式：
 * 1. 确认操作 (Confirm -> API -> Refresh)
 * 2. 弹窗操作 (Open Dialog -> Form -> Refresh)
 */

'use client';

import { useCallback } from 'react';
import { useConfirmation } from '@/contexts/confirmation-provider';
import { useDialog } from '@/contexts/dialog-provider';
import { toast } from 'sonner';

interface UseTableActionsOptions {
  onRefresh?: () => void;
}

export function useTableActions(options: UseTableActionsOptions = {}) {
  const { onRefresh } = options;
  const { confirm } = useConfirmation();
  const { open } = useDialog();

  /**
   * 封装确认操作
   */
  const confirmAction = useCallback(
    async <T>(params: {
      title?: string;
      description: string;
      action: (record: T) => Promise<any>;
      record: T;
      successMsg?: string;
    }) => {
      const { title, description, action, record, successMsg = '操作成功' } = params;

      confirm({
        title,
        description,
        onConfirm: async () => {
          try {
            await action(record);
            toast.success(successMsg);
            onRefresh?.();
          } catch (error) {
            // 错误处理通常由全局拦截器完成，这里可以做额外逻辑
            console.error('Table action failed:', error);
          }
        }
      });
    },
    [confirm, onRefresh]
  );

  /**
   * 封装弹窗操作
   */
  const openDialog = useCallback(
    <T>(params: {
      title: string;
      description?: string;
      component: React.ComponentType<any>;
      data?: T;
      className?: string;
    }) => {
      const { title, description, component, data, className } = params;

      open({
        title,
        description,
        component,
        data,
        className,
        onClose: () => onRefresh?.()
      });
    },
    [open, onRefresh]
  );

  return {
    confirmAction,
    openDialog
  };
}
