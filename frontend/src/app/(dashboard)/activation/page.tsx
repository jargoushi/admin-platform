/**
 * 激活码管理页面
 *
 * @description
 * 激活码的完整管理界面
 * 负责数据管理和布局,弹窗逻辑由子组件自治管理
 */

'use client';

import { usePageList } from '@/hooks/use-page-list';
import {
  FilterLayout,
  createFilterParsers
} from '@/components/form/filter-layout';
import { CurdLayout } from '@/components/layout/curd-layout';
import { ActivationApiService } from '@/service/api/activation.api';

import { ActivationCodePageHeader } from './components/ActivationCodePageHeader';
import { ActivationCodeTable } from './components/ActivationCodeTable';
import { DEFAULT_QUERY_PARAMS, FILTERS_CONFIG } from './constants';
import type { ActivationCode, ActivationCodeQueryRequest } from './types';

// 从筛选配置自动生成 parsers
const filterParsers = createFilterParsers(FILTERS_CONFIG);

export default function ActivationCodeManagementPage() {
  const {
    filters,
    search,
    setFilters,
    resetFilters,
    items,
    loading,
    pagination,
    refresh
  } = usePageList<ActivationCode, ActivationCodeQueryRequest>(
    ActivationApiService.getPageList,
    DEFAULT_QUERY_PARAMS,
    filterParsers
  );

  return (
    <CurdLayout>
      <CurdLayout.Header>
        <ActivationCodePageHeader onSuccess={refresh} />
      </CurdLayout.Header>

      <CurdLayout.Filters>
        <FilterLayout<ActivationCodeQueryRequest>
          config={FILTERS_CONFIG}
          values={filters}
          onSearch={search}
          onReset={resetFilters}
          loading={loading}
        />
      </CurdLayout.Filters>

      <CurdLayout.Table>
        <ActivationCodeTable
          data={items}
          loading={loading}
          onRefresh={refresh}
        />
      </CurdLayout.Table>

      <CurdLayout.Pagination
        pagination={pagination}
        onPageChange={(page) => setFilters({ page })}
        onPageSizeChange={(size) => setFilters({ size, page: 1 })}
      />
    </CurdLayout>
  );
}
