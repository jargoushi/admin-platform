/**
 * 监控配置页面头部组件
 *
 * @description
 * 负责页面标题和操作按钮,同时管理创建弹窗
 * 采用组件自治原则,内部管理弹窗逻辑,通过回调通知父组件
 */

'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/table/page-header';

// 引入弹窗基础设施
import { useDialog } from '@/contexts/dialog-provider';
import { MonitorConfigCreateForm } from './MonitorConfigCreateForm';

interface MonitorConfigPageHeaderProps {
  /** 操作成功后的回调(用于刷新列表) */
  onSuccess?: () => void;
}

export function MonitorConfigPageHeader({
  onSuccess
}: MonitorConfigPageHeaderProps) {
  const { open } = useDialog();

  const handleCreate = () => {
    open({
      title: '创建监控配置',
      description: '添加新的监控目标，系统将自动采集数据',
      component: MonitorConfigCreateForm,
      onClose: () => onSuccess?.()
    });
  };

  return (
    <PageHeader
      actions={[
        {
          label: '创建监控',
          onClick: handleCreate,
          icon: <Plus className='mr-2 h-4 w-4' />
        }
      ]}
    />
  );
}
