/**
 * 新增绑定表单 (优化版)
 */

'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { DialogForm, FieldType, FormFieldConfig } from '@/components/shared/dialog-form';
import { AccountApiService } from '@/service/api/account.api';
import { CommonApiService } from '@/service/api/common.api';
import { bindingSchema, type BindingFormData } from '../account.schema';
import type { DialogComponentProps } from '@/contexts/dialog-provider';
import type { Account } from '../types';
import { SmartEnum, EnumItem } from '@/lib/enum';

// ==================== 配置常量 ====================

const DEFAULT_VALUES: BindingFormData = {
  project_code: 0,
  channel_codes: [],
  browser_id: ''
};

// ==================== 组件 ====================

export function BindingAddForm({ data: account, onClose }: DialogComponentProps<Account>) {
  const [projectEnum, setProjectEnum] = React.useState<SmartEnum<EnumItem> | null>(null);
  const [channelEnum, setChannelEnum] = React.useState<SmartEnum<EnumItem> | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  // 预加载选项并创建 SmartEnum
  React.useEffect(() => {
    Promise.all([
      CommonApiService.getProjects(),
      CommonApiService.getChannels()
    ]).then(([projects, channels]) => {
      setProjectEnum(new SmartEnum(projects.map(p => ({ code: p.code, label: p.desc }))));
      setChannelEnum(new SmartEnum(channels.map(c => ({ code: c.code, label: c.desc }))));
      setIsLoading(false);
    });
  }, []);

  const handleSubmit = async (values: BindingFormData) => {
    if (!account) return;
    await AccountApiService.bind(account.id, {
      project_code: values.project_code,
      channel_codes: values.channel_codes,
      browser_id: values.browser_id || undefined
    });
    toast.success('绑定成功');
  };

  if (isLoading || !projectEnum || !channelEnum) {
    return <div className="py-8 text-center text-muted-foreground">加载中...</div>;
  }

  // 动态生成字段配置
  const formFields: FormFieldConfig<BindingFormData>[] = [
    {
      name: 'project_code',
      type: FieldType.SELECT,
      label: '项目',
      required: true,
      options: projectEnum
    },
    {
      name: 'channel_codes',
      type: FieldType.MULTISELECT,
      label: '渠道',
      required: true,
      options: channelEnum
    },
    {
      name: 'browser_id',
      type: FieldType.INPUT,
      label: '浏览器 ID',
      placeholder: '可选'
    }
  ];

  return (
    <DialogForm<BindingFormData, Account>
      schema={bindingSchema}
      data={account}
      onClose={onClose}
      defaultValues={DEFAULT_VALUES}
      onSubmit={handleSubmit}
      fields={formFields}
    />
  );
}
