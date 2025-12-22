/**
 * 账号表单组件
 */

'use client';

import { useDialogForm } from '@/hooks/use-dialog-form';
import { DialogForm, FormFieldConfig } from '@/components/shared/dialog-form';
import { accountSchema, type AccountFormData } from '../account.schema';
import { AccountApiService } from '@/service/api/account.api';
import type { DialogComponentProps } from '@/contexts/dialog-provider';
import type { Account } from '../types';

// 字段配置
const FORM_FIELDS: FormFieldConfig<AccountFormData>[] = [
  { name: 'name', label: '账号名称', required: true },
  { name: 'platform_account', label: '平台账号' },
  { name: 'platform_password', label: '平台密码', type: 'password' },
  { name: 'description', label: '描述', type: 'textarea' }
];

export function AccountForm({ data, onClose }: DialogComponentProps<Account>) {
  const form = useDialogForm<AccountFormData, Account>({
    schema: accountSchema,
    data,
    onSubmit: async (formData, isEdit) => {
      if (isEdit && data) {
        await AccountApiService.update({ id: data.id, ...formData });
      } else {
        await AccountApiService.create(formData);
      }
    },
    onClose
  });

  return <DialogForm form={form} fields={FORM_FIELDS} />;
}
