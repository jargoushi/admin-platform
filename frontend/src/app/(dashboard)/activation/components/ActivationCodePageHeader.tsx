'use client';

import { Plus, Send } from 'lucide-react';
import { PageHeader } from '@/components/table/page-header';
import { Action } from '@/types/action';
import { ActivationCodeInitForm } from './ActivationCodeInitForm';
import { ActivationCodeDistributeForm } from './ActivationCodeDistributeForm';

interface ActivationCodePageHeaderProps {
  /** 操作成功后的回调(用于刷新列表) */
  onSuccess?: () => void;
}

export function ActivationCodePageHeader({
  onSuccess
}: ActivationCodePageHeaderProps) {
  const actions: Action[] = [
    {
      key: 'distribute',
      label: '派发激活码',
      icon: Send,
      dialog: {
        title: '派发激活码',
        description: '根据类型派发指定数量的未使用激活码,派发后状态将变为"已分发"',
        component: ActivationCodeDistributeForm
      }
    },
    {
      key: 'init',
      label: '批量初始化',
      icon: Plus,
      dialog: {
        title: '批量初始化激活码',
        description: '批量生成不同类型的激活码,每种类型只能出现一次',
        component: ActivationCodeInitForm,
        className: 'max-w-2xl'
      }
    }
  ];

  return <PageHeader actions={actions} onRefresh={onSuccess} />;
}
