/**
 * 账号表单组件 (优化版)
 */

'use client';

import { toast } from 'sonner';
import { DialogForm, FieldType, FormFieldConfig } from '@/components/shared/dialog-form';
import { accountSchema, type AccountFormData } from '../account.schema';
import { AccountApiService } from '@/service/api/account.api';
import type { DialogComponentProps } from '@/contexts/dialog-provider';
import type { Account } from '../types';

// ==================== 配置常量 ====================

const DEFAULT_VALUES: AccountFormData = {
  name: '',
  platform_account: '',
  platform_password: '',
  description: ''
};

const FORM_FIELDS: FormFieldConfig<AccountFormData>[] = [
  { name: 'name', type: FieldType.INPUT, label: '账号名称', required: true },
  { name: 'platform_account', type: FieldType.INPUT, label: '平台账号' },
  { name: 'platform_password', type: FieldType.PASSWORD, label: '平台密码' },
  { name: 'description', type: FieldType.TEXTAREA, label: '描述' }
];

// ==================== 组件 ====================

export function AccountForm({ data, onClose }: DialogComponentProps<Account>) {
  const isEdit = !!data;

  const handleSubmit = async (values: AccountFormData) => {
    if (isEdit && data) {
      await AccountApiService.update({ id: data.id, ...values });
    } else {
      await AccountApiService.create(values);
    }
    toast.success(isEdit ? '保存成功' : '创建成功');
  };

  return (
    <DialogForm<AccountFormData, Account>
      schema={accountSchema}
      data={data}
      onClose={onClose}
      defaultValues={DEFAULT_VALUES}
      onSubmit={handleSubmit}
      fields={FORM_FIELDS}
    />
  );
}
