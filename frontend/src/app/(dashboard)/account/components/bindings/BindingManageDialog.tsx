/**
 * 绑定管理弹窗
 */

'use client';

import * as React from 'react';
import { CurdLayout } from '@/components/shared/curd-layout';
import { AccountApiService } from '@/service/api/account.api';
import { BindingTable } from './BindingTable';
import { BindingPageHeader } from './BindingPageHeader';
import { BindingAddForm } from './BindingAddForm';
import { BindingEditForm } from './BindingEditForm';
import type { Binding } from '../../types';
import type { DialogComponentProps } from '@/contexts/dialog-provider';

export function BindingManageDialog({ data: account, onClose }: DialogComponentProps<{ id: number; name?: string }>) {
  const [bindings, setBindings] = React.useState<Binding[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [view, setView] = React.useState<'list' | 'add' | 'edit'>('list');
  const [editingRecord, setEditingRecord] = React.useState<Binding | null>(null);

  const fetchBindings = React.useCallback(async () => {
    if (!account?.id) return;
    setLoading(true);
    try {
      const data = await AccountApiService.getBindings(account.id);
      setBindings(data);
    } finally {
      setLoading(false);
    }
  }, [account?.id]);

  React.useEffect(() => {
    fetchBindings();
  }, [fetchBindings]);

  const handleAdd = () => setView('add');
  const handleEdit = (binding: Binding) => {
    setEditingRecord(binding);
    setView('edit');
  };
  const handleBack = () => {
    setView('list');
    setEditingRecord(null);
    fetchBindings();
  };

  if (!account?.id) return null;

  if (view === 'add') {
    return (
      <BindingAddForm
        data={account as any}
        onClose={handleBack}
      />
    );
  }

  if (view === 'edit' && editingRecord) {
    return (
      <BindingEditForm
        data={editingRecord}
        onClose={handleBack}
      />
    );
  }

  return (
    <CurdLayout headless>
      <CurdLayout.Header>
        <BindingPageHeader
          accountId={account.id}
          onSuccess={fetchBindings}
          onAdd={handleAdd}
        />
      </CurdLayout.Header>

      <CurdLayout.Table>
        <div className='h-[400px]'>
          <BindingTable
            data={bindings}
            loading={loading}
            onRefresh={fetchBindings}
            onEdit={handleEdit}
          />
        </div>
      </CurdLayout.Table>
    </CurdLayout>
  );
}


