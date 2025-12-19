/**
 * 通用表单提交 Hook
 *
 * @description
 * 统一管理表单提交的 loading、result、error 状态
 * 消除表单组件间的重复逻辑
 */

import { useState, useCallback } from 'react';

/**
 * 表单提交 Hook 返回值
 */
interface UseFormSubmitReturn<TData, TResult> {
  /** 提交结果 */
  result: TResult | null;
  /** 加载状态 */
  isLoading: boolean;
  /** 提交处理函数 */
  handleSubmit: (data: TData) => Promise<TResult | null>;
  /** 重置结果 */
  resetResult: () => void;
}

/**
 * 通用表单提交 Hook
 *
 * @template TData - 表单数据类型
 * @template TResult - 提交结果类型
 * @param submitFn - 提交函数
 * @returns 提交状态和方法
 *
 * @example
 * ```typescript
 * const { result, isLoading, handleSubmit } = useFormSubmit(
 *   async (data) => await api.submit(data)
 * );
 * ```
 */
export function useFormSubmit<TData, TResult>(
  submitFn: (data: TData) => Promise<TResult | null>
): UseFormSubmitReturn<TData, TResult> {
  const [result, setResult] = useState<TResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = useCallback(
    async (data: TData) => {
      setIsLoading(true);
      try {
        const res = await submitFn(data);
        if (res) {
          setResult(res);
        }
        return res;
      } finally {
        setIsLoading(false);
      }
    },
    [submitFn]
  );

  const resetResult = useCallback(() => {
    setResult(null);
  }, []);

  return {
    result,
    isLoading,
    handleSubmit,
    resetResult
  };
}
