/**
 * 激活码初始化表单 (重构版)
 */

'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { DialogForm } from '@/components/shared/dialog-form';
import { ResultDialog, type ResultDialogData } from '@/components/shared/result-dialog';
import { ActivationApiService } from '@/service/api/activation.api';
import { useDialog, type DialogComponentProps } from '@/contexts/dialog-provider';
import { activationCodeInitSchema, type ActivationCodeInitFormData } from '../activation.schema';
import { ACTIVATION_TYPE_ENUM } from '../constants';
import type { ActivationCodeTypeResult } from '../types';

export function ActivationCodeInitForm({ onClose }: DialogComponentProps) {
  const dialog = useDialog();

  return (
    <DialogForm<ActivationCodeInitFormData>
      schema={activationCodeInitSchema}
      onClose={onClose}
      defaultValues={{
        type: 0,
        count: 10
      }}
      onSubmit={async (values) => {
        const result = await ActivationApiService.init({ items: [values] });

        if (result) {
          toast.success('初始化成功');
          dialog.open({
            title: '初始化结果',
            component: ResultDialog,
            data: {
              message: `共初始化 ${result.total_count} 个激活码。`,
              results: result.results.map((r: ActivationCodeTypeResult) => ({
                title: `${r.type_name} (${r.count} 个)`,
                items: r.activation_codes
              }))
            } as ResultDialogData,
            className: 'sm:max-w-[600px]'
          });
        }
      }}
      fields={[
        {
          name: 'type',
          label: '激活码类型',
          type: 'select',
          options: ACTIVATION_TYPE_ENUM,
          required: true
        },
        {
          name: 'count',
          label: '生成数量',
          type: 'number',
          required: true
        }
      ]}
    />
  );
}
