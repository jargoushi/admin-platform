'use client';

import React, { useState, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/table/page-header';
import { AccountApiService } from '@/service/api/account.api';
import { AccountDialog } from './AccountDialogs';
import type { AccountCreateRequest } from '../types';

interface AccountPageHeaderProps {
  /** 操作成功后的回调（用于刷新列表） */
  onSuccess?: () => void;
}

/**
 * 账号页面头部组件
 *
 * @description
 * 负责页面标题和操作按钮，同时管理新建弹窗
 * 采用组件自治原则，内部管理弹窗逻辑，通过回调通知父组件
 */
export function AccountPageHeader({ onSuccess }: AccountPageHeaderProps) {
  // 新建对话框状态
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  /**
   * 打开新建对话框
   */
  const handleAdd = useCallback(() => {
    setDialogOpen(true);
  }, []);

  /**
   * 提交创建
   */
  const handleCreate = useCallback(
    async (data: AccountCreateRequest) => {
      setSubmitting(true);
      try {
        await AccountApiService.create(data);
        toast.success('账号创建成功');
        setDialogOpen(false);
        onSuccess?.();
      } catch (error) {
        console.error('创建失败', error);
      } finally {
        setSubmitting(false);
      }
    },
    [onSuccess]
  );

  return (
    <>
      <PageHeader
        actions={[
          {
            label: '新建账号',
            onClick: handleAdd,
            icon: <Plus className='mr-2 h-4 w-4' />
          }
        ]}
      />

      {/* 新建对话框 */}
      <AccountDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        account={null}
        onSubmit={handleCreate}
        loading={submitting}
      />
    </>
  );
}
