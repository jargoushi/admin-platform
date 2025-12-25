/**
 * 账号绑定管理 Tab 页面
 */

'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { AccountApiService } from '@/service/api/account.api';
import { BindingTable } from './components/BindingTable';
import { BindingPageHeader } from './components/BindingPageHeader';
import type { Binding } from '../../types';

export default function BindingsPage() {
  const params = useParams();
  const accountId = Number(params.id);

  const [bindings, setBindings] = React.useState<Binding[]>([]);
  const [loading, setLoading] = React.useState(true);

  const fetchBindings = React.useCallback(async () => {
    if (!accountId) return;
    setLoading(true);
    try {
      const data = await AccountApiService.getBindings(accountId);
      setBindings(data);
    } finally {
      setLoading(false);
    }
  }, [accountId]);

  React.useEffect(() => {
    fetchBindings();
  }, [fetchBindings]);

  return (
    <div className='flex h-full flex-col space-y-4'>
      {/* 操作按钮 */}
      <div className='shrink-0'>
        <BindingPageHeader accountId={accountId} onSuccess={fetchBindings} />
      </div>

      {/* 绑定表格 */}
      <div className='min-h-0 flex-1'>
        <BindingTable
          data={bindings}
          loading={loading}
          onRefresh={fetchBindings}
          useDialog={true}
        />
      </div>
    </div>
  );
}

