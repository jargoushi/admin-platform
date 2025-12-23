/**
 * CURD 页面布局组件 (复合组件模式)
 *
 * @description
 * 提供标准化的 CURD 页面布局结构
 * 使用复合组件模式提供语义化的子组件
 *
 * @example
 * ```tsx
 * <CurdLayout pagination={pagination} onPageChange={...} onPageSizeChange={...}>
 *   <CurdLayout.Header>
 *     <PageHeader ... />
 *   </CurdLayout.Header>
 *   <CurdLayout.Filters>
 *     <Filters ... />
 *   </CurdLayout.Filters>
 *   <CurdLayout.Table>
 *     <DataTable ... />
 *   </CurdLayout.Table>
 * </CurdLayout>
 * ```
 */

'use client';

import React, { ReactNode } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Pagination } from '@/components/table/pagination';
import { PaginationInfo } from '@/lib/http/types';

// ==================== 子组件 ====================

interface HeaderProps {
    children: ReactNode;
}

function Header({ children }: HeaderProps) {
    return <div className='shrink-0'>{children}</div>;
}

interface FiltersProps {
    children: ReactNode;
}

function Filters({ children }: FiltersProps) {
    return <div className='shrink-0'>{children}</div>;
}

interface TableProps {
    children: ReactNode;
}

function Table({ children }: TableProps) {
    return <div className='min-h-0 flex-1 overflow-auto'>{children}</div>;
}

interface PaginationProps {
    /** 分页信息 */
    pagination: PaginationInfo;
    /** 分页变化回调 */
    onPageChange: (page: number) => void;
    /** 每页数量变化回调 */
    onPageSizeChange: (size: number) => void;
}

function CurdPagination({
    pagination,
    onPageChange,
    onPageSizeChange
}: PaginationProps) {
    return (
        <div className='shrink-0'>
            <Pagination
                pagination={pagination}
                onPageChange={onPageChange}
                onPageSizeChange={onPageSizeChange}
            />
        </div>
    );
}

// ==================== 主组件 ====================

interface CurdLayoutProps {
    children: ReactNode;
    /** 是否需要容器滚动 */
    scrollable?: boolean;
    /** 是否为无头模式（不带外层容器和固定高度，用于嵌套场景） */
    headless?: boolean;
}

function CurdLayout({ children, scrollable = false, headless = false }: CurdLayoutProps) {
    const content = (
        <div className={headless ? 'flex w-full flex-col space-y-4' : 'flex h-[calc(100vh-8rem)] w-full flex-col space-y-4'}>
            {children}
        </div>
    );

    if (headless) {
        return content;
    }

    return (
        <PageContainer scrollable={scrollable}>
            {content}
        </PageContainer>
    );
}

// ==================== 导出 ====================

CurdLayout.Header = Header;
CurdLayout.Filters = Filters;
CurdLayout.Table = Table;
CurdLayout.Pagination = CurdPagination;

export { CurdLayout };

