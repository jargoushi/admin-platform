/**
 * 绑定管理弹窗
 */

'use client';

import * as React from 'react';
import { CurdLayout } from '@/components/shared/curd-layout';
import { AccountApiService } from '@/service/api/account.api';
import { BindingTable } from './BindingTable';
import { BindingPageHeader } from './BindingPageHeader';
import type { Binding } from '../../types';
import type { DialogComponentProps } from '@/contexts/dialog-provider';

export function BindingManageDialog({ data: account, onClose }: DialogComponentProps<{ id: number; name?: string }>) {
  const [bindings, setBindings] = React.useState<Binding[]>([]);
  const [loading, setLoading] = React.useState(true);

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

  if (!account?.id) return null;

  return (
    <CurdLayout headless>
      <CurdLayout.Header>
        <BindingPageHeader accountId={account.id} onSuccess={fetchBindings} />
      </CurdLayout.Header>

      <CurdLayout.Table>
        <div className='h-[400px]'>
          <BindingTable
            data={bindings}
            loading={loading}
            onRefresh={fetchBindings}
          />
        </div>
      </CurdLayout.Table>
    </CurdLayout>
  );
}

