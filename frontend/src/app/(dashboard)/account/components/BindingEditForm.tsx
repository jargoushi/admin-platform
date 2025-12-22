/**
 * 编辑绑定表单
 */

'use client';

import { useDialogForm } from '@/hooks/use-dialog-form';
import { DialogForm, type FormFieldConfig } from '@/components/shared/dialog-form';
import { AccountApiService } from '@/service/api/account.api';
import { CommonApiService } from '@/service/api/common.api';
import { bindingUpdateSchema, type BindingUpdateFormData } from '../account.schema';
import type { DialogComponentProps } from '@/contexts/dialog-provider';
import type { Binding } from '../types';

const FORM_FIELDS: FormFieldConfig<BindingUpdateFormData>[] = [
  {
    name: 'id',
    label: '项目',
    editReadonly: true,
    editDisplayValue: (data: Binding) => data.project_name
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

const DEFAULT_VALUES: BindingUpdateFormData = {
  id: 0,
  channel_codes: [],
  browser_id: ''
};

export function BindingEditForm({ data: binding, onClose }: DialogComponentProps<Binding>) {
  const form = useDialogForm<BindingUpdateFormData, Binding>({
    schema: bindingUpdateSchema,
    defaultValues: DEFAULT_VALUES,
    data: binding,
    onSubmit: async (formData) => {
      await AccountApiService.updateBinding({
        id: formData.id,
        channel_codes: formData.channel_codes,
        browser_id: formData.browser_id || undefined
      });
    },
    onClose,
    successMessage: '更新成功',
    dataToForm: (b) => ({
      id: b.id,
      channel_codes: b.channel_codes,
      browser_id: b.browser_id || ''
    })
  });

  return <DialogForm form={form} fields={FORM_FIELDS} />;
}
