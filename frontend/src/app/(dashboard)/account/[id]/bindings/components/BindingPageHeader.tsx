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
  onAdd?: () => void;
  isPage?: boolean;
}

export function BindingPageHeader({ accountId, onSuccess, onAdd, isPage }: BindingPageHeaderProps) {
  const actions: Action[] = [
    {
      key: 'create',
      label: '新增绑定',
      icon: Plus,
      onClick: isPage ? undefined : () => onAdd?.(),
      dialog: isPage ? {
        title: '新增绑定',
        component: BindingAddForm,
        extraData: { id: accountId } as any,
        className: 'sm:max-w-[500px]'
      } : undefined
    }
  ];



  return <PageHeader actions={actions} onRefresh={onSuccess} />;
}

