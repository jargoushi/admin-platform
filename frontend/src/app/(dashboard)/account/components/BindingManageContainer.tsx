/**
 * 绑定管理核心容器
 * 支持作为独立页面或弹窗使用
 */

'use client';

import * as React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CurdLayout } from '@/components/shared/curd-layout';
import { AccountApiService } from '@/service/api/account.api';
import { BindingTable } from '../[id]/bindings/components/BindingTable';
import { BindingPageHeader } from '../[id]/bindings/components/BindingPageHeader';
import type { Binding } from '../types';

interface BindingManageContainerProps {
  accountId: number;
  /** 是否为弹窗模式 */
  isDialog?: boolean;
}

export function BindingManageContainer({ accountId, isDialog = false }: BindingManageContainerProps) {
  const router = useRouter();
  const [bindings, setBindings] = React.useState<Binding[]>([]);
  const [loading, setLoading] = React.useState(true);

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
  }, [fetchBindings]);

  return (
    <CurdLayout headless={isDialog}>
      <CurdLayout.Header>
        <div className="flex items-center gap-4">
          {!isDialog && (
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <BindingPageHeader accountId={accountId} onSuccess={fetchBindings} />
        </div>
      </CurdLayout.Header>

      <CurdLayout.Table>
        <div className={isDialog ? 'h-[400px]' : ''}>
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
