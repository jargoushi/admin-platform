/**
 * 监控配置修改表单组件
 *
 * @description
 * 使用 BaseFormLayout 提供统一布局,组件内部管理表单/结果切换逻辑
 */

'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  monitorConfigSchema,
  type MonitorConfigFormData
} from '../monitor.schema';
import type { MonitorConfig } from '../types';
import { BaseFormLayout } from '@/components/shared/base-form-layout';
import { MonitorApiService } from '@/service/api/monitor.api';
import { useFormSubmit } from '@/hooks/use-form-submit';

interface MonitorConfigUpdateFormProps {
  /** 要修改的监控配置（从 GenericDialogs 传递） */
  data?: MonitorConfig;
  /** 取消回调（从 GenericDialogs 传递） */
  onCancel?: () => void;
}

export function MonitorConfigUpdateForm({
  data: config,
  onCancel
}: MonitorConfigUpdateFormProps) {
  // 使用通用 Hook 管理提交状态
  const { isLoading, handleSubmit: onApiSubmit } = useFormSubmit(
    async (data: MonitorConfigFormData) => {
      if (!config) throw new Error('配置不存在');
      await MonitorApiService.update(config.id, data.target_url);
      // 提交成功后直接关闭弹窗
      onCancel?.();
    }
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty }
  } = useForm<MonitorConfigFormData>({
    resolver: zodResolver(monitorConfigSchema),
    defaultValues: {
      channel_code: config?.channel_code || 1,
      target_url: config?.target_url || ''
    }
  });

  // 同步外部数据变化
  useEffect(() => {
    if (config) {
      reset({
        channel_code: config.channel_code,
        target_url: config.target_url
      });
    }
  }, [config, reset]);

  const onSubmit = (data: MonitorConfigFormData) => {
    onApiSubmit(data);
  };

  // 如果没有配置数据，显示加载状态
  if (!config) {
    return (
      <div className='flex items-center justify-center py-8'>
        <div className='text-muted-foreground'>加载中...</div>
      </div>
    );
  }

  return (
    <BaseFormLayout
      submit={{
        text: '保存修改',
        onSubmit: handleSubmit(onSubmit),
        disabled: !isDirty,
        loading: isLoading
      }}
    >
      <div className='space-y-4'>
        <div className='space-y-2'>
          <Label>当前渠道</Label>
          <div className='text-muted-foreground text-sm'>
            {config.channel_name}
          </div>
        </div>

        <div className='space-y-2'>
          <Label htmlFor='target_url'>监控目标链接</Label>
          <Input
            id='target_url'
            type='text'
            placeholder='请输入监控目标链接'
            disabled={isLoading}
            {...register('target_url')}
          />
          {errors.target_url ? (
            <p className='text-destructive text-xs'>
              {errors.target_url.message}
            </p>
          ) : (
            <p className='text-muted-foreground text-xs'>
              请输入完整的目标链接地址（最多512个字符）
            </p>
          )}
        </div>
      </div>
    </BaseFormLayout>
  );
}
