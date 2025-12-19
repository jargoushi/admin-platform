/**
 * 通用分页列表管理 Hook
 *
 * @description
 * 统一管理分页列表的筛选、加载和刷新逻辑
 * - 使用 nuqs 管理 URL 查询参数
 * - 自动加载数据
 * - 提供刷新和搜索方法
 */

'use client';

import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { useQueryStates } from 'nuqs';
import type { PageResponse, PageRequest } from '@/lib/http/types';
import { DEFAULT_PAGINATION } from '@/constants/pagination';

export interface UsePageListReturn<T, F extends PageRequest> {
  filters: F;
  setFilters: (filters: Partial<F>) => void;
  search: (filters: Partial<F>) => void;
  resetFilters: () => void;
  items: T[];
  loading: boolean;
  pagination: Omit<PageResponse<T>, 'items'>;
  refresh: () => void;
}

export function usePageList<T, F extends PageRequest>(
  apiService: (params: F) => Promise<PageResponse<T>>,
  defaultFilters: F,
  parsers: any
): UsePageListReturn<T, F> {
  const [urlFilters, setUrlFilters] = useQueryStates(parsers, {
    history: 'replace'
  });

  // 强制刷新计数器
  const [refreshKey, setRefreshKey] = useState(0);

  const filters = useMemo(
    () => ({ ...defaultFilters, ...urlFilters }) as F,
    [defaultFilters, urlFilters]
  );

  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] =
    useState<Omit<PageResponse<T>, 'items'>>(DEFAULT_PAGINATION);

  const apiServiceRef = useRef(apiService);
  apiServiceRef.current = apiService;

  const fetchList = useCallback(async (params: F) => {
    setLoading(true);
    try {
      const response = await apiServiceRef.current(params);
      const { items: responseItems, ...paginationInfo } = response;
      setItems(responseItems);
      setPagination(paginationInfo);
    } finally {
      setLoading(false);
    }
  }, []);

  const setFilters = useCallback(
    (newFilters: Partial<F>) => {
      setUrlFilters(newFilters as Parameters<typeof setUrlFilters>[0]);
    },
    [setUrlFilters]
  );

  const search = useCallback(
    (newFilters: Partial<F>) => {
      setUrlFilters({
        ...newFilters,
        page: 1
      } as Parameters<typeof setUrlFilters>[0]);
    },
    [setUrlFilters]
  );

  // 重置筛选条件并用默认值查询
  const resetFilters = useCallback(() => {
    setUrlFilters(defaultFilters as Parameters<typeof setUrlFilters>[0]);
    // 直接用默认值查询,不等待 URL 更新
    fetchList(defaultFilters);
  }, [setUrlFilters, fetchList, defaultFilters]);

  // 刷新当前数据
  const refresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  // 监听筛选条件变化或强制刷新
  useEffect(() => {
    fetchList(filters);
  }, [filters, refreshKey, fetchList]);

  return {
    filters,
    setFilters,
    search,
    resetFilters,
    items,
    loading,
    pagination,
    refresh
  };
}
