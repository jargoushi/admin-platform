/**
 * 监控配置管理页面
 *
 * @description
 * 监控配置的完整管理界面
 * 负责数据管理和布局,弹窗逻辑由子组件自治管理
 */

'use client';

import PageContainer from '@/components/layout/page-container';
import { Pagination } from '@/components/table/pagination';
import { usePageList } from '@/hooks/use-page-list';
import { createFilterParsers } from '@/components/shared/filter-layout';
import { MonitorApiService } from '@/service/api/monitor.api';

import {
  MonitorConfigFilters,
  FILTERS_CONFIG
} from './components/MonitorConfigFilters';
import { MonitorConfigPageHeader } from './components/MonitorConfigPageHeader';
import { MonitorConfigTable } from './components/MonitorConfigTable';
import { DEFAULT_QUERY_PARAMS } from './constants';
import type { MonitorConfig, MonitorConfigQueryRequest } from './types';

// 从筛选配置自动生成 parsers
const filterParsers = createFilterParsers(FILTERS_CONFIG);

export default function MonitorConfigManagementPage() {
  const {
    filters,
    search,
    setFilters,
    resetFilters,
    items,
    loading,
    pagination,
    refresh
  } = usePageList<MonitorConfig, MonitorConfigQueryRequest>(
    MonitorApiService.getPageList,
    DEFAULT_QUERY_PARAMS,
    filterParsers
  );

  return (
    <PageContainer scrollable={false}>
      <div className='flex h-[calc(100vh-8rem)] w-full flex-col space-y-4'>
        {/* 页面头部 */}
        <MonitorConfigPageHeader onSuccess={refresh} />

        {/* 筛选区域 */}
        <MonitorConfigFilters
          filters={filters}
          onSearch={search}
          onReset={resetFilters}
        />

        {/* 表格区域 */}
        <div className='flex min-h-0 flex-1 flex-col'>
          <div className='min-h-0'>
            <MonitorConfigTable
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
