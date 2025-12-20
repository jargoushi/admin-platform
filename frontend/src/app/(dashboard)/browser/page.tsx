/**
 * 浏览器管理页面
 */

'use client';

import { usePageList } from '@/hooks/use-page-list';
import { FilterLayout, createFilterParsers } from '@/components/shared/filter-layout';
import { BrowserApiService } from '@/service/api/browser.api';
import { CurdLayout } from '@/components/shared/curd-layout';
import { BrowserPageHeader } from './components/BrowserPageHeader';
import { BrowserTable } from './components/BrowserTable';
import { DEFAULT_QUERY_PARAMS, FILTERS_CONFIG } from './constants';
import type { BrowserListItem, BrowserListRequest } from './types';

// 从筛选配置自动生成 parsers
const filterParsers = createFilterParsers(FILTERS_CONFIG);

export default function BrowserManagementPage() {
    const pageList = usePageList<BrowserListItem, BrowserListRequest>(
        BrowserApiService.getPageList,
        DEFAULT_QUERY_PARAMS,
        filterParsers
    );

    const { filters, search, resetFilters, items, loading, pagination, setFilters, refresh } = pageList;

    return (
        <CurdLayout
            pagination={pagination}
            onPageChange={(page) => setFilters({ page })}
            onPageSizeChange={(size) => setFilters({ size, page: 1 })}
            header={<BrowserPageHeader onRefresh={refresh} />}
            filters={
                <FilterLayout<BrowserListRequest>
                    config={FILTERS_CONFIG}
                    values={filters}
                    onSearch={search}
                    onReset={resetFilters}
                    loading={loading}
                />
            }
            table={
                <BrowserTable
                    data={items}
                    loading={loading}
                    onRefresh={refresh}
                />
            }
        />
    );
}
