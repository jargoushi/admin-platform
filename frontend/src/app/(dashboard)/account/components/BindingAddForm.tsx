/**
 * 新增绑定表单 (重构版)
 */

'use client';

import * as React from 'react';
import { DialogForm } from '@/components/shared/dialog-form';
import { AccountApiService } from '@/service/api/account.api';
import { CommonApiService } from '@/service/api/common.api';
import { bindingSchema, type BindingFormData } from '../account.schema';
import type { DialogComponentProps } from '@/contexts/dialog-provider';
import type { Account } from '../types';

export function BindingAddForm({ data: account, onClose }: DialogComponentProps<Account>) {
  return (
    <DialogForm<BindingFormData, Account>
      schema={bindingSchema}
      data={account}
      onClose={onClose}
      defaultValues={{
        project_code: 0,
        channel_codes: [],
        browser_id: ''
      }}
      onSubmit={async (values) => {
        if (!account) return;
        await AccountApiService.bind(account.id, {
          project_code: values.project_code,
          channel_codes: values.channel_codes,
          browser_id: values.browser_id || undefined
        });
      }}
      fields={[
        {
          name: 'project_code',
          label: '项目',
          type: 'select',
          required: true,
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
