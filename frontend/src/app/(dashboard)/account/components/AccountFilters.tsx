/**
 * 账号筛选组件
 *
 * @description
 * 使用 FilterLayout 通用组件 + react-hook-form 实现筛选功能
 */

'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import type { AccountQueryRequest } from '../types';
import { DEFAULT_QUERY_PARAMS } from '../constants';
import {
  FilterLayout,
  FilterFieldConfig,
  FILTER_TYPES
} from '@/components/shared/filter-layout';

/**
 * 筛选组件属性
 */
interface AccountFiltersProps {
  /** 筛选条件值 */
  filters: AccountQueryRequest;
  /** 查询回调 */
  onSearch: (filters: Partial<AccountQueryRequest>) => void;
  /** 重置回调 */
  onReset: () => void;
}

/**
 * 筛选字段配置（导出供页面生成 parsers 使用）
 */
export const FILTERS_CONFIG: FilterFieldConfig<AccountQueryRequest>[] = [
  {
    key: 'name',
    label: '账号名称',
    type: FILTER_TYPES.INPUT
  }
];

/**
 * 账号筛选组件
 */
export function AccountFilters({
  filters,
  onSearch,
  onReset
}: AccountFiltersProps) {
  const { control, handleSubmit, reset } = useForm<AccountQueryRequest>({
    defaultValues: filters
  });

  // 同步外部 filters 变化
  React.useEffect(() => {
    reset(filters);
  }, [filters, reset]);

  // 重置处理
  const handleReset = React.useCallback(() => {
    reset(DEFAULT_QUERY_PARAMS);
    onReset();
  }, [onReset, reset]);

  return (
    <FilterLayout<AccountQueryRequest>
      config={FILTERS_CONFIG}
      control={control}
      handleSubmit={handleSubmit}
      onSearch={onSearch}
      onReset={handleReset}
    />
  );
}
