/**
 * 弹窗表单 Hook
 *
 * 封装表单状态管理，使用显式配置，简单可靠
 */

'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useForm, UseFormReturn, DefaultValues, Path } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

// ==================== 类型定义 ====================

export interface UseDialogFormOptions<TFormData extends Record<string, any>, TEntity> {
  /** Zod Schema */
  schema: any;
  /** 默认值（必须提供） */
  defaultValues: DefaultValues<TFormData>;
  /** 编辑数据（新建时为 undefined） */
  data?: TEntity;
  /** 提交处理 */
  onSubmit: (formData: TFormData, isEdit: boolean) => Promise<void>;
  /** 关闭弹窗 */
  onClose: () => void;
  /** 成功提示（传了才显示） */
  successMessage?: string;
  /** 数据转换：将实体转为表单数据（编辑模式必须提供） */
  dataToForm?: (data: TEntity) => Partial<TFormData>;
}

export interface UseDialogFormReturn<TFormData extends Record<string, any>> {
  form: UseFormReturn<TFormData>;
  isEdit: boolean;
  isLoading: boolean;
  handleSubmit: () => Promise<void>;
  onClose: () => void;
}

// ==================== Hook 实现 ====================

export function useDialogForm<TFormData extends Record<string, any>, TEntity = unknown>({
  schema,
  defaultValues,
  data,
  onSubmit,
  onClose,
  successMessage,
  dataToForm
}: UseDialogFormOptions<TFormData, TEntity>): UseDialogFormReturn<TFormData> {

  const isEdit = !!data;
  const [isLoading, setIsLoading] = useState(false);

  // Refs: 保持函数引用稳定
  const onSubmitRef = useRef(onSubmit);
  const onCloseRef = useRef(onClose);
  const dataToFormRef = useRef(dataToForm);
  onSubmitRef.current = onSubmit;
  onCloseRef.current = onClose;
  dataToFormRef.current = dataToForm;

  // 表单实例
  const form = useForm<TFormData>({
    resolver: zodResolver(schema) as any,
    defaultValues
  });

  // 编辑模式: 同步数据到表单
  useEffect(() => {
    if (data && dataToFormRef.current) {
      const formData = dataToFormRef.current(data);
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined) {
          form.setValue(key as Path<TFormData>, value as any);
        }
      });
    }
  }, [data, form]);

  // 提交处理
  const handleSubmit = useCallback(async () => {
    const valid = await form.trigger();
    if (!valid) return;

    setIsLoading(true);
    try {
      await onSubmitRef.current(form.getValues(), isEdit);

      if (successMessage) {
        toast.success(successMessage);
      }

      onCloseRef.current();
    } catch (error) {
      console.error('提交失败:', error);
    } finally {
      setIsLoading(false);
    }
  }, [form, isEdit, successMessage]);

  return { form, isEdit, isLoading, handleSubmit, onClose };
}
