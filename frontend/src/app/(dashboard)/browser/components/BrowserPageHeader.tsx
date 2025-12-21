/**
 * 浏览器管理页面头部组件
 *
 * @description
 * 负责页面标题和操作按钮
 * 采用组件自治原则，内部管理弹窗逻辑，通过回调通知父组件
 */

'use client';

import { LayoutGrid, Square, HeartPulse } from 'lucide-react';
import { PageHeader } from '@/components/table/page-header';
import { useConfirmation } from '@/contexts/confirmation-provider';
import { BrowserApiService } from '@/service/api/browser.api';
import { toast } from 'sonner';

interface BrowserPageHeaderProps {
  /** 操作成功后的回调(用于刷新列表) */
  onSuccess?: () => void;
}

export function BrowserPageHeader({ onSuccess }: BrowserPageHeaderProps) {
  const { confirm } = useConfirmation();

  const handleHealthCheck = async () => {
    try {
      await BrowserApiService.healthCheck();
      toast.success('比特浏览器 Local Server 连接正常');
    } catch {
      toast.error('无法连接到比特浏览器 Local Server');
    }
  };

  const handleCloseAll = () => {
    confirm({
      description: '确定要关闭所有运行中的浏览器窗口吗？',
      onConfirm: async () => {
        await BrowserApiService.closeAll();
        toast.success('已发送关闭所有窗口指令');
        onSuccess?.();
      }
    });
  };

  const handleArrange = async () => {
    try {
      await BrowserApiService.arrange();
      toast.success('窗口已自动排列');
    } catch {
      toast.error('排列窗口失败');
    }
  };

  return (
    <PageHeader
      actions={[
        {
          label: '健康检查',
          onClick: handleHealthCheck,
          icon: <HeartPulse className='mr-2 h-4 w-4' />,
          variant: 'outline'
        },
        {
          label: '一键排列',
          onClick: handleArrange,
          icon: <LayoutGrid className='mr-2 h-4 w-4' />,
          variant: 'outline'
        },
        {
          label: '关闭全部',
          onClick: handleCloseAll,
          icon: <Square className='mr-2 h-4 w-4' />,
          variant: 'destructive'
        }
      ]}
    />
  );
}
