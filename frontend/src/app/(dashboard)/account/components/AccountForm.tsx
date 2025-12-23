/**
 * 账号表单组件 (重构版)
 */

'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { DialogForm } from '@/components/shared/dialog-form';
import { accountSchema, type AccountFormData } from '../account.schema';
import { AccountApiService } from '@/service/api/account.api';
import type { DialogComponentProps } from '@/contexts/dialog-provider';
import type { Account } from '../types';

export function AccountForm({ data, onClose }: DialogComponentProps<Account>) {
  return (
    <DialogForm<AccountFormData, Account>
      schema={accountSchema}
      data={data}
      onClose={onClose}
      defaultValues={{
        name: '',
        platform_account: '',
        platform_password: '',
        description: ''
      }}
      onSubmit={async (values, isEdit) => {
        if (isEdit && data) {
          await AccountApiService.update({ id: data.id, ...values });
        } else {
          await AccountApiService.create(values);
        }
        toast.success(isEdit ? '保存成功' : '创建成功');
      }}
      fields={[
        { name: 'name', label: '账号名称', required: true },
        { name: 'platform_account', label: '平台账号' },
        { name: 'platform_password', label: '平台密码', type: 'password' },
        { name: 'description', label: '描述', type: 'textarea' }
      ]}
    />
  );
}
