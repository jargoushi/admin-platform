/**
 * 账号详情页默认重定向
 *
 * @description
 * 访问 /account/[id] 时自动重定向到 /account/[id]/info
 */

import { redirect } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AccountDetailPage({ params }: PageProps) {
  const { id } = await params;
  redirect(`/account/${id}/info`);
}
