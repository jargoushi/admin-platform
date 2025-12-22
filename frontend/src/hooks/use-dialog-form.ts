/**
 * 弹窗表单 Hook
 *
 * 封装弹窗表单的状态管理：
 * - useForm + zodResolver
 * - 编辑数据自动同步
 * - 提交状态管理
 */

'use client';

import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { useForm, UseFormReturn, Path } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

// ==================== 类型定义 ====================

export interface UseDialogFormOptions<TFormData extends Record<string, any>, TEntity> {
  /** Zod Schema */
  schema: any;
  /** 编辑数据（新建时为 undefined） */
  data?: TEntity;
  /** 提交处理 */
  onSubmit: (formData: TFormData, isEdit: boolean) => Promise<void>;
  /** 关闭弹窗 */
  onClose: () => void;
  /** 成功提示（传了才显示） */
  successMessage?: string;
}

export interface UseDialogFormReturn<TFormData extends Record<string, any>> {
  form: UseFormReturn<TFormData>;
  isEdit: boolean;
  isLoading: boolean;
  handleSubmit: () => Promise<void>;
  onClose: () => void;
}

// ==================== 工具函数 ====================

/** 从 Zod Schema 提取默认值 */
function getSchemaDefaults(schema: any): Record<string, any> {
  const defaults: Record<string, any> = {};
  const shape = schema?.shape || schema?._def?.schema?.shape;

  if (!shape) return defaults;

  Object.keys(shape).forEach((key) => {
    const field = shape[key];
    const typeName = field?._def?.typeName;

    if (typeName === 'ZodNumber') {
      defaults[key] = 0;
    } else {
      defaults[key] = '';
    }
  });

  return defaults;
}

// ==================== Hook 实现 ====================

export function useDialogForm<TFormData extends Record<string, any>, TEntity = unknown>({
  schema,
  data,
  onSubmit,
  onClose,
  successMessage
}: UseDialogFormOptions<TFormData, TEntity>): UseDialogFormReturn<TFormData> {

  const isEdit = !!data;
  const [isLoading, setIsLoading] = useState(false);

  // Refs: 保持函数引用稳定
  const onSubmitRef = useRef(onSubmit);
  const onCloseRef = useRef(onClose);
  onSubmitRef.current = onSubmit;
  onCloseRef.current = onClose;

  // 从 schema 推导默认值
  const defaultValues = useMemo(() => getSchemaDefaults(schema), [schema]);

  // 表单实例
  const form = useForm<TFormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: defaultValues as any
  });

  // 编辑模式: 同步数据到表单
  useEffect(() => {
    if (!data) return;

    Object.keys(defaultValues).forEach((key) => {
      const value = (data as any)[key];
      if (value !== undefined) {
        form.setValue(key as Path<TFormData>, value);
      }
    });
  }, [data, defaultValues, form]);

  // 提交处理
  const handleSubmit = useCallback(async () => {
    const valid = await form.trigger();
    if (!valid) return;

    setIsLoading(true);
    try {
      await onSubmitRef.current(form.getValues(), isEdit);

      // 只有传了 message 才显示 toast
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
