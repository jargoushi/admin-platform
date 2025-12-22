/**
 * 激活码派发表单组件
 */

'use client';

import { useDialogForm } from '@/hooks/use-dialog-form';
import { DialogForm, FormFieldConfig } from '@/components/shared/dialog-form';
import {
  activationCodeDistributeSchema,
  type ActivationCodeDistributeFormData
} from '../activation.schema';
import { ACTIVATION_TYPE_ENUM, DISTRIBUTE_COUNT_RANGE } from '../constants';
import { ResultDialog, type ResultDialogData } from '@/components/shared/result-dialog';
import { ActivationApiService } from '@/service/api/activation.api';
import { useDialog, type DialogComponentProps } from '@/contexts/dialog-provider';

const FORM_FIELDS: FormFieldConfig<ActivationCodeDistributeFormData>[] = [
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
];

const DEFAULT_VALUES: ActivationCodeDistributeFormData = {
  type: 0,
  count: 1
};

export function ActivationCodeDistributeForm({ onClose }: DialogComponentProps) {
  const dialog = useDialog();

  const form = useDialogForm<ActivationCodeDistributeFormData>({
    schema: activationCodeDistributeSchema,
    defaultValues: DEFAULT_VALUES,
    onSubmit: async (formData) => {
      const result = await ActivationApiService.distribute(formData);

      if (result && result.length > 0) {
        dialog.open({
          title: '派发结果',
          component: ResultDialog,
          data: {
            message: `共派发 ${result.length} 个激活码。`,
            results: [{ title: '派发激活码列表', items: result }]
          },
          className: 'sm:max-w-[600px]'
        });
      }
    },
    onClose,
    successMessage: '派发成功'
  });

  return <DialogForm form={form} fields={FORM_FIELDS} />;
}
