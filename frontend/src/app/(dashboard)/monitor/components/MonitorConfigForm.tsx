/**
 * 监控配置表单组件
 */

'use client';

import { useDialogForm } from '@/hooks/use-dialog-form';
import { DialogForm, FormFieldConfig } from '@/components/shared/dialog-form';
import { monitorConfigSchema, type MonitorConfigFormData } from '../monitor.schema';
import { MonitorApiService } from '@/service/api/monitor.api';
import { CHANNEL_ENUM } from '../constants';
import type { DialogComponentProps } from '@/contexts/dialog-provider';
import type { MonitorConfig } from '../types';

const FORM_FIELDS: FormFieldConfig<MonitorConfigFormData>[] = [
  {
    name: 'channel_code',
    label: '渠道类型',
    type: 'select',
    options: CHANNEL_ENUM,
    required: true,
    editReadonly: true,
    editDisplayValue: (data: MonitorConfig) => data.channel_name
  },
  {
    name: 'target_url',
    label: '监控目标链接',
    required: true,
    help: '请输入完整的目标链接地址（最多512个字符）'
  }
];

const DEFAULT_VALUES: MonitorConfigFormData = {
  channel_code: 1,
  target_url: ''
};

export function MonitorConfigForm({
  data: config,
  onClose
}: DialogComponentProps<MonitorConfig>) {
  const form = useDialogForm<MonitorConfigFormData, MonitorConfig>({
    schema: monitorConfigSchema,
    defaultValues: DEFAULT_VALUES,
    data: config,
    onSubmit: async (formData, isEdit) => {
      if (isEdit && config) {
        await MonitorApiService.update(Number(config.id), formData.target_url);
      } else {
        await MonitorApiService.create(formData);
      }
    },
    onClose,
    successMessage: config ? '保存成功' : '创建成功',
    dataToForm: (c) => ({
      channel_code: c.channel_code,
      target_url: c.target_url
    })
  });

  return <DialogForm form={form} fields={FORM_FIELDS} editData={config} />;
}
