/**
 * 激活码初始化表单 (优化版)
 */

'use client';

import { toast } from 'sonner';
import { DialogForm, FieldType, FormFieldConfig } from '@/components/form/dialog-form';
import { ResultDialog, type ResultDialogData } from '@/components/action/result-dialog';
import { ActivationApiService } from '@/service/api/activation.api';
import { useDialog, type DialogComponentProps } from '@/contexts/dialog-provider';
import { activationCodeInitSchema, type ActivationCodeInitFormData } from '../activation.schema';
import { ACTIVATION_TYPE_ENUM } from '../constants';
import type { ActivationCodeTypeResult } from '../types';

// ==================== 配置常量 ====================

const DEFAULT_VALUES: ActivationCodeInitFormData = {
  type: 0,
  count: 10
};

const FORM_FIELDS: FormFieldConfig<ActivationCodeInitFormData>[] = [
  {
    name: 'type',
    type: FieldType.SELECT,
    label: '激活码类型',
    options: ACTIVATION_TYPE_ENUM,
    required: true
  },
  {
    name: 'count',
    type: FieldType.NUMBER,
    label: '生成数量',
    required: true
  }
];

// ==================== 组件 ====================

export function ActivationCodeInitForm({ onClose }: DialogComponentProps) {
  const dialog = useDialog();

  const handleSubmit = async (values: ActivationCodeInitFormData) => {
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
  };

  return (
    <DialogForm<ActivationCodeInitFormData>
      schema={activationCodeInitSchema}
      onClose={onClose}
      defaultValues={DEFAULT_VALUES}
      onSubmit={handleSubmit}
      fields={FORM_FIELDS}
    />
  );
}
