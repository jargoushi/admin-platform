/**
 * 账号基本信息展示组件
 *
 * @description
 * 使用 InfoList 组件展示账号详细信息
 */

'use client';

import * as React from 'react';
import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoList, InfoSection } from '@/components/data/info-list';
import { useDialog } from '@/contexts/dialog-provider';
import { AccountForm } from '../../../components/AccountForm';
import type { Account } from '../../../types';

interface AccountInfoViewProps {
  account: Account;
  onRefresh: () => void;
}

export function AccountInfoView({ account, onRefresh }: AccountInfoViewProps) {
  const { open } = useDialog();

  const handleEdit = () => {
    open({
      title: '编辑账号',
      description: '修改账号信息',
      component: AccountForm,
      data: account,
      className: 'sm:max-w-[500px]',
      onClose: onRefresh
    });
  };

  const sections: InfoSection<Account>[] = [
    {
      title: '账号信息',
      items: [
        { key: 'id', label: 'ID' },
        { key: 'name', label: '账号名称' },
        { key: 'platform_account', label: '平台账号' },
        { key: 'description', label: '描述', span: 2 },
        { key: 'created_at', label: '创建时间' },
        { key: 'updated_at', label: '更新时间' }
      ]
    }
  ];

  return (
    <div className='space-y-6'>
      {/* 操作按钮 */}
      <div className='flex justify-end'>
        <Button onClick={handleEdit} className='gap-2'>
          <Pencil className='h-4 w-4' />
          编辑信息
        </Button>
      </div>

      {/* 信息展示 */}
      <InfoList data={account} sections={sections} />
    </div>
  );
}
