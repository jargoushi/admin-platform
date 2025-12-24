/**
 * 激活码派发表单组件 (优化版)
 */

'use client';

import { toast } from 'sonner';
import { DialogForm, FieldType, FormFieldConfig } from '@/components/form/dialog-form';
import { activationCodeDistributeSchema, type ActivationCodeDistributeFormData } from '../activation.schema';
import { ACTIVATION_TYPE_ENUM } from '../constants';
import { ResultDialog, type ResultDialogData } from '@/components/action/result-dialog';
import { ActivationApiService } from '@/service/api/activation.api';
import { useDialog, type DialogComponentProps } from '@/contexts/dialog-provider';

// ==================== 配置常量 ====================

const DEFAULT_VALUES: ActivationCodeDistributeFormData = {
  type: 0,
  count: 1
};

const FORM_FIELDS: FormFieldConfig<ActivationCodeDistributeFormData>[] = [
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
    label: '派发数量',
    required: true
  }
];

// ==================== 组件 ====================

export function ActivationCodeDistributeForm({ onClose }: DialogComponentProps) {
  const dialog = useDialog();

  const handleSubmit = async (values: ActivationCodeDistributeFormData) => {
    const result = await ActivationApiService.distribute(values);

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
  };

  return (
    <DialogForm<ActivationCodeDistributeFormData>
      schema={activationCodeDistributeSchema}
      onClose={onClose}
      defaultValues={DEFAULT_VALUES}
      onSubmit={handleSubmit}
      fields={FORM_FIELDS}
    />
  );
}
