/**
 * 智能弹窗表单组件 (精简版)
 *
 * 特点：
 * 1. 自包含状态：内部封装 useForm
 * 2. 自动数据同步：传入 data 自动处理编辑模式
 * 3. 渲染器注册表：新增字段类型只需在注册表里加一行
 * 4. 统一选项格式：全部使用 SmartEnum
 */

'use client';

import * as React from 'react';
import {
  useForm,
  Controller,
  FieldValues,
  Path,
  DefaultValues
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ZodSchema } from 'zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DialogFooter } from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { MultiSelect } from '@/components/ui/multi-select';
import { SmartEnum, EnumItem } from '@/lib/enum';

// ==================== 字段类型常量 ====================

export const FieldType = {
  INPUT: 'input',
  PASSWORD: 'password',
  EMAIL: 'email',
  NUMBER: 'number',
  TEXTAREA: 'textarea',
  SELECT: 'select',
  MULTISELECT: 'multiselect'
} as const;

// ==================== 字段配置类型 ====================

export interface FormFieldConfig<T extends FieldValues> {
  name: Path<T>;
  type: typeof FieldType[keyof typeof FieldType];
  label: string;
  required?: boolean;
  placeholder?: string;
  /** 编辑模式下只读 */
  editReadonly?: boolean;
  /** 只读模式下的显示值转换 */
  editDisplayValue?: (data: any) => string;
  /** 选项：仅支持 SmartEnum */
  options?: SmartEnum<EnumItem>;
}

export interface DialogFormProps<T extends FieldValues, TEntity = any> {
  schema: ZodSchema<T> | any;
  fields: FormFieldConfig<T>[];
  data?: TEntity;
  defaultValues: DefaultValues<T>;
  onSubmit: (values: T, isEdit: boolean) => Promise<void>;
  onClose: () => void;
}

// ==================== 渲染器上下文 ====================

interface RendererContext<T extends FieldValues> {
  config: FormFieldConfig<T>;
  form: ReturnType<typeof useForm<T>>;
  isLoading: boolean;
}

// ==================== 渲染器注册表 ====================

const FieldRenderers: Record<string, <T extends FieldValues>(ctx: RendererContext<T>) => React.ReactNode> = {
  [FieldType.INPUT]: ({ config, form, isLoading }) => (
    <Input
      id={config.name}
      type="text"
      placeholder={config.placeholder ?? `请输入${config.label}`}
      disabled={isLoading}
      {...form.register(config.name)}
    />
  ),

  [FieldType.PASSWORD]: ({ config, form, isLoading }) => (
    <Input
      id={config.name}
      type="password"
      placeholder={config.placeholder ?? `请输入${config.label}`}
      disabled={isLoading}
      {...form.register(config.name)}
    />
  ),

  [FieldType.EMAIL]: ({ config, form, isLoading }) => (
    <Input
      id={config.name}
      type="email"
      placeholder={config.placeholder ?? `请输入${config.label}`}
      disabled={isLoading}
      {...form.register(config.name)}
    />
  ),

  [FieldType.NUMBER]: ({ config, form, isLoading }) => (
    <Input
      id={config.name}
      type="number"
      placeholder={config.placeholder ?? `请输入${config.label}`}
      disabled={isLoading}
      {...form.register(config.name, { valueAsNumber: true })}
    />
  ),

  [FieldType.TEXTAREA]: ({ config, form, isLoading }) => (
    <Textarea
      id={config.name}
      placeholder={config.placeholder ?? `请输入${config.label}`}
      rows={3}
      disabled={isLoading}
      {...form.register(config.name)}
    />
  ),

  [FieldType.SELECT]: ({ config, form, isLoading }) => {
    const options = config.options?.options ?? [];
    return (
      <Controller
        name={config.name}
        control={form.control}
        render={({ field }) => (
          <Select
            value={field.value != null ? String(field.value) : ''}
            onValueChange={(val) => {
              const num = Number(val);
              field.onChange(isNaN(num) ? val : num);
            }}
            disabled={isLoading}
          >
            <SelectTrigger id={config.name}>
              <SelectValue placeholder={config.placeholder ?? `请选择${config.label}`} />
            </SelectTrigger>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt.code} value={String(opt.code)}>
                  {opt.desc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    );
  },

  [FieldType.MULTISELECT]: ({ config, form }) => {
    const options = config.options?.options ?? [];
    return (
      <Controller
        name={config.name}
        control={form.control}
        render={({ field }) => (
          <MultiSelect
            options={options}
            value={field.value || []}
            onChange={field.onChange}
            placeholder={config.placeholder ?? `请选择${config.label}`}
          />
        )}
      />
    );
  }
};

// ==================== 字段渲染组件 ====================

function FormFieldItem<T extends FieldValues>({
  config,
  form,
  isEdit,
  editData
}: {
  config: FormFieldConfig<T>;
  form: ReturnType<typeof useForm<T>>;
  isEdit: boolean;
  editData?: any;
}) {
  const { isSubmitting } = form.formState;
  const error = form.formState.errors[config.name];

  // 编辑模式只读
  if (isEdit && config.editReadonly && editData) {
    return (
      <div className='space-y-2'>
        <Label>{config.label}</Label>
        <div className='text-muted-foreground text-sm'>
          {config.editDisplayValue ? config.editDisplayValue(editData) : (editData as any)[config.name]}
        </div>
      </div>
    );
  }

  // 渲染器注册表查找
  const renderer = FieldRenderers[config.type];
  if (!renderer) {
    console.warn(`Unknown field type: ${config.type}`);
    return null;
  }

  return (
    <div className='space-y-2'>
      <Label htmlFor={config.name}>
        {config.label}
        {config.required && <span className='text-destructive'> *</span>}
      </Label>
      {renderer({ config, form, isLoading: isSubmitting })}
      {error && <p className='text-destructive text-xs'>{error.message as string}</p>}
    </div>
  );
}

// ==================== 主组件 ====================

export function DialogForm<T extends FieldValues, TEntity = any>({
  schema,
  fields,
  data,
  defaultValues,
  onSubmit,
  onClose
}: DialogFormProps<T, TEntity>) {
  const isEdit = !!data;

  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues
  });

  const { isSubmitting } = form.formState;

  React.useEffect(() => {
    if (data) {
      form.reset(data as any);
    }
  }, [data, form]);

  const handleSubmit = async (values: T) => {
    try {
      await onSubmit(values, isEdit);
      onClose();
    } catch (error) {
      console.error('Submit Error:', error);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
      <div className='grid gap-4 py-4'>
        {fields.map((field) => (
          <FormFieldItem
            key={field.name}
            config={field}
            form={form}
            isEdit={isEdit}
            editData={data}
          />
        ))}
      </div>

      <DialogFooter>
        <Button type='button' variant='outline' onClick={onClose} disabled={isSubmitting}>
          取消
        </Button>
        <Button type='submit' disabled={isSubmitting}>
          {isSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
          {isEdit ? '保存修改' : '确定'}
        </Button>
      </DialogFooter>
    </form>
  );
}
