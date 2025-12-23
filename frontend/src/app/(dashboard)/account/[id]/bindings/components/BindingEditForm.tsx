/**
 * 编辑绑定表单 (优化版)
 */

'use client';

import { toast } from 'sonner';
import { DialogForm, FieldType, FormFieldConfig } from '@/components/shared/dialog-form';
import { AccountApiService } from '@/service/api/account.api';
import { CommonApiService } from '@/service/api/common.api';
import { bindingUpdateSchema, type BindingUpdateFormData } from '../../../account.schema';
import { useEnumOptions } from '@/hooks/use-enum-options';
import type { DialogComponentProps } from '@/contexts/dialog-provider';
import type { Binding } from '../../../types';

// ==================== 配置常量 ====================

const DEFAULT_VALUES: BindingUpdateFormData = {
  id: 0,
  channel_codes: [],
  browser_id: ''
};

// ==================== 组件 ====================

export function BindingEditForm({ data: binding, onClose }: DialogComponentProps<Binding>) {
  const channelEnum = useEnumOptions(CommonApiService.getChannels);

  if (!channelEnum) {
    return <div className="py-8 text-center text-muted-foreground">加载中...</div>;
  }

  const handleSubmit = async (values: BindingUpdateFormData) => {
    await AccountApiService.updateBinding({
      id: values.id,
      channel_codes: values.channel_codes,
      browser_id: values.browser_id || undefined
    });
    toast.success('更新成功');
  };

  const FORM_FIELDS: FormFieldConfig<BindingUpdateFormData>[] = [
    { name: 'id', type: FieldType.INPUT, label: '项目', editReadonly: true, editDisplayValue: (data: Binding) => data.project_name },
    { name: 'channel_codes', type: FieldType.MULTISELECT, label: '渠道', required: true, options: channelEnum },
    { name: 'browser_id', type: FieldType.INPUT, label: '浏览器 ID', placeholder: '可选' }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 border-b pb-4">
        <h2 className="text-lg font-semibold">编辑项目绑定</h2>
      </div>
      <DialogForm<BindingUpdateFormData, Binding>
        schema={bindingUpdateSchema}
        data={binding}
        onClose={onClose}
        defaultValues={DEFAULT_VALUES}
        onSubmit={handleSubmit}
        fields={FORM_FIELDS}
      />
    </div>
  );
}
