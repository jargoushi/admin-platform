/**
 * 绑定页面头部
 */

'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDialog } from '@/contexts/dialog-provider';
import { BindingAddForm } from '@/app/(dashboard)/account/components/BindingAddForm';

interface BindingPageHeaderProps {
  accountId: number;
  onSuccess: () => void;
}

export function BindingPageHeader({ accountId, onSuccess }: BindingPageHeaderProps) {
  const dialog = useDialog();

  const handleAdd = () => {
    dialog.open({
      title: '新增绑定',
      component: BindingAddForm,
      data: { id: accountId } as any, // 模拟 Account 对象传给 BindingAddForm
      onClose: onSuccess
    });
  };

  return (
    <div className="flex flex-1 items-center justify-between">
      <h1 className="text-xl font-bold">绑定管理</h1>
      <Button onClick={handleAdd}>
        <Plus className="mr-2 h-4 w-4" />
        新增绑定
      </Button>
    </div>
  );
}
