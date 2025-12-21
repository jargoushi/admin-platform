'use client';

import { Plus, Send } from 'lucide-react';
import { PageHeader } from '@/components/table/page-header';

// 引入弹窗基础设施
import { useDialog } from '@/contexts/dialog-provider';
import { ActivationCodeInitForm } from './ActivationCodeInitForm';
import { ActivationCodeDistributeForm } from './ActivationCodeDistributeForm';

interface ActivationCodePageHeaderProps {
  /** 操作成功后的回调(用于刷新列表) */
  onSuccess?: () => void;
}

export function ActivationCodePageHeader({
  onSuccess
}: ActivationCodePageHeaderProps) {
  const { open } = useDialog();

  const handleInit = () => {
    open({
      title: '批量初始化激活码',
      description: '批量生成不同类型的激活码,每种类型只能出现一次',
      component: ActivationCodeInitForm,
      className: 'max-w-2xl',
      onClose: () => onSuccess?.()
    });
  };

  const handleDistribute = () => {
    open({
      title: '派发激活码',
      description: '根据类型派发指定数量的未使用激活码,派发后状态将变为"已分发"',
      component: ActivationCodeDistributeForm,
      onClose: () => onSuccess?.()
    });
  };

  return (
    <PageHeader
      actions={[
        {
          label: '派发激活码',
          onClick: handleDistribute,
          icon: <Send className='mr-2 h-4 w-4' />
        },
        {
          label: '批量初始化',
          onClick: handleInit,
          icon: <Plus className='mr-2 h-4 w-4' />
        }
      ]}
    />
  );
}
