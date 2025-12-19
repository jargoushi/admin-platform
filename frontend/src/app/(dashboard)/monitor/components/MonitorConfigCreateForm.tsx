/**
 * 监控配置创建表单组件
 *
 * @description
 * 使用 BaseFormLayout 提供统一布局,组件内部管理表单/结果切换逻辑
 */

'use client';

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
import { CHANNEL_TYPES } from '../constants';
import { BaseFormLayout } from '@/components/shared/base-form-layout';
import { MonitorApiService } from '@/service/api/monitor.api';
import { useFormSubmit } from '@/hooks/use-form-submit';

interface MonitorConfigCreateFormProps {
  /** 取消回调（从 GenericDialogs 传递） */
  onCancel?: () => void;
}

export function MonitorConfigCreateForm({
  onCancel
}: MonitorConfigCreateFormProps = {}) {
  // 使用通用 Hook 管理提交状态
  const { isLoading, handleSubmit: onApiSubmit } = useFormSubmit(
    async (data: MonitorConfigFormData) => {
      await MonitorApiService.create(data);
      // 提交成功后直接关闭弹窗
      onCancel?.();
    }
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<MonitorConfigFormData>({
    resolver: zodResolver(monitorConfigSchema),
    defaultValues: {
      channel_code: 1,
      target_url: ''
    }
  });

  const onSubmit = (data: MonitorConfigFormData) => {
    onApiSubmit(data);
  };

  return (
    <BaseFormLayout
      submit={{
        text: '立即创建',
        onSubmit: handleSubmit(onSubmit),
        loading: isLoading
      }}
    >
      <div className='space-y-4'>
        <div className='space-y-2'>
          <Label htmlFor='channel_code'>渠道类型</Label>
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
                  {CHANNEL_TYPES.map((option) => (
                    <SelectItem key={option.code} value={String(option.code)}>
                      {option.desc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.channel_code && (
            <p className='text-destructive text-xs'>
              {errors.channel_code.message}
            </p>
          )}
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
