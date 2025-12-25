/**
 * 账号详情页 Tab 布局
 *
 * @description
 * 提供账号详情页的 Tab 导航布局
 * 顶部为 Tab 切换，底部为返回按钮
 */

'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { PageTabs, TabItem } from '@/components/layout/page-tabs';
import PageContainer from '@/components/layout/page-container';

// Tab 配置
const ACCOUNT_TABS: TabItem[] = [
  { key: 'info', label: '基本信息', path: 'info' },
  { key: 'bindings', label: '绑定管理', path: 'bindings' },
  { key: 'settings', label: '配置管理', path: 'settings' }
];

interface AccountDetailLayoutProps {
  children: React.ReactNode;
}

export default function AccountDetailLayout({ children }: AccountDetailLayoutProps) {
  const params = useParams();
  const router = useRouter();
  const accountId = Number(params.id);

  const basePath = `/account/${accountId}`;

  return (
    <PageContainer>
      <div className='flex h-[calc(100vh-8rem)] w-full flex-col'>
        {/* 顶部：Tab 导航 */}
        <PageTabs tabs={ACCOUNT_TABS} basePath={basePath} className='mb-4 shrink-0' />

        {/* 中间：子页面内容 */}
        <div className='min-h-0 flex-1 overflow-auto'>{children}</div>

        {/* 底部：返回按钮 */}
        <div className='shrink-0 flex justify-center py-6 border-t border-border/50 mt-4'>
          <Button
            variant='outline'
            onClick={() => router.push('/account')}
            className='min-w-[120px]'
          >
            返回
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}

