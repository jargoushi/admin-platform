/**
 * 激活码批量初始化表单组件
 *
 * @description
 * 使用 DialogFormLayout 统一布局（复杂动态字段场景不适合配置式）
 * 成功后通过独立弹窗展示结果
 */

'use client';

import { useCallback, useMemo, useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { DialogFooter } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { ActivationCodeTypeResult } from '../types';
import {
  activationCodeInitSchema,
  type ActivationCodeInitFormData
} from '../activation.schema';
import {
  MAX_INIT_ITEMS,
  INIT_COUNT_RANGE,
  ACTIVATION_TYPE_ENUM
} from '../constants';
import { ResultDialog, type ResultDialogData } from '@/components/shared/result-dialog';
import { ActivationApiService } from '@/service/api/activation.api';
import { useDialog, type DialogComponentProps } from '@/contexts/dialog-provider';

export function ActivationCodeInitForm({ onClose }: DialogComponentProps) {
  const dialog = useDialog();
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<ActivationCodeInitFormData>({
    resolver: zodResolver(activationCodeInitSchema),
    defaultValues: {
      items: [{ type: 0, count: INIT_COUNT_RANGE.MIN }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items'
  });

  const watchItems = watch('items');

  const selectedTypes = useMemo(
    () => new Set(watchItems.map((item) => item.type)),
    [watchItems]
  );

  const handleAddItem = useCallback(() => {
    if (fields.length >= MAX_INIT_ITEMS) return;

    const nextType = ACTIVATION_TYPE_ENUM.items.find(
      (item) => !selectedTypes.has(item.code)
    )?.code;

    append({ type: nextType ?? 0, count: INIT_COUNT_RANGE.MIN });
  }, [fields.length, selectedTypes, append]);

  const onSubmit = async (formData: ActivationCodeInitFormData) => {
    setIsLoading(true);
    try {
      const result = await ActivationApiService.init(formData);

      toast.success('批量初始化成功');
      onClose();

      if (result) {
        const resultData: ResultDialogData = {
          message: `共初始化 ${result.total_count} 个激活码。`,
          results: result.results.map((r: ActivationCodeTypeResult) => ({
            title: `${r.type_name} (${r.count} 个)`,
            items: r.activation_codes
          }))
        };

        dialog.open({
          title: '初始化结果',
          component: ResultDialog,
          data: resultData,
          className: 'sm:max-w-[600px]'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <div className='max-h-[300px] space-y-4 overflow-y-auto'>
        {fields.map((field, index) => (
          <Card key={field.id} className='p-4'>
            <div className='grid grid-cols-12 gap-4'>
              <div className='col-span-12 space-y-2 sm:col-span-5'>
                <Label>激活码类型</Label>
                <Controller
                  name={`items.${index}.type`}
                  control={control}
                  render={({ field: selectField }) => (
                    <Select
                      value={String(selectField.value)}
                      onValueChange={(v) => selectField.onChange(Number(v))}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='请选择' />
                      </SelectTrigger>
                      <SelectContent>
                        {ACTIVATION_TYPE_ENUM.items.map((opt) => (
                          <SelectItem
                            key={opt.code}
                            value={String(opt.code)}
                            disabled={selectedTypes.has(opt.code) && opt.code !== selectField.value}
                          >
                            {opt.label} ({ACTIVATION_TYPE_ENUM.getLabel(opt.code as 0|1|2|3)})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className='col-span-12 space-y-2 sm:col-span-5'>
                <Label>生成数量</Label>
                <Input
                  type='number'
                  placeholder='请输入数量'
                  disabled={isLoading}
                  {...control.register(`items.${index}.count`, { valueAsNumber: true })}
                />
                {errors.items?.[index]?.count && (
                  <p className='text-destructive text-xs'>
                    {errors.items[index]?.count?.message}
                  </p>
                )}
              </div>

              <div className='col-span-12 flex items-end justify-end sm:col-span-2'>
                <Button
                  type='button'
                  size='icon'
                  variant='destructive'
                  onClick={() => remove(index)}
                  disabled={fields.length === 1 || isLoading}
                >
                  <Trash2 className='h-4 w-4' />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {errors.items?.root && (
        <p className='text-destructive text-sm'>{errors.items.root.message}</p>
      )}

      {fields.length < MAX_INIT_ITEMS && (
        <Button
          type='button'
          variant='outline'
          onClick={handleAddItem}
          className='w-full'
          disabled={isLoading || selectedTypes.size === MAX_INIT_ITEMS}
        >
          <Plus className='mr-2 h-4 w-4' />
          添加初始化项 ({fields.length}/{MAX_INIT_ITEMS})
        </Button>
      )}

      <p className='text-muted-foreground text-xs'>
        每种激活码类型只能初始化一次，共 {MAX_INIT_ITEMS} 种类型。
      </p>

      <DialogFooter>
        <Button type='button' variant='outline' onClick={onClose} disabled={isLoading}>
          取消
        </Button>
        <Button type='submit' disabled={isLoading}>
          {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
          立即生成
        </Button>
      </DialogFooter>
    </form>
  );
}
