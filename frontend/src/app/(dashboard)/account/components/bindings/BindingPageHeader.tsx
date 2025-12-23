/**
 * 绑定页面头部
 */

'use client';

import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/table/page-header';
import { BindingAddForm } from './BindingAddForm';
import { Action } from '@/types/action';

interface BindingPageHeaderProps {
  accountId: number;
  onSuccess: () => void;
}

export function BindingPageHeader({ accountId, onSuccess }: BindingPageHeaderProps) {
  const actions: Action[] = [
    {
      key: 'create',
      label: '新增绑定',
      icon: Plus,
      dialog: {
        title: '新增绑定',
        component: BindingAddForm,
        extraData: { id: accountId } as any, // 模拟 Account 对象传给 BindingAddForm
        className: 'sm:max-w-[500px]'
      }
    }
  ];

  return <PageHeader actions={actions} onRefresh={onSuccess} />;
}

