import { Action } from '@/types/action';
import { ActionGroup } from '@/components/action/action-group';

interface TableRowActionsProps<T> {
  /** 当前行数据 */
  record: T;
  /** 操作项列表 */
  actions: Action<T>[];
  /** 刷新回调 */
  onRefresh?: () => void;
}

/**
 * 表格行操作下拉菜单
 * 用于在表格每行末尾显示操作菜单
 */
export function TableRowActions<T>({
  record,
  actions,
  onRefresh
}: TableRowActionsProps<T>) {
  return (
    <ActionGroup
      record={record}
      actions={actions}
      mode='dropdown'
      onRefresh={onRefresh}
    />
  );
}
