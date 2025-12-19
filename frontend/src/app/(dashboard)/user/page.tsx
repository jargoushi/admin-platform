/**
 * 用户管理页面
 *
 * @description
 * 用户的完整管理界面
 */

'use client';

import PageContainer from '@/components/layout/page-container';
import { Pagination } from '@/components/table/pagination';
import { usePageList } from '@/hooks/use-page-list';
import { createFilterParsers } from '@/components/shared/filter-layout';
import { UserApiService } from '@/service/api/user.api';

import { UserFilters, FILTERS_CONFIG } from './components/UserFilters';
import { UserPageHeader } from './components/UserPageHeader';
import { UserTable } from './components/UserTable';
import { DEFAULT_QUERY_PARAMS } from './constants';
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
    <PageContainer scrollable={false}>
      <div className='flex h-[calc(100vh-8rem)] w-full flex-col space-y-4'>
        {/* 页面头部 */}
        <UserPageHeader />

        {/* 筛选区域 */}
        <UserFilters
          filters={filters}
          onSearch={search}
          onReset={resetFilters}
        />

        {/* 表格区域 */}
        <div className='flex min-h-0 flex-1 flex-col'>
          <div className='min-h-0'>
            <UserTable data={items} loading={loading} />
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
