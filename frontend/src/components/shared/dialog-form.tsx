/**
 * 配置式弹窗表单组件
 *
 * 与 useDialogForm 配合使用，通过 fields 配置驱动字段渲染
 */

'use client';

import * as React from 'react';
import { Controller, FieldValues, Path } from 'react-hook-form';
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
import { Loader2 } from 'lucide-react';
import { SmartEnum, EnumItem, EnumOption } from '@/lib/enum';
import type { UseDialogFormReturn } from '@/hooks/use-dialog-form';

// ==================== DialogFormFooter ====================

interface DialogFormFooterProps {
  isLoading: boolean;
  onCancel: () => void;
  isEdit?: boolean;
}

/** 统一的弹窗表单底部按钮，可单独使用 */
export function DialogFormFooter({ isLoading, onCancel, isEdit = false }: DialogFormFooterProps) {
  return (
    <DialogFooter>
      <Button type='button' variant='outline' onClick={onCancel} disabled={isLoading}>
        取消
      </Button>
      <Button type='submit' disabled={isLoading}>
        {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
        {isEdit ? '保存修改' : '确定'}
      </Button>
    </DialogFooter>
  );
}

// ==================== 类型定义 ====================

interface BaseFieldConfig<T extends FieldValues> {
  name: Path<T>;
  label: string;
  required?: boolean;
  placeholder?: string;
  help?: string;
  /** 编辑模式下只读，需配合 editDisplayValue 使用 */
  editReadonly?: boolean;
  editDisplayValue?: (data: any) => string;
}

interface InputFieldConfig<T extends FieldValues> extends BaseFieldConfig<T> {
  type?: 'input' | 'password' | 'email' | 'number';
}

interface TextareaFieldConfig<T extends FieldValues> extends BaseFieldConfig<T> {
  type: 'textarea';
  rows?: number;
}

interface SelectFieldConfig<T extends FieldValues> extends BaseFieldConfig<T> {
  type: 'select';
  options: EnumOption[] | SmartEnum<EnumItem>;
}

export type FormFieldConfig<T extends FieldValues> =
  | InputFieldConfig<T>
  | TextareaFieldConfig<T>
  | SelectFieldConfig<T>;

interface DialogFormProps<T extends FieldValues> {
  form: UseDialogFormReturn<T>;
  fields: FormFieldConfig<T>[];
  /** 编辑数据，用于只读字段显示 */
  editData?: any;
}

// ==================== 字段渲染 ====================

function FormField<T extends FieldValues>({
  config,
  form,
  isEdit,
  editData
}: {
  config: FormFieldConfig<T>;
  form: UseDialogFormReturn<T>['form'];
  isEdit: boolean;
  editData?: any;
}) {
  const { name, label, required, placeholder, help, editReadonly, editDisplayValue } = config;
  const isLoading = form.formState.isSubmitting;
  const error = form.formState.errors[name];
  const fieldType = (config as any).type ?? 'input';

  // 编辑模式只读字段
  if (isEdit && editReadonly && editDisplayValue && editData) {
    return (
      <div className='space-y-2'>
        <Label>{label}</Label>
        <div className='text-muted-foreground text-sm'>
          {editDisplayValue(editData)}
        </div>
      </div>
    );
  }

  // 渲染输入控件
  const renderControl = () => {
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
        const options = selectConfig.options instanceof SmartEnum
          ? selectConfig.options.options
          : selectConfig.options;

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
      }

      default: // input, password, email, number
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
      {!error && help && (
        <p className='text-muted-foreground text-xs'>{help}</p>
      )}
    </div>
  );
}

// ==================== 主组件 ====================

export function DialogForm<T extends FieldValues>({
  form,
  fields,
  editData
}: DialogFormProps<T>) {
  const { isEdit, isLoading, handleSubmit, onClose } = form;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      className='space-y-4'
    >
      {fields.map((field) => (
        <FormField
          key={field.name}
          config={field}
          form={form.form}
          isEdit={isEdit}
          editData={editData}
        />
      ))}

      <DialogFooter>
        <Button type='button' variant='outline' onClick={onClose} disabled={isLoading}>
          取消
        </Button>
        <Button type='submit' disabled={isLoading}>
          {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
          {isEdit ? '保存修改' : '确定'}
        </Button>
      </DialogFooter>
    </form>
  );
}
