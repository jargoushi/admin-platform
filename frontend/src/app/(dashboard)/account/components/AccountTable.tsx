/**
 * 账号数据表格组件
 *
 * @description
 * 显示账号列表，支持编辑、删除、绑定管理操作
 * 采用 useGenericDialogs 管理弹窗状态
 */

'use client';

import { useMemo, useCallback, useState } from 'react';
import { Pencil, Trash2, Link2 } from 'lucide-react';
import { useTableActions } from '@/hooks/use-table-actions';
import { DataTable, type Column } from '@/components/table/data-table';
import {
  ActionDropdown,
  type ActionItem
} from '@/components/table/action-dropdown';
import { AccountApiService } from '@/service/api/account.api';
import { AccountEditForm } from './AccountEditForm';
import { BindingManageDialog } from './BindingManageDialog';
import { toast } from 'sonner';
import type { Account } from '../types';

/**
 * 表格组件属性
 */
interface AccountTableProps {
  data: Account[];
  loading?: boolean;
  /** 操作成功后的回调(用于刷新列表) */
  onRefresh?: () => void;
}

export function AccountTable({
  data,
  loading = false,
  onRefresh
}: AccountTableProps) {
  // 绑定管理弹窗状态（暂保留，因为 BindingManageDialog 较复杂）
  const [bindingDialogOpen, setBindingDialogOpen] = useState(false);
  const [bindingAccount, setBindingAccount] = useState<Account | null>(null);

  const { openDialog } = useTableActions({ onRefresh });

  /**
   * 处理绑定管理
   */
  const handleBinding = useCallback((account: Account) => {
    setBindingAccount(account);
    setBindingDialogOpen(true);
  }, []);

  /** 列配置 */
  // ... (保持 columns 渲染逻辑不变)

  const columns = useMemo<Column<Account>[]>(
    () => [
      {
        key: 'id',
        title: 'ID',
        className: 'w-[80px]'
      },
      {
        key: 'name',
        title: '账号名称',
        className: 'min-w-[150px] font-medium'
      },
      {
        key: 'platform_account',
        title: '平台账号',
        className: 'min-w-[150px]',
        render: (value: unknown) => (value as string) || '-'
      },
      {
        key: 'description',
        title: '描述',
        className: 'min-w-[200px]',
        render: (value: unknown) => (value as string) || '-'
      },
      {
        key: 'created_at',
        title: '创建时间',
        className: 'w-[180px]'
      },
      {
        key: 'actions',
        title: '操作',
        className: 'w-[100px] text-center',
        render: (_: unknown, record: Account) => {
          const actions: ActionItem<Account>[] = [
            {
              key: 'binding',
              label: '绑定管理',
              icon: <Link2 className='h-4 w-4' />,
              onClick: (r) => handleBinding(r)
            },
            {
              key: 'edit',
              label: '编辑',
              icon: <Pencil className='h-4 w-4' />,
              onClick: (r) => openDialog({
                title: '编辑账号',
                description: '修改账号信息',
                component: AccountEditForm,
                data: r,
                className: 'sm:max-w-[500px]'
              })
            },
            {
              key: 'delete',
              label: '删除',
              icon: <Trash2 className='h-4 w-4' />,
              className: 'text-destructive',
              confirm: {
                description: (r) => `确定要删除账号 "${r.name}" 吗？\n\n删除后将无法恢复！`
              },
              onClick: async (r) => {
                await AccountApiService.delete(r.id);
                toast.success('账号删除成功');
                onRefresh?.();
              }
            }
          ];
          return <ActionDropdown record={record} actions={actions} />;
        }
      }
    ],
    [handleBinding, openDialog, onRefresh]
  );

  return (
    <>
      <DataTable columns={columns} data={data} loading={loading} rowKey='id' />

      {/* 绑定管理弹窗 */}
      <BindingManageDialog
        open={bindingDialogOpen}
        onOpenChange={setBindingDialogOpen}
        account={bindingAccount}
      />
    </>
  );
}

