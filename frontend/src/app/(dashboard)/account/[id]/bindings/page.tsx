/**
 * 绑定管理页面
 */

'use client';

import { useParams } from 'next/navigation';
import { BindingManageContainer } from '../../components/BindingManageContainer';

export default function AccountBindingsPage() {
  const params = useParams();
  const accountId = Number(params.id);

  return <BindingManageContainer accountId={accountId} />;
}

