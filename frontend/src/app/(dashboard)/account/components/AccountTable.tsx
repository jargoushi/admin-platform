/**
 * 账号数据表格组件
 *
 * @description
 * 显示账号列表，支持编辑、删除、绑定管理操作
 * 组件内部管理对话框状态
 */

'use client';

import { useMemo, useCallback, useState } from 'react';
import { Pencil, Trash2, Link2 } from 'lucide-react';
import { toast } from 'sonner';
import { DataTable, type Column } from '@/components/table/data-table';
import {
  ActionDropdown,
  type ActionItem
} from '@/components/table/action-dropdown';
import { useConfirmation } from '@/hooks/use-confirmation';
import { AccountApiService } from '@/service/api/account.api';
import { AccountDialog } from './AccountDialogs';
import { BindingManageDialog } from './BindingManageDialog';
import type {
  Account,
  AccountCreateRequest,
  AccountUpdateRequest
} from '../types';

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
  // 编辑对话框状态
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentAccount, setCurrentAccount] = useState<Account | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // 绑定管理弹窗状态
  const [bindingDialogOpen, setBindingDialogOpen] = useState(false);
  const [bindingAccount, setBindingAccount] = useState<Account | null>(null);

  // 确认弹窗
  const { confirm, ConfirmDialog } = useConfirmation();

  /**
   * 处理编辑
   */
  const handleEdit = useCallback((account: Account) => {
    setCurrentAccount(account);
    setEditDialogOpen(true);
  }, []);

  /**
   * 处理绑定管理
   */
  const handleBinding = useCallback((account: Account) => {
    setBindingAccount(account);
    setBindingDialogOpen(true);
  }, []);

  /**
   * 处理删除
   */
  const handleDelete = useCallback(
    (account: Account) => {
      confirm({
        description: `确定要删除账号 "${account.name}" 吗？\n\n删除后将无法恢复！`,
        onConfirm: async () => {
          await AccountApiService.delete(account.id);
          toast.success('账号删除成功');
          onRefresh?.();
        }
      });
    },
    [confirm, onRefresh]
  );

  /**
   * 提交编辑
   */
  const handleSubmitEdit = useCallback(
    async (data: AccountCreateRequest) => {
      if (!currentAccount) return;
      setSubmitting(true);
      try {
        const updateData: AccountUpdateRequest = {
          id: currentAccount.id,
          ...data
        };
        await AccountApiService.update(updateData);
        toast.success('账号更新成功');
        setEditDialogOpen(false);
        onRefresh?.();
      } catch (error) {
        console.error('更新失败', error);
      } finally {
        setSubmitting(false);
      }
    },
    [currentAccount, onRefresh]
  );

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
        render: (value) => value || '-'
      },
      {
        key: 'description',
        title: '描述',
        className: 'min-w-[200px]',
        render: (value) => value || '-'
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
          const actions: ActionItem[] = [
            {
              key: 'binding',
              label: '绑定管理',
              icon: <Link2 className='mr-2 h-4 w-4' />,
              onClick: () => handleBinding(record)
            },
            {
              key: 'edit',
              label: '编辑',
              icon: <Pencil className='mr-2 h-4 w-4' />,
              onClick: () => handleEdit(record)
            },
            {
              key: 'delete',
              label: '删除',
              icon: <Trash2 className='mr-2 h-4 w-4' />,
              onClick: () => handleDelete(record),
              className: 'text-destructive'
            }
          ];
          return <ActionDropdown actions={actions} />;
        }
      }
    ],
    [handleBinding, handleEdit, handleDelete]
  );

  return (
    <>
      <DataTable columns={columns} data={data} loading={loading} rowKey='id' />

      {/* 编辑对话框 */}
      <AccountDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        account={currentAccount}
        onSubmit={handleSubmitEdit}
        loading={submitting}
      />

      {/* 绑定管理弹窗 */}
      <BindingManageDialog
        open={bindingDialogOpen}
        onOpenChange={setBindingDialogOpen}
        account={bindingAccount}
      />

      {/* 确认弹窗 */}
      <ConfirmDialog />
    </>
  );
}
