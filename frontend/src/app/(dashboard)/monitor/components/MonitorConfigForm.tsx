/**
 * 监控配置表单组件
 *
 * @description
 * 统一处理监控配置的创建和编辑逻辑
 * 使用 BaseFormLayout 提供统一布局
 */

'use client';

import { useEffect, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  monitorConfigSchema,
  type MonitorConfigFormData
} from '../monitor.schema';
import { CHANNEL_ENUM } from '../constants';
import { BaseFormLayout } from '@/components/shared/base-form-layout';
import { MonitorApiService } from '@/service/api/monitor.api';
import { useFormSubmit } from '@/hooks/use-form-submit';
import type { DialogComponentProps } from '@/contexts/dialog-provider';
import type { MonitorConfig } from '../types';

export function MonitorConfigForm({
  data: config,
  onClose
}: DialogComponentProps<MonitorConfig>) {
  const isEdit = !!config;

  // 使用通用 Hook 管理提交状态
  const { isLoading, handleSubmit: onApiSubmit } = useFormSubmit(
    async (formData: MonitorConfigFormData) => {
      if (isEdit && config) {
        await MonitorApiService.update(Number(config.id), formData.target_url);
        toast.success('配置更新成功');
      } else {
        await MonitorApiService.create(formData);
        toast.success('配置创建成功');
      }
      onClose();
    }
  );

  const {
    register,
    handleSubmit,
    control,
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

  const onSubmit = (formData: MonitorConfigFormData) => {
    onApiSubmit(formData);
  };

  return (
    <BaseFormLayout
      submit={{
        text: isEdit ? '保存修改' : '立即创建',
        onSubmit: handleSubmit(onSubmit),
        disabled: isEdit && !isDirty,
        loading: isLoading
      }}
    >
      <div className='space-y-4'>
        {/* 渠道选择: 编辑模式下通常只读 */}
        <div className='space-y-2'>
          <Label htmlFor='channel_code'>渠道类型</Label>
          {isEdit ? (
            <div className='text-muted-foreground text-sm'>
              {config.channel_name}
            </div>
          ) : (
            <Controller
              name='channel_code'
              control={control}
              render={({ field }) => (
                <Select
                  value={String(field.value)}
                  onValueChange={(value) => field.onChange(Number(value))}
                  disabled={isLoading}
                >
                  <SelectTrigger id='channel_code'>
                    <SelectValue placeholder='请选择渠道类型' />
                  </SelectTrigger>
                  <SelectContent>
                    {CHANNEL_ENUM.items.map((option) => (
                      <SelectItem key={option.code} value={String(option.code)}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          )}
          {errors.channel_code && (
            <p className='text-destructive text-xs'>
              {errors.channel_code.message}
            </p>
          )}
        </div>

        {/* 监控目标链接 */}
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

// 补全 toast 导入
import { toast } from 'sonner';
