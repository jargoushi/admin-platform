/**
 * 账号绑定管理页面
 */

'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { CurdLayout } from '@/components/shared/curd-layout';
import { AccountApiService } from '@/service/api/account.api';
import { BindingTable } from '../../components/bindings/BindingTable';
import { BindingPageHeader } from '../../components/bindings/BindingPageHeader';
import type { Binding } from '../../types';

export default function BindingPage() {
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
    <CurdLayout>
      <CurdLayout.Header>
        <BindingPageHeader
          accountId={accountId}
          onSuccess={fetchBindings}
          isPage={true}
        />
      </CurdLayout.Header>

      <CurdLayout.Table>
        <BindingTable
          data={bindings}
          loading={loading}
          onRefresh={fetchBindings}
          useDialog={true}
        />
      </CurdLayout.Table>
    </CurdLayout>
  );
}
