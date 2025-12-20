/**
 * 账号管理页面
 *
 * @description
 * 账号的完整管理界面
 * 负责数据管理和布局，弹窗逻辑由子组件自治管理
 */

'use client';

import { usePageList } from '@/hooks/use-page-list';
import {
  FilterLayout,
  createFilterParsers
} from '@/components/shared/filter-layout';
import { CurdLayout } from '@/components/shared/curd-layout';
import { AccountApiService } from '@/service/api/account.api';

import { AccountPageHeader } from './components/AccountPageHeader';
import { AccountTable } from './components/AccountTable';
import { DEFAULT_QUERY_PARAMS, FILTERS_CONFIG } from './constants';
import type { Account, AccountQueryRequest } from './types';

// 从筛选配置自动生成 parsers
const filterParsers = createFilterParsers(FILTERS_CONFIG);

export default function AccountManagementPage() {
  const {
    filters,
    search,
    setFilters,
    resetFilters,
    items,
    loading,
    pagination,
    refresh
  } = usePageList<Account, AccountQueryRequest>(
    AccountApiService.getPageList,
    DEFAULT_QUERY_PARAMS,
    filterParsers
  );

  return (
    <CurdLayout
      pagination={pagination}
      onPageChange={(page) => setFilters({ page })}
      onPageSizeChange={(size) => setFilters({ size, page: 1 })}
      header={<AccountPageHeader onSuccess={refresh} />}
      filters={
        <FilterLayout<AccountQueryRequest>
          config={FILTERS_CONFIG}
          values={filters}
          onSearch={search}
          onReset={resetFilters}
          loading={loading}
        />
      }
      table={
        <AccountTable data={items} loading={loading} onRefresh={refresh} />
      }
    />
  );
}
