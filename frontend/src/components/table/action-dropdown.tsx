import { Action } from '@/types/action';
import { ActionGroup } from '@/components/shared/action-group';

interface ActionDropdownProps<T> {
  /** 当前行数据 */
  record: T;
  /** 操作项列表 */
  actions: Action<T>[];
  /** 刷新回调 */
  onRefresh?: () => void;
  /** 触发按钮类名 */
  triggerClassName?: string;
}

export function ActionDropdown<T>({
  record,
  actions,
  onRefresh,
  triggerClassName = 'h-8 w-8 p-0 cursor-pointer'
}: ActionDropdownProps<T>) {
  return (
    <ActionGroup
      record={record}
      actions={actions}
      mode='dropdown'
      onRefresh={onRefresh}
      className={triggerClassName}
    />
  );
}
