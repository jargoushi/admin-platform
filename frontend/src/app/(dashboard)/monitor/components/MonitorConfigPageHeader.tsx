/**
 * 监控配置页面头部组件
 *
 * @description
 * 负责页面标题和操作按钮,同时管理创建弹窗
 * 采用组件自治原则,内部管理弹窗逻辑,通过回调通知父组件
 */

'use client';

import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/table/page-header';
import { MonitorConfigCreateForm } from './MonitorConfigCreateForm';
import { Action } from '@/types/action';

interface MonitorConfigPageHeaderProps {
  /** 操作成功后的回调(用于刷新列表) */
  onSuccess?: () => void;
}

export function MonitorConfigPageHeader({
  onSuccess
}: MonitorConfigPageHeaderProps) {
  const actions: Action[] = [
    {
      key: 'create',
      label: '创建监控',
      icon: Plus,
      dialog: {
        title: '创建监控配置',
        description: '添加新的监控目标，系统将自动采集数据',
        component: MonitorConfigCreateForm
      }
    }
  ];

  return <PageHeader actions={actions} onRefresh={onSuccess} />;
}
