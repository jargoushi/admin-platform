/**
 * 绑定管理页面
 */

'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CurdLayout } from '@/components/shared/curd-layout';
import { AccountApiService } from '@/service/api/account.api';
import { BindingTable } from './components/BindingTable';
import { BindingPageHeader } from './components/BindingPageHeader';
import type { Binding } from '@/app/(dashboard)/account/types';

export default function AccountBindingsPage() {
  const params = useParams();
  const router = useRouter();
  const accountId = Number(params.id);

  const [bindings, setBindings] = React.useState<Binding[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [accountName, setAccountName] = React.useState('');

  const fetchBindings = React.useCallback(async () => {
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
    // 简单获取账号名称（如果 API 支持，或者从列表传过来）
    // 这里暂时先只加载绑定列表
  }, [fetchBindings]);

  return (
    <CurdLayout>
      <CurdLayout.Header>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <BindingPageHeader accountId={accountId} onSuccess={fetchBindings} />
        </div>
      </CurdLayout.Header>

      <CurdLayout.Table>
        <BindingTable
          data={bindings}
          loading={loading}
          onRefresh={fetchBindings}
        />
      </CurdLayout.Table>
    </CurdLayout>
  );
}
