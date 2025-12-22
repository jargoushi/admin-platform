/**
 * 监控配置表单组件 (重构版)
 */

'use client';

import * as React from 'react';
import { DialogForm } from '@/components/shared/dialog-form';
import { monitorConfigSchema, type MonitorConfigFormData } from '../monitor.schema';
import { MonitorApiService } from '@/service/api/monitor.api';
import { CHANNEL_ENUM } from '../constants';
import type { DialogComponentProps } from '@/contexts/dialog-provider';
import type { MonitorConfig } from '../types';

export function MonitorConfigForm({
  data: config,
  onClose
}: DialogComponentProps<MonitorConfig>) {
  return (
    <DialogForm<MonitorConfigFormData, MonitorConfig>
      schema={monitorConfigSchema}
      data={config}
      onClose={onClose}
      defaultValues={{
        channel_code: 1,
        target_url: ''
      }}
      onSubmit={async (values, isEdit) => {
        if (isEdit && config) {
          await MonitorApiService.update(Number(config.id), values.target_url);
        } else {
          await MonitorApiService.create(values);
        }
      }}
      fields={[
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
          required: true
        }
      ]}
    />
  );
}
