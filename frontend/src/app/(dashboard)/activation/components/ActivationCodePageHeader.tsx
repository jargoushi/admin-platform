'use client';

import React from 'react';
import { Plus, Send } from 'lucide-react';
import { PageHeader } from '@/components/table/page-header';

// 引入弹窗基础设施
import { useGenericDialogs } from '@/hooks/use-generic-dialogs';
import { ActivationCodeInitForm } from './ActivationCodeInitForm';
import { ActivationCodeDistributeForm } from './ActivationCodeDistributeForm';

interface ActivationCodePageHeaderProps {
  /** 操作成功后的回调(用于刷新列表) */
  onSuccess?: () => void;
}

/**
 * 激活码页面头部组件
 *
 * @description
 * 负责页面标题和操作按钮,同时管理初始化和派发弹窗
 * 采用组件自治原则,内部管理弹窗逻辑,通过回调通知父组件
 */
export function ActivationCodePageHeader({
  onSuccess
}: ActivationCodePageHeaderProps) {
  // 管理初始化和派发弹窗
  const { openDialog, DialogsContainer } = useGenericDialogs({
    dialogs: {
      init: {
        title: '批量初始化激活码',
        description: '批量生成不同类型的激活码,每种类型只能出现一次',
        component: ActivationCodeInitForm,
        className: 'max-w-2xl'
      },
      distribute: {
        title: '派发激活码',
        description:
          '根据类型派发指定数量的未使用激活码,派发后状态将变为"已分发"',
        component: ActivationCodeDistributeForm
      }
    },
    onClose: () => onSuccess?.()
  });

  return (
    <>
      <PageHeader
        actions={[
          {
            label: '派发激活码',
            onClick: () => openDialog('distribute'),
            icon: <Send className='mr-2 h-4 w-4' />
          },
          {
            label: '批量初始化',
            onClick: () => openDialog('init'),
            icon: <Plus className='mr-2 h-4 w-4' />
          }
        ]}
      />

      {/* 弹窗容器 */}
      <DialogsContainer />
    </>
  );
}
