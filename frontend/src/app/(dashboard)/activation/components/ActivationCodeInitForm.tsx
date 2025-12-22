/**
 * 激活码批量初始化表单
 */

'use client';

import { useCallback, useMemo, useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
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
import { DialogFormFooter } from '@/components/shared/dialog-form';
import { ResultDialog, type ResultDialogData } from '@/components/shared/result-dialog';
import { ActivationApiService } from '@/service/api/activation.api';
import { useDialog, type DialogComponentProps } from '@/contexts/dialog-provider';
import {
  activationCodeInitSchema,
  type ActivationCodeInitFormData
} from '../activation.schema';
import {
  MAX_INIT_ITEMS,
  INIT_COUNT_RANGE,
  ACTIVATION_TYPE_ENUM
} from '../constants';
import type { ActivationCodeTypeResult } from '../types';

export function ActivationCodeInitForm({ onClose }: DialogComponentProps) {
  const dialog = useDialog();
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit, formState: { errors }, watch } = useForm<ActivationCodeInitFormData>({
    resolver: zodResolver(activationCodeInitSchema),
    defaultValues: { items: [{ type: 0, count: INIT_COUNT_RANGE.MIN }] }
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'items' });
  const selectedTypes = useMemo(() => new Set(watch('items').map(i => i.type)), [watch('items')]);

  const handleAddItem = useCallback(() => {
    if (fields.length >= MAX_INIT_ITEMS) return;
    const nextType = ACTIVATION_TYPE_ENUM.items.find(i => !selectedTypes.has(i.code))?.code ?? 0;
    append({ type: nextType, count: INIT_COUNT_RANGE.MIN });
  }, [fields.length, selectedTypes, append]);

  const onSubmit = async (formData: ActivationCodeInitFormData) => {
    setIsLoading(true);
    try {
      const result = await ActivationApiService.init(formData);
      toast.success('批量初始化成功');
      onClose();

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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <div className='max-h-[300px] space-y-3 overflow-y-auto'>
        {fields.map((field, index) => (
          <Card key={field.id} className='p-3'>
            <div className='flex items-end gap-3'>
              {/* 类型选择 */}
              <div className='flex-1 space-y-1'>
                <Label className='text-xs'>激活码类型</Label>
                <Controller
                  name={`items.${index}.type`}
                  control={control}
                  render={({ field: f }) => (
                    <Select
                      value={String(f.value)}
                      onValueChange={v => f.onChange(Number(v))}
                      disabled={isLoading}
                    >
                      <SelectTrigger className='h-9'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ACTIVATION_TYPE_ENUM.items.map(opt => (
                          <SelectItem
                            key={opt.code}
                            value={String(opt.code)}
                            disabled={selectedTypes.has(opt.code) && opt.code !== f.value}
                          >
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              {/* 数量输入 */}
              <div className='w-24 space-y-1'>
                <Label className='text-xs'>数量</Label>
                <Input
                  type='number'
                  className='h-9'
                  disabled={isLoading}
                  {...control.register(`items.${index}.count`, { valueAsNumber: true })}
                />
                {errors.items?.[index]?.count && (
                  <p className='text-destructive text-xs'>{errors.items[index]?.count?.message}</p>
                )}
              </div>

              {/* 删除按钮 */}
              <Button
                type='button'
                size='icon'
                variant='ghost'
                className='h-9 w-9 text-destructive'
                onClick={() => remove(index)}
                disabled={fields.length === 1 || isLoading}
              >
                <Trash2 className='h-4 w-4' />
              </Button>
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
          size='sm'
          onClick={handleAddItem}
          disabled={isLoading || selectedTypes.size === MAX_INIT_ITEMS}
        >
          <Plus className='mr-1 h-4 w-4' />
          添加 ({fields.length}/{MAX_INIT_ITEMS})
        </Button>
      )}

      <DialogFormFooter isLoading={isLoading} onCancel={onClose}/>
    </form>
  );
}
