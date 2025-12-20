/**
 * 监控配置管理页面
 *
 * @description
 * 监控配置的完整管理界面
 * 负责数据管理和布局,弹窗逻辑由子组件自治管理
 */

'use client';

import { usePageList } from '@/hooks/use-page-list';
import {
  FilterLayout,
  createFilterParsers
} from '@/components/shared/filter-layout';
import { CurdLayout } from '@/components/shared/curd-layout';
import { MonitorApiService } from '@/service/api/monitor.api';

import { MonitorConfigPageHeader } from './components/MonitorConfigPageHeader';
import { MonitorConfigTable } from './components/MonitorConfigTable';
import { DEFAULT_QUERY_PARAMS, FILTERS_CONFIG } from './constants';
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
    <CurdLayout
      pagination={pagination}
      onPageChange={(page) => setFilters({ page })}
      onPageSizeChange={(size) => setFilters({ size, page: 1 })}
    >
      <CurdLayout.Header>
        <MonitorConfigPageHeader onSuccess={refresh} />
      </CurdLayout.Header>

      <CurdLayout.Filters>
        <FilterLayout<MonitorConfigQueryRequest>
          config={FILTERS_CONFIG}
          values={filters}
          onSearch={search}
          onReset={resetFilters}
          loading={loading}
        />
      </CurdLayout.Filters>

      <CurdLayout.Table>
        <MonitorConfigTable
          data={items}
          loading={loading}
          onRefresh={refresh}
        />
      </CurdLayout.Table>
    </CurdLayout>
  );
}
