/**
 * 绑定页面头部操作组件
 */

'use client';

import { Plus } from 'lucide-react';
import { PageActions } from '@/components/action/page-actions';
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
        extraData: { id: accountId } as any,
        className: 'sm:max-w-[500px]'
      }
    }
  ];

  return <PageActions actions={actions} onRefresh={onSuccess} />;
}
