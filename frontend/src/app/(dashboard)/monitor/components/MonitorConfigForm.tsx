/**
 * 监控配置表单组件 (优化版)
 */

'use client';

import { toast } from 'sonner';
import { DialogForm, FieldType, FormFieldConfig } from '@/components/form/dialog-form';
import { monitorConfigSchema, type MonitorConfigFormData } from '../monitor.schema';
import { MonitorApiService } from '@/service/api/monitor.api';
import { CHANNEL_ENUM } from '../constants';
import type { DialogComponentProps } from '@/contexts/dialog-provider';
import type { MonitorConfig } from '../types';

// ==================== 配置常量 ====================

const DEFAULT_VALUES: MonitorConfigFormData = {
  channel_code: 1,
  target_url: ''
};

const FORM_FIELDS: FormFieldConfig<MonitorConfigFormData>[] = [
  {
    name: 'channel_code',
    type: FieldType.SELECT,
    label: '渠道类型',
    options: CHANNEL_ENUM,
    required: true,
    editReadonly: true,
    editDisplayValue: (data: MonitorConfig) => data.channel_name
  },
  {
    name: 'target_url',
    type: FieldType.INPUT,
    label: '监控目标链接',
    required: true
  }
];

// ==================== 组件 ====================

export function MonitorConfigForm({ data: config, onClose }: DialogComponentProps<MonitorConfig>) {
  const isEdit = !!config;

  const handleSubmit = async (values: MonitorConfigFormData) => {
    if (isEdit && config) {
      await MonitorApiService.update(Number(config.id), values.target_url);
    } else {
      await MonitorApiService.create(values);
    }
    toast.success(isEdit ? '保存成功' : '创建成功');
  };

  return (
    <DialogForm<MonitorConfigFormData, MonitorConfig>
      schema={monitorConfigSchema}
      data={config}
      onClose={onClose}
      defaultValues={DEFAULT_VALUES}
      onSubmit={handleSubmit}
      fields={FORM_FIELDS}
    />
  );
}
