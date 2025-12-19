/**
 * 任务管理页面
 *
 * @description
 * 任务的完整管理界面
 * 负责数据管理和布局
 */

'use client';

import PageContainer from '@/components/layout/page-container';
import { Pagination } from '@/components/table/pagination';
import { usePageList } from '@/hooks/use-page-list';
import { createFilterParsers } from '@/components/shared/filter-layout';
import { TaskApiService } from '@/service/api/task.api';

import {
  MonitorTaskFilters,
  FILTERS_CONFIG
} from './components/MonitorTaskFilters';
import { MonitorTaskTable } from './components/MonitorTaskTable';
import { DEFAULT_QUERY_PARAMS } from './constants';
import type { MonitorTask, MonitorTaskQueryRequest } from './types';

// 从筛选配置自动生成 parsers
const filterParsers = createFilterParsers(FILTERS_CONFIG);

export default function MonitorTaskManagementPage() {
  const {
    filters,
    search,
    setFilters,
    resetFilters,
    items,
    loading,
    pagination
  } = usePageList<MonitorTask, MonitorTaskQueryRequest>(
    TaskApiService.getPageList,
    DEFAULT_QUERY_PARAMS,
    filterParsers
  );

  return (
    <PageContainer scrollable={false}>
      <div className='flex h-[calc(100vh-8rem)] w-full flex-col space-y-4'>
        {/* 筛选区域 */}
        <MonitorTaskFilters
          filters={filters}
          onSearch={search}
          onReset={resetFilters}
        />

        {/* 表格区域 */}
        <div className='flex min-h-0 flex-1 flex-col'>
          <div className='min-h-0'>
            <MonitorTaskTable data={items} loading={loading} />
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
