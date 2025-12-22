/**
 * 编辑绑定表单 (重构版)
 */

'use client';

import * as React from 'react';
import { DialogForm } from '@/components/shared/dialog-form';
import { AccountApiService } from '@/service/api/account.api';
import { CommonApiService } from '@/service/api/common.api';
import { bindingUpdateSchema, type BindingUpdateFormData } from '../account.schema';
import type { DialogComponentProps } from '@/contexts/dialog-provider';
import type { Binding } from '../types';

export function BindingEditForm({ data: binding, onClose }: DialogComponentProps<Binding>) {
  return (
    <DialogForm<BindingUpdateFormData, Binding>
      schema={bindingUpdateSchema}
      data={binding}
      onClose={onClose}
      defaultValues={{
        id: 0,
        channel_codes: [],
        browser_id: ''
      }}
      onSubmit={async (values) => {
        await AccountApiService.updateBinding({
          id: values.id,
          channel_codes: values.channel_codes,
          browser_id: values.browser_id || undefined
        });
      }}
      fields={[
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
      ]}
    />
  );
}
