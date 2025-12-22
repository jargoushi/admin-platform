/**
 * 激活码初始化表单（简化版：每次初始化单种类型）
 */

'use client';

import { useDialogForm } from '@/hooks/use-dialog-form';
import { DialogForm, FormFieldConfig } from '@/components/shared/dialog-form';
import { ResultDialog, type ResultDialogData } from '@/components/shared/result-dialog';
import { ActivationApiService } from '@/service/api/activation.api';
import { useDialog, type DialogComponentProps } from '@/contexts/dialog-provider';
import { activationCodeInitSchema, type ActivationCodeInitFormData } from '../activation.schema';
import { ACTIVATION_TYPE_ENUM } from '../constants';
import type { ActivationCodeTypeResult } from '../types';

const FORM_FIELDS: FormFieldConfig<ActivationCodeInitFormData>[] = [
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
];

const DEFAULT_VALUES: ActivationCodeInitFormData = {
  type: 0,
  count: 10
};

export function ActivationCodeInitForm({ onClose }: DialogComponentProps) {
  const dialog = useDialog();

  const form = useDialogForm<ActivationCodeInitFormData>({
    schema: activationCodeInitSchema,
    defaultValues: DEFAULT_VALUES,
    onSubmit: async (formData) => {
      // 包装成 items 数组调用后端 API
      const result = await ActivationApiService.init({ items: [formData] });

      if (result) {
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
    },
    onClose,
    successMessage: '初始化成功'
  });

  return <DialogForm form={form} fields={FORM_FIELDS} />;
}
