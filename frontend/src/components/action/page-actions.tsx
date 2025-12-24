import { Action } from '@/types/action';
import { ActionGroup } from '@/components/action/action-group';

interface PageActionsProps {
  /** 操作按钮列表 */
  actions?: Action[];
  /** 刷新回调 */
  onRefresh?: () => void;
}

/**
 * 页面头部操作按钮组
 * 支持传入多个操作按钮，自动处理确认、弹窗和异步逻辑
 */
export function PageActions({ actions = [], onRefresh }: PageActionsProps) {
  if (actions.length === 0) {
    return null;
  }

  return (
    <div className='flex items-center justify-end gap-3'>
      <ActionGroup actions={actions} mode='buttons' onRefresh={onRefresh} />
    </div>
  );
}
