/**
 * 用户页面头部组件
 *
 * @description
 * 负责页面标题
 */

'use client';

import { PageHeader } from '@/components/table/page-header';

/**
 * 用户页面头部组件
 */
interface UserPageHeaderProps {
  onSuccess?: () => void;
}

export function UserPageHeader({ onSuccess }: UserPageHeaderProps) {
  return <PageHeader />;
}
