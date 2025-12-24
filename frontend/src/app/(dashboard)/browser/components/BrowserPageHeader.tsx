/**
 * 浏览器管理页面头部组件
 *
 * @description
 * 负责页面标题和操作按钮
 * 采用组件自治原则，内部管理弹窗逻辑，通过回调通知父组件
 */

'use client';

import { LayoutGrid, Square, HeartPulse } from 'lucide-react';
import { PageActions } from '@/components/action/page-actions';
import { BrowserApiService } from '@/service/api/browser.api';
import { Action } from '@/types/action';

interface BrowserPageHeaderProps {
  /** 操作成功后的回调(用于刷新列表) */
  onSuccess?: () => void;
}

export function BrowserPageHeader({ onSuccess }: BrowserPageHeaderProps) {
  const actions: Action[] = [
    {
      key: 'healthCheck',
      label: '健康检查',
      icon: HeartPulse,
      variant: 'outline',
      onClick: () => BrowserApiService.healthCheck()
    },
    {
      key: 'arrange',
      label: '一键排列',
      icon: LayoutGrid,
      variant: 'outline',
      onClick: () => BrowserApiService.arrange()
    },
    {
      key: 'closeAll',
      label: '关闭全部',
      icon: Square,
      variant: 'destructive',
      confirm: {
        description: '确定要关闭所有运行中的浏览器窗口吗？'
      },
      onClick: () => BrowserApiService.closeAll()
    }
  ];

  return <PageActions actions={actions} onRefresh={onSuccess} />;
}
