/**
 * 用户管理页面
 *
 * @description
 * 用户的完整管理界面
 */

'use client';

import { usePageList } from '@/hooks/use-page-list';
import { FilterLayout, createFilterParsers } from '@/components/shared/filter-layout';
import { CurdLayout } from '@/components/shared/curd-layout';
import { UserApiService } from '@/service/api/user.api';

import { UserPageHeader } from './components/UserPageHeader';
import { UserTable } from './components/UserTable';
import { DEFAULT_QUERY_PARAMS, FILTERS_CONFIG } from './constants';
import type { User, UserQueryRequest } from './types';

// 从筛选配置自动生成 parsers
const filterParsers = createFilterParsers(FILTERS_CONFIG);

export default function UserManagementPage() {
  const {
    filters,
    search,
    setFilters,
    resetFilters,
    items,
    loading,
    pagination
  } = usePageList<User, UserQueryRequest>(
    UserApiService.getPageList,
    DEFAULT_QUERY_PARAMS,
    filterParsers
  );

  return (
    <CurdLayout
      pagination={pagination}
      onPageChange={(page) => setFilters({ page })}
      onPageSizeChange={(size) => setFilters({ size, page: 1 })}
      header={<UserPageHeader onSuccess={refresh} />}
      filters={
        <FilterLayout<UserQueryRequest>
          config={FILTERS_CONFIG}
          values={filters}
          onSearch={search}
          onReset={resetFilters}
          loading={loading}
        />
      }
      table={
        <UserTable
          data={items}
          loading={loading}
          onRefresh={refresh}
        />
      }
    />
  );
}
