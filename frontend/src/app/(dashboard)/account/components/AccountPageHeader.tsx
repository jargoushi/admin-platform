/**
 * 账号页面头部组件
 *
 * @description
 * 负责页面标题和操作按钮，同时管理新建弹窗
 * 采用组件自治原则，内部管理弹窗逻辑，通过回调通知父组件
 */

'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/table/page-header';
import { useGenericDialogs } from '@/hooks/use-generic-dialogs';
import { AccountCreateForm } from './AccountCreateForm';

interface AccountPageHeaderProps {
  /** 操作成功后的回调（用于刷新列表） */
  onSuccess?: () => void;
}

export function AccountPageHeader({ onSuccess }: AccountPageHeaderProps) {
  // 管理创建弹窗
  const { openDialog, DialogsContainer } = useGenericDialogs({
    dialogs: {
      create: {
        title: '新建账号',
        description: '创建一个新的账号',
        component: AccountCreateForm,
        className: 'sm:max-w-[500px]'
      }
    },
    onClose: () => onSuccess?.()
  });

  return (
    <>
      <PageHeader
        actions={[
          {
            label: '新建账号',
            onClick: () => openDialog('create'),
            icon: <Plus className='mr-2 h-4 w-4' />
          }
        ]}
      />

      {/* 弹窗容器 */}
      <DialogsContainer />
    </>
  );
}

