/**
 * 新增绑定表单
 */

'use client';

import { useEffect, useState, useMemo } from 'react';
import { Controller } from 'react-hook-form';
import { useDialogForm } from '@/hooks/use-dialog-form';
import { DialogFormFooter } from '@/components/shared/dialog-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { MultiSelect } from '@/components/ui/multi-select';
import { AccountApiService } from '@/service/api/account.api';
import { CommonApiService, type EnumItem } from '@/service/api/common.api';
import { bindingSchema, type BindingFormData } from '../account.schema';
import type { DialogComponentProps } from '@/contexts/dialog-provider';
import type { Account } from '../types';

const DEFAULT_VALUES: BindingFormData = {
  project_code: 0,
  channel_codes: [],
  browser_id: ''
};

export function BindingAddForm({ data: account, onClose }: DialogComponentProps<Account>) {
  const [projects, setProjects] = useState<EnumItem[]>([]);
  const [channels, setChannels] = useState<EnumItem[]>([]);

  useEffect(() => {
    Promise.all([CommonApiService.getProjects(), CommonApiService.getChannels()])
      .then(([p, c]) => { setProjects(p); setChannels(c); });
  }, []);

  const channelOptions = useMemo(
    () => channels.map(c => ({ value: c.code, label: c.desc })),
    [channels]
  );

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

  const { form: rhfForm, isLoading, handleSubmit } = form;

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className='space-y-4'>
      <div className='space-y-2'>
        <Label>项目 <span className='text-destructive'>*</span></Label>
        <Controller
          name='project_code'
          control={rhfForm.control}
          render={({ field }) => (
            <Select
              value={field.value ? String(field.value) : ''}
              onValueChange={v => field.onChange(Number(v))}
              disabled={isLoading}
            >
              <SelectTrigger><SelectValue placeholder='选择项目' /></SelectTrigger>
              <SelectContent>
                {projects.map(p => (
                  <SelectItem key={p.code} value={String(p.code)}>{p.desc}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className='space-y-2'>
        <Label>渠道 <span className='text-destructive'>*</span></Label>
        <Controller
          name='channel_codes'
          control={rhfForm.control}
          render={({ field }) => (
            <MultiSelect
              options={channelOptions}
              value={field.value}
              onChange={field.onChange}
              placeholder='选择渠道'
            />
          )}
        />
        {rhfForm.formState.errors.channel_codes && (
          <p className='text-destructive text-xs'>{rhfForm.formState.errors.channel_codes.message}</p>
        )}
      </div>

      <div className='space-y-2'>
        <Label>浏览器 ID</Label>
        <Input placeholder='可选' {...rhfForm.register('browser_id')} disabled={isLoading} />
      </div>

      <DialogFormFooter isLoading={isLoading} onCancel={onClose} />
    </form>
  );
}
