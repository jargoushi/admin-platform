/**
 * 激活码批量初始化表单组件
 *
 * @description
 * 使用 BaseFormLayout 提供统一布局,组件内部管理表单/结果切换逻辑
 */

'use client';

import { useCallback, useMemo } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2, Copy } from 'lucide-react';
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
import { copyToClipboard } from '@/lib/utils';
import type { ActivationCodeTypeResult } from '../types';
import {
  activationCodeInitSchema,
  type ActivationCodeInitFormData
} from '../activation.schema';
import {
  MAX_INIT_ITEMS,
  INIT_COUNT_RANGE,
  ACTIVATION_CODE_TYPES
} from '../constants';
import { findDescByCode } from '@/types/common';
import { BaseFormLayout } from '@/components/shared/base-form-layout';
import { ActivationApiService } from '@/service/api/activation.api';
import { useFormSubmit } from '@/hooks/use-form-submit';

export function ActivationCodeInitForm() {
  // 使用通用 Hook 管理提交状态
  const {
    result,
    isLoading,
    handleSubmit: onApiSubmit
  } = useFormSubmit(ActivationApiService.init);

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

  /**
   * 获取当前已选中的类型列表
   */
  const selectedTypes = useMemo(
    () => new Set(watchItems.map((item) => item.type)),
    [watchItems]
  );

  /**
   * 处理添加初始化项
   */
  const handleAddItem = useCallback(() => {
    if (fields.length >= MAX_INIT_ITEMS) return;

    const nextType = ACTIVATION_CODE_TYPES.find(
      (opt) => !selectedTypes.has(opt.code as number)
    )?.code as number | undefined;

    const newType = nextType !== undefined ? nextType : 0;

    append({ type: newType, count: INIT_COUNT_RANGE.MIN });
  }, [fields.length, selectedTypes, append]);

  const onSubmit = (data: ActivationCodeInitFormData) => {
    onApiSubmit(data);
  };

  // 结果内容
  const resultContent = result && (
    <div className='space-y-4'>
      <div className='text-sm text-green-600'>
        批量初始化激活码成功,共初始化 {result.total_count} 个激活码。
      </div>

      {result.results.map((typeResult: ActivationCodeTypeResult) => (
        <Card key={typeResult.type} className='p-4'>
          <div className='flex justify-between border-b pb-2'>
            <h4 className='font-semibold'>
              {typeResult.type_name} ({typeResult.count} 个)
            </h4>
            <Button
              variant='ghost'
              type='button'
              size='sm'
              onClick={() => {
                copyToClipboard(typeResult.activation_codes.join('\n'));
              }}
            >
              <Copy className='mr-2 h-4 w-4' />
              复制
            </Button>
          </div>
          <div className='mt-2 max-h-24 space-y-1 overflow-y-auto text-xs'>
            {typeResult.activation_codes.map((code) => (
              <code
                key={code}
                className='text-muted-foreground block font-mono'
              >
                {code}
              </code>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <BaseFormLayout
      resultContent={resultContent}
      submit={{
        text: '立即生成',
        onSubmit: handleSubmit(onSubmit),
        loading: isLoading
      }}
    >
      <div className='space-y-4'>
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
                        onValueChange={(value) =>
                          selectField.onChange(Number(value))
                        }
                        disabled={isLoading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='请选择激活码类型' />
                        </SelectTrigger>
                        <SelectContent>
                          {ACTIVATION_CODE_TYPES.map((option) => {
                            const typeValue = option.code as 0 | 1 | 2 | 3;
                            return (
                              <SelectItem
                                key={option.code}
                                value={String(option.code)}
                                disabled={
                                  selectedTypes.has(typeValue) &&
                                  typeValue !== selectField.value
                                }
                              >
                                {option.desc} (
                                {findDescByCode(
                                  ACTIVATION_CODE_TYPES,
                                  typeValue
                                )}
                                )
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className='col-span-12 space-y-2 sm:col-span-5'>
                  <Label>生成数量</Label>
                  <Input
                    type='number'
                    placeholder='请输入生成数量'
                    disabled={isLoading}
                    {...control.register(`items.${index}.count`, {
                      valueAsNumber: true
                    })}
                  />
                  {errors.items?.[index]?.count && (
                    <p className='text-destructive text-xs'>
                      {errors.items?.[index]?.count?.message}
                    </p>
                  )}
                </div>

                <div className='col-span-12 flex items-end justify-end sm:col-span-2'>
                  <Button
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
          <p className='text-destructive text-sm'>
            {errors.items.root.message}
          </p>
        )}
        {errors.items?.message && (
          <p className='text-destructive text-sm'>{errors.items.message}</p>
        )}

        {fields.length < MAX_INIT_ITEMS && (
          <Button
            variant='outline'
            onClick={handleAddItem}
            className='w-full'
            type='button'
            disabled={isLoading || selectedTypes.size === MAX_INIT_ITEMS}
          >
            <Plus className='mr-2 h-4 w-4' />
            添加初始化项 ({fields.length}/{MAX_INIT_ITEMS})
          </Button>
        )}

        <p className='text-muted-foreground text-xs'>
          每种激活码类型只能初始化一次,共 {MAX_INIT_ITEMS} 种类型。
        </p>
      </div>
    </BaseFormLayout>
  );
}
