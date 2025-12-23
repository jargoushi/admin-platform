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
}

export function BindingPageHeader({ accountId, onSuccess, onAdd }: BindingPageHeaderProps) {
  const actions: Action[] = [
    {
      key: 'create',
      label: '新增绑定',
      icon: Plus,
      onClick: () => onAdd?.()
    }
  ];


  return <PageHeader actions={actions} onRefresh={onSuccess} />;
}

