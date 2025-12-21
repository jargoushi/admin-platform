/**
 * 用户页面头部组件
 *
 * @description
 * 负责页面标题和操作按钮
 * 采用组件自治原则，内部管理弹窗逻辑，通过回调通知父组件
 */

'use client';

import { PageHeader } from '@/components/table/page-header';

interface UserPageHeaderProps {
  /** 操作成功后的回调(用于刷新列表) */
  onSuccess?: () => void;
}

/**
 * 用户页面头部组件
 */
export function UserPageHeader({ onSuccess }: UserPageHeaderProps) {
  // 用户模块暂无操作按钮，预留 onSuccess 以便后续扩展
  void onSuccess;
  return <PageHeader />;
}

