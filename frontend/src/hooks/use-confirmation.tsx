import { ConfirmationDialog } from '@/components/shared/confirmation-dialog';
import { useState, useCallback } from 'react';

/**
 * 确认选项 - 极简设计
 */
interface ConfirmOptions {
  description: string;
  onConfirm: () => Promise<void> | void;
}

interface ConfirmState {
  isOpen: boolean;
  isLoading: boolean;
  description: string;
  onConfirm: () => Promise<void> | void;
}

export function useConfirmation() {
  const [state, setState] = useState<ConfirmState>({
    isOpen: false,
    isLoading: false,
    description: '',
    onConfirm: async () => {}
  });

  const confirm = useCallback((options: ConfirmOptions) => {
    setState({
      isOpen: true,
      isLoading: false,
      description: options.description,
      onConfirm: options.onConfirm
    });
  }, []);

  const close = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const handleConfirm = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      await state.onConfirm();
      close();
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      console.error('确认操作失败:', error);
    }
  }, [state, close]);

  const ConfirmDialog = useCallback(
    () => (
      <ConfirmationDialog
        isOpen={state.isOpen}
        isLoading={state.isLoading}
        description={state.description}
        onConfirm={handleConfirm}
        onCancel={close}
      />
    ),
    [state, handleConfirm, close]
  );

  return { confirm, ConfirmDialog };
}
