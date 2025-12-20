/**
 * 通用 CRUD 页面布局组件
 */

'use client';

import React from 'react';
import PageContainer from '@/components/layout/page-container';
import { Pagination } from '@/components/table/pagination';
import { PaginationInfo } from '@/lib/http/types';

interface CurdLayoutProps {
    /** 自定义头部内容 (如各种操作按钮) */
    header?: React.ReactNode;
    /** 筛选器组件 */
    filters?: React.ReactNode;
    /** 表格组件 */
    table: React.ReactNode;
    /** 分页信息 (可选，如果不传则不显示分页组件) */
    pagination?: PaginationInfo;
    /** 分页变化回调 */
    onPageChange?: (page: number) => void;
    /** 每页数量变化回调 */
    onPageSizeChange?: (size: number) => void;
    /** 是否需要容器滚动 */
    scrollable?: boolean;
}

export function CurdLayout({
    header,
    filters,
    table,
    pagination,
    onPageChange,
    onPageSizeChange,
    scrollable = false
}: CurdLayoutProps) {
    return (
        <PageContainer scrollable={scrollable}>
            <div className='flex h-[calc(100vh-8rem)] w-full flex-col space-y-4'>
                {/* 头部区域 */}
                {header && <div className='shrink-0'>{header}</div>}

                {/* 筛选区域 */}
                {filters && <div className='shrink-0'>{filters}</div>}

                {/* 表格与分页区域 */}
                <div className='flex min-h-0 flex-1 flex-col'>
                    <div className='min-h-0 flex-1 overflow-hidden'>
                        {table}
                    </div>

                    {pagination && onPageChange && onPageSizeChange && (
                        <div className='shrink-0'>
                            <Pagination
                                pagination={pagination}
                                onPageChange={onPageChange}
                                onPageSizeChange={onPageSizeChange}
                            />
                        </div>
                    )}
                </div>
            </div>
        </PageContainer>
    );
}
