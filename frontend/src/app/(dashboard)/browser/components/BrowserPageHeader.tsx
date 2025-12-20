/**
 * 浏览器管理页面头部
 */

'use client';

import { LayoutGrid, Square, HeartPulse } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useConfirmation } from '@/hooks/use-confirmation';
import { BrowserApiService } from '@/service/api/browser.api';
import { toast } from 'sonner';

interface BrowserPageHeaderProps {
  onRefresh: () => void;
}

export function BrowserPageHeader({ onRefresh }: BrowserPageHeaderProps) {
  const { confirm, ConfirmDialog } = useConfirmation();

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
        onRefresh();
      }
    });
  };

  const handleArrange = async () => {
    try {
      await BrowserApiService.arrange();
      toast.success('窗口已自动排列');
    } catch {
      toast.error('自愈检查失败');
    }
  };

  return (
    <div className='flex items-center justify-end space-x-2'>
      <Button variant='outline' onClick={handleHealthCheck}>
        <HeartPulse className='mr-2 h-4 w-4' />
        健康检查
      </Button>
      <Button variant='outline' onClick={handleArrange}>
        <LayoutGrid className='mr-2 h-4 w-4' />
        一键排列
      </Button>
      <Button variant='destructive' onClick={handleCloseAll}>
        <Square className='mr-2 h-4 w-4' />
        关闭全部
      </Button>
      <ConfirmDialog />
    </div>
  );
}
