/**
 * 智能弹窗表单组件 (重构版)
 *
 * 特点：
 * 1. 自包含状态：内部封装 useForm，外部无需调用 Hook
 * 2. 自动数据同步：传入 data 自动处理编辑模式和数据回显
 * 3. 极简配置：业务代码仅需声明 schema, fields 和 onSubmit
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
import { MultiSelect, type MultiSelectOption } from '@/components/ui/multi-select';
import { SmartEnum, EnumItem, EnumOption } from '@/lib/enum';

// ==================== 类型定义 ====================

export interface BaseFieldConfig<T extends FieldValues> {
  name: Path<T>;
  label: string;
  required?: boolean;
  placeholder?: string;
  /** 编辑模式下只读 */
  editReadonly?: boolean;
  /** 只读模式下的显示值转换 */
  editDisplayValue?: (data: any) => string;
  /** 动态加载选项 */
  loadOptions?: () => Promise<EnumOption[] | MultiSelectOption[]>;
  /** 自定义渲染 */
  render?: (props: { field: any; isLoading: boolean }) => React.ReactNode;
}

export interface InputFieldConfig<T extends FieldValues> extends BaseFieldConfig<T> {
  type?: 'input' | 'password' | 'email' | 'number';
}

export interface TextareaFieldConfig<T extends FieldValues> extends BaseFieldConfig<T> {
  type: 'textarea';
  rows?: number;
}

export interface SelectFieldConfig<T extends FieldValues> extends BaseFieldConfig<T> {
  type: 'select';
  options?: EnumOption[] | SmartEnum<EnumItem>;
}

export interface MultiSelectFieldConfig<T extends FieldValues> extends BaseFieldConfig<T> {
  type: 'multiselect';
  options?: MultiSelectOption[];
}

export type FormFieldConfig<T extends FieldValues> =
  | InputFieldConfig<T>
  | TextareaFieldConfig<T>
  | SelectFieldConfig<T>
  | MultiSelectFieldConfig<T>;

export interface DialogFormProps<T extends FieldValues, TEntity = any> {
  /** Zod Schema */
  schema: any;
  /** 字段配置 */
  fields: FormFieldConfig<T>[];
  /** 初始数据 (传入则开启编辑模式) */
  data?: TEntity;
  /** 默认值 */
  defaultValues: DefaultValues<T>;
  /** 提交处理 */
  onSubmit: (values: T, isEdit: boolean) => Promise<void>;
  /** 关闭回调 */
  onClose: () => void;
}

// ==================== 内部组件：字段渲染 ====================

function FormFieldItem<T extends FieldValues>({
  config,
  form,
  isEdit,
  editData
}: {
  config: FormFieldConfig<T>;
  form: any;
  isEdit: boolean;
  editData?: any;
}) {
  const { name, label, required, placeholder, editReadonly, editDisplayValue, loadOptions, render } = config;
  const [dynamicOptions, setDynamicOptions] = React.useState<any[] | null>(null);

  React.useEffect(() => {
    if (loadOptions) {
      loadOptions().then(setDynamicOptions);
    }
  }, [loadOptions]);

  const isLoading = form.formState.isSubmitting || (!!loadOptions && dynamicOptions === null);
  const error = form.formState.errors[name];
  const fieldType = (config as any).type ?? 'input';

  // 编辑模式只读
  if (isEdit && editReadonly && editData) {
    return (
      <div className='space-y-2'>
        <Label>{label}</Label>
        <div className='text-muted-foreground text-sm'>
          {editDisplayValue ? editDisplayValue(editData) : (editData as any)[name]}
        </div>
      </div>
    );
  }

  const renderControl = () => {
    // 支持自定义渲染
    if (render) {
      return (
        <Controller
          name={name}
          control={form.control}
          render={({ field }) => <>{render({ field, isLoading })}</>}
        />
      );
    }

    switch (fieldType) {
      case 'textarea':
        return (
          <Textarea
            id={name}
            placeholder={placeholder ?? `请输入${label}`}
            rows={(config as TextareaFieldConfig<T>).rows ?? 3}
            disabled={isLoading}
            {...form.register(name)}
          />
        );

      case 'select': {
        const selectConfig = config as SelectFieldConfig<T>;
        const options = dynamicOptions || (selectConfig.options instanceof SmartEnum
          ? selectConfig.options.options
          : selectConfig.options || []);

        return (
          <Controller
            name={name}
            control={form.control}
            render={({ field }) => (
              <Select
                value={field.value != null ? String(field.value) : ''}
                onValueChange={(val) => field.onChange(Number(val) || val)}
                disabled={isLoading}
              >
                <SelectTrigger id={name}>
                  <SelectValue placeholder={placeholder ?? `请选择${label}`} />
                </SelectTrigger>
                <SelectContent>
                  {options.map((opt: any) => (
                    <SelectItem key={opt.code} value={String(opt.code)}>
                      {opt.desc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        );
      }

      case 'multiselect': {
        const msConfig = config as MultiSelectFieldConfig<T>;
        const options = (dynamicOptions as MultiSelectOption[]) || msConfig.options || [];
        return (
          <Controller
            name={name}
            control={form.control}
            render={({ field }) => (
              <MultiSelect
                options={options}
                value={field.value || []}
                onChange={field.onChange}
                placeholder={placeholder ?? `请选择${label}`}
              />
            )}
          />
        );
      }

      default:
        return (
          <Input
            id={name}
            type={fieldType === 'input' ? 'text' : fieldType}
            placeholder={placeholder ?? `请输入${label}`}
            disabled={isLoading}
            {...form.register(name, fieldType === 'number' ? { valueAsNumber: true } : {})}
          />
        );
    }
  };

  return (
    <div className='space-y-2'>
      <Label htmlFor={name}>
        {label}
        {required && <span className='text-destructive'> *</span>}
      </Label>
      {renderControl()}
      {error && (
        <p className='text-destructive text-xs'>{error.message as string}</p>
      )}
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
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues
  });

  // 自动同步数据
  React.useEffect(() => {
    if (data) {
      form.reset(data as any);
    }
  }, [data, form]);

  const handleSubmit = async (values: T) => {
    setIsSubmitting(true);
    try {
      await onSubmit(values, isEdit);
      onClose();
    } catch (error) {
      console.error('Submit Error:', error);
    } finally {
      setIsSubmitting(false);
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
