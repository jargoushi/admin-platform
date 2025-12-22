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
import { DataTable, type Column } from '@/components/table/data-table';
import { ActionDropdown } from '@/components/table/action-dropdown';
import { Action } from '@/types/action';
import { AccountApiService } from '@/service/api/account.api';
import { AccountEditForm } from './AccountEditForm';
import { BindingManageDialog } from './BindingManageDialog';
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
  // 绑定管理弹窗状态（暂保留，因为 BindingManageDialog 较复杂，且需要 openChange 回调）
  const [bindingDialogOpen, setBindingDialogOpen] = useState(false);
  const [bindingAccount, setBindingAccount] = useState<Account | null>(null);

  /**
   * 处理绑定管理
   */
  const handleBinding = useCallback((account: Account) => {
    setBindingAccount(account);
    setBindingDialogOpen(true);
  }, []);

  /** 列配置 */
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
        render: (value: string | number | undefined) => (value as string) || '-'
      },
      {
        key: 'description',
        title: '描述',
        className: 'min-w-[200px]',
        render: (value: string | number | undefined) => (value as string) || '-'
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
          const actions: Action<Account>[] = [
            {
              key: 'binding',
              label: '绑定管理',
              icon: Link2,
              onClick: (r) => handleBinding(r)
            },
            {
              key: 'edit',
              label: '编辑',
              icon: Pencil,
              dialog: {
                title: '编辑账号',
                description: '修改账号信息',
                component: AccountEditForm,
                className: 'sm:max-w-[500px]'
              }
            },
            {
              key: 'delete',
              label: '删除',
              icon: Trash2,
              className: 'text-destructive',
              confirm: {
                description: (r) => `确定要删除账号 "${r.name}" 吗？\n\n删除后将无法恢复！`
              },
              onClick: (r) => AccountApiService.delete(r.id)
            }
          ];
          return <ActionDropdown record={record} actions={actions} onRefresh={onRefresh} />;
        }
      }
    ],
    [handleBinding, onRefresh]
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

