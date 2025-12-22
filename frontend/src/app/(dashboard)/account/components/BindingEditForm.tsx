/**
 * 编辑绑定表单
 */

'use client';

import { useEffect, useState, useMemo } from 'react';
import { Controller } from 'react-hook-form';
import { useDialogForm } from '@/hooks/use-dialog-form';
import { DialogFormFooter } from '@/components/shared/dialog-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { MultiSelect } from '@/components/ui/multi-select';
import { AccountApiService } from '@/service/api/account.api';
import { CommonApiService, type EnumItem } from '@/service/api/common.api';
import { bindingUpdateSchema, type BindingUpdateFormData } from '../account.schema';
import type { DialogComponentProps } from '@/contexts/dialog-provider';
import type { Binding } from '../types';

const DEFAULT_VALUES: BindingUpdateFormData = {
  id: 0,
  channel_codes: [],
  browser_id: ''
};

export function BindingEditForm({ data: binding, onClose }: DialogComponentProps<Binding>) {
  const [channels, setChannels] = useState<EnumItem[]>([]);

  useEffect(() => {
    CommonApiService.getChannels().then(setChannels);
  }, []);

  const channelOptions = useMemo(
    () => channels.map(c => ({ value: c.code, label: c.desc })),
    [channels]
  );

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

  const { form: rhfForm, isLoading, handleSubmit } = form;

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className='space-y-4'>
      <div className='space-y-2'>
        <Label>项目</Label>
        <div className='text-muted-foreground text-sm'>{binding?.project_name}</div>
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

      <DialogFormFooter isLoading={isLoading} onCancel={onClose} isEdit />
    </form>
  );
}
