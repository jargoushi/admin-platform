/**
 * 账号基本信息 Tab 页面
 */

'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { AccountApiService } from '@/service/api/account.api';
import { AccountInfoView } from './components/AccountInfoView';
import type { Account } from '../../types';

export default function AccountInfoPage() {
  const params = useParams();
  const accountId = Number(params.id);

  const [account, setAccount] = React.useState<Account | null>(null);
  const [loading, setLoading] = React.useState(true);

  const fetchAccount = React.useCallback(async () => {
    if (!accountId) return;
    setLoading(true);
    try {
      // 通过分页接口获取单条数据
      const res = await AccountApiService.getPageList({ page: 1, size: 100 });
      const found = res.items.find((item) => item.id === accountId);
      if (found) setAccount(found);
    } finally {
      setLoading(false);
    }
  }, [accountId]);

  React.useEffect(() => {
    fetchAccount();
  }, [fetchAccount]);

  if (loading) {
    return (
      <div className='flex min-h-[300px] items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
      </div>
    );
  }

  if (!account) {
    return (
      <div className='flex min-h-[300px] items-center justify-center text-muted-foreground'>
        账号不存在
      </div>
    );
  }

  return <AccountInfoView account={account} onRefresh={fetchAccount} />;
}
