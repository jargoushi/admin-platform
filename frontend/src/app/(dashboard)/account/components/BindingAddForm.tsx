/**
 * 新增绑定表单
 */

'use client';

import { useDialogForm } from '@/hooks/use-dialog-form';
import { DialogForm, type FormFieldConfig } from '@/components/shared/dialog-form';
import { AccountApiService } from '@/service/api/account.api';
import { CommonApiService } from '@/service/api/common.api';
import { bindingSchema, type BindingFormData } from '../account.schema';
import type { DialogComponentProps } from '@/contexts/dialog-provider';
import type { Account } from '../types';

const FORM_FIELDS: FormFieldConfig<BindingFormData>[] = [
  {
    name: 'project_code',
    label: '项目',
    type: 'select',
    required: true,
    options: [], // 初始为空，由 loadOptions 加载
    loadOptions: async () => {
      const projects = await CommonApiService.getProjects();
      return projects.map(p => ({ code: p.code, desc: p.desc }));
    }
  },
  {
    name: 'channel_codes',
    label: '渠道',
    type: 'multiselect',
    required: true,
    options: [],
    loadOptions: async () => {
      const channels = await CommonApiService.getChannels();
      return channels.map(c => ({ value: c.code, label: c.desc }));
    }
  },
  {
    name: 'browser_id',
    label: '浏览器 ID',
    placeholder: '可选'
  }
];

const DEFAULT_VALUES: BindingFormData = {
  project_code: 0,
  channel_codes: [],
  browser_id: ''
};

export function BindingAddForm({ data: account, onClose }: DialogComponentProps<Account>) {
  const form = useDialogForm<BindingFormData, Account>({
    schema: bindingSchema,
    defaultValues: DEFAULT_VALUES,
    data: account,
    onSubmit: async (formData) => {
      if (!account) return;
      await AccountApiService.bind(account.id, {
        project_code: formData.project_code,
        channel_codes: formData.channel_codes,
        browser_id: formData.browser_id || undefined
      });
    },
    onClose,
    successMessage: '绑定成功'
  });

  return <DialogForm form={form} fields={FORM_FIELDS} />;
}
