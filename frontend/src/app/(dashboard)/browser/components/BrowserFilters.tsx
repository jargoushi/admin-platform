/**
 * 浏览器管理筛选组件
 */

'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { FilterLayout } from '@/components/shared/filter-layout';
import { FILTERS_CONFIG, DEFAULT_QUERY_PARAMS } from '../constants';
import type { BrowserListRequest } from '../types';

interface BrowserFiltersProps {
    filters: BrowserListRequest;
    onSearch: (filters: Partial<BrowserListRequest>) => void;
    onReset: () => void;
}

export function BrowserFilters({
    filters,
    onSearch,
    onReset
}: BrowserFiltersProps) {
    const { control, handleSubmit, reset } = useForm<BrowserListRequest>({
        defaultValues: filters
    });

    // 同步外部 filters 变化
    React.useEffect(() => {
        reset(filters);
    }, [filters, reset]);

    const handleReset = React.useCallback(() => {
        reset(DEFAULT_QUERY_PARAMS);
        onReset();
    }, [onReset, reset]);

    return (
        <FilterLayout<BrowserListRequest>
            config={FILTERS_CONFIG}
            control={control}
            handleSubmit={handleSubmit}
            onSearch={onSearch}
            onReset={handleReset}
        />
    );
}

export { FILTERS_CONFIG };
