/**
 * 激活码派发表单组件 (重构版)
 */

'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { DialogForm } from '@/components/shared/dialog-form';
import {
  activationCodeDistributeSchema,
  type ActivationCodeDistributeFormData
} from '../activation.schema';
import { ACTIVATION_TYPE_ENUM } from '../constants';
import { ResultDialog, type ResultDialogData } from '@/components/shared/result-dialog';
import { ActivationApiService } from '@/service/api/activation.api';
import { useDialog, type DialogComponentProps } from '@/contexts/dialog-provider';

export function ActivationCodeDistributeForm({ onClose }: DialogComponentProps) {
  const dialog = useDialog();

  return (
    <DialogForm<ActivationCodeDistributeFormData>
      schema={activationCodeDistributeSchema}
      onClose={onClose}
      defaultValues={{
        type: 0,
        count: 1
      }}
      onSubmit={async (formData) => {
        const result = await ActivationApiService.distribute(formData);

        if (result && result.length > 0) {
          toast.success('派发成功');
          dialog.open({
            title: '派发结果',
            component: ResultDialog,
            data: {
              message: `共派发 ${result.length} 个激活码。`,
              results: [{ title: '派发激活码列表', items: result }]
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
          label: '派发数量',
          type: 'number',
          required: true
        }
      ]}
    />
  );
}
