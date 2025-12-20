/**
 * 浏览器管理页面
 */

'use client';

import PageContainer from '@/components/layout/page-container';
import { Pagination } from '@/components/table/pagination';
import { usePageList } from '@/hooks/use-page-list';
import { createFilterParsers } from '@/components/shared/filter-layout';
import { BrowserApiService } from '@/service/api/browser.api';

import { BrowserFilters, FILTERS_CONFIG } from './components/BrowserFilters';
import { BrowserPageHeader } from './components/BrowserPageHeader';
import { BrowserTable } from './components/BrowserTable';
import { DEFAULT_QUERY_PARAMS } from './constants';
import type { BrowserListItem, BrowserListRequest } from './types';

// 从筛选配置自动生成 parsers
const filterParsers = createFilterParsers(FILTERS_CONFIG);

export default function BrowserManagementPage() {
    const {
        filters,
        search,
        setFilters,
        resetFilters,
        items,
        loading,
        pagination,
        refresh
    } = usePageList<BrowserListItem, BrowserListRequest>(
        BrowserApiService.getPageList,
        DEFAULT_QUERY_PARAMS,
        filterParsers
    );

    return (
        <PageContainer scrollable={false}>
            <div className='flex h-[calc(100vh-8rem)] w-full flex-col space-y-4'>
                {/* 页面头部 */}
                <BrowserPageHeader onRefresh={refresh} />

                {/* 筛选区域 */}
                <BrowserFilters
                    filters={filters}
                    onSearch={search}
                    onReset={resetFilters}
                />

                {/* 表格区域 */}
                <div className='flex min-h-0 flex-1 flex-col'>
                    <div className='min-h-0'>
                        <BrowserTable
                            data={items}
                            loading={loading}
                            onRefresh={refresh}
                        />
                    </div>

                    <div className='shrink-0 pt-4'>
                        <Pagination
                            pagination={pagination}
                            onPageChange={(page) => setFilters({ page })}
                            onPageSizeChange={(size) => setFilters({ size, page: 1 })}
                        />
                    </div>
                </div>
            </div>
        </PageContainer>
    );
}
