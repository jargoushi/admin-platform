/**
 * 任务管理页面
 *
 * @description
 * 任务的完整管理界面
 * 负责数据管理和布局
 */

'use client';

import { usePageList } from '@/hooks/use-page-list';
import {
  FilterLayout,
  createFilterParsers
} from '@/components/shared/filter-layout';
import { CurdLayout } from '@/components/shared/curd-layout';
import { TaskApiService } from '@/service/api/task.api';

import { MonitorTaskTable } from './components/MonitorTaskTable';
import { DEFAULT_QUERY_PARAMS, FILTERS_CONFIG } from './constants';
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
    pagination,
    refresh
  } = usePageList<MonitorTask, MonitorTaskQueryRequest>(
    TaskApiService.getPageList,
    DEFAULT_QUERY_PARAMS,
    filterParsers
  );

  return (
    <CurdLayout>
      <CurdLayout.Filters>
        <FilterLayout<MonitorTaskQueryRequest>
          config={FILTERS_CONFIG}
          values={filters}
          onSearch={search}
          onReset={resetFilters}
          loading={loading}
        />
      </CurdLayout.Filters>

      <CurdLayout.Table>
        <MonitorTaskTable data={items} loading={loading} onRefresh={refresh} />
      </CurdLayout.Table>

      <CurdLayout.Pagination
        pagination={pagination}
        onPageChange={(page) => setFilters({ page })}
        onPageSizeChange={(size) => setFilters({ size, page: 1 })}
      />
    </CurdLayout>
  );
}
