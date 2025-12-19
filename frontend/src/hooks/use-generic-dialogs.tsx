import { useState, useCallback } from 'react';
import {
  GenericDialogs,
  type DialogConfig,
  type GenericDialogState
} from '@/components/shared/generic-dialogs';

/**
 * Hook 配置选项
 */
export interface UseGenericDialogsOptions {
  dialogs: Record<string, DialogConfig>;
  onClose?: () => void;
}

/**
 * 通用对话框管理 Hook
 *
 * @description
 * 采用 Hook + 组件一体化设计，参考 useConfirmation 模式
 * 隐藏内部状态，只暴露 openDialog 和 DialogsContainer
 *
 * @example
 * const { openDialog, DialogsContainer } = useGenericDialogs({
 *   configs: DIALOG_CONFIGS,
 *   propsMap: { init: { onSubmit: handleSubmit } },
 *   onCloseCallback: refreshList
 * });
 *
 * @returns { openDialog, DialogsContainer }
 */
export function useGenericDialogs<T = unknown>(
  options: UseGenericDialogsOptions
) {
  const { dialogs, onClose: onCloseCallback } = options;

  const [dialogState, setDialogState] = useState<GenericDialogState<T>>({
    type: null,
    data: null,
    open: false
  });

  /**
   * 打开指定类型的对话框，可传入初始数据
   * @param type - 对话框类型标识符
   * @param data - 传递给对话框的数据
   */
  const openDialog = useCallback((type: string, data: T | null = null) => {
    setDialogState({ type, data, open: true });
  }, []);

  /**
   * 关闭当前对话框
   */
  const closeDialog = useCallback(() => {
    setDialogState({ type: null, data: null, open: false });
    onCloseCallback?.();
  }, [onCloseCallback]);

  /**
   * 渲染容器组件
   */
  const DialogsContainer = useCallback(
    () => (
      <GenericDialogs
        dialogState={dialogState}
        onClose={closeDialog}
        dialogs={dialogs}
      />
    ),
    [dialogState, closeDialog, dialogs]
  );

  return {
    openDialog,
    DialogsContainer
  };
}
