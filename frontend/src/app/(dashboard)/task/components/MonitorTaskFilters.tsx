/**
 * 任务筛选组件
 *
 * @description
 * 使用 FilterLayout 通用组件 + react-hook-form 实现筛选功能
 * 表单类型直接使用后端 MonitorTaskQueryRequest 格式，无需转换
 */

'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import type { MonitorTaskQueryRequest } from '../types';
import {
  CHANNEL_TYPES,
  TASK_TYPES,
  TASK_STATUSES,
  DEFAULT_QUERY_PARAMS
} from '../constants';
import {
  FilterLayout,
  FilterFieldConfig,
  FILTER_TYPES
} from '@/components/shared/filter-layout';

/**
 * 筛选组件属性
 */
interface MonitorTaskFiltersProps {
  /** 筛选条件值（后端格式） */
  filters: MonitorTaskQueryRequest;
  /** 查询回调（更新筛选条件执行查询） */
  onSearch: (filters: Partial<MonitorTaskQueryRequest>) => void;
  /** 重置回调（清空所有筛选条件） */
  onReset: () => void;
}

/**
 * 筛选字段配置 (导出供页面生成 parsers 使用)
 */
export const FILTERS_CONFIG: FilterFieldConfig<MonitorTaskQueryRequest>[] = [
  {
    key: 'channel_code',
    label: '渠道',
    type: FILTER_TYPES.SELECT,
    options: CHANNEL_TYPES
  },
  {
    key: 'task_type',
    label: '任务类型',
    type: FILTER_TYPES.SELECT,
    options: TASK_TYPES
  },
  {
    key: 'task_status',
    label: '任务状态',
    type: FILTER_TYPES.SELECT,
    options: TASK_STATUSES
  },
  // --- 高级筛选：日期范围 ---
  {
    startKey: 'start_date',
    endKey: 'end_date',
    label: '调度日期范围',
    type: FILTER_TYPES.DATE_RANGE,
    advanced: true
  }
];

/**
 * 任务筛选组件
 */
export function MonitorTaskFilters({
  filters,
  onSearch,
  onReset
}: MonitorTaskFiltersProps) {
  // 使用 react-hook-form 管理表单状态
  const { control, handleSubmit, reset } = useForm<MonitorTaskQueryRequest>({
    defaultValues: filters
  });

  // 同步外部 filters 变化（如 URL 参数变化或重置）
  React.useEffect(() => {
    reset(filters);
  }, [filters, reset]);

  // 重置处理：需要同时重置表单内部状态和外部状态
  const handleReset = React.useCallback(() => {
    reset(DEFAULT_QUERY_PARAMS);
    onReset();
  }, [onReset, reset]);

  return (
    <FilterLayout<MonitorTaskQueryRequest>
      config={FILTERS_CONFIG}
      control={control}
      handleSubmit={handleSubmit}
      onSearch={onSearch}
      onReset={handleReset}
    />
  );
}
