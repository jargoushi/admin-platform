'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { generatePageNumbers } from '@/lib/pagination';
import type { PaginationInfo } from '@/lib/http/types';

interface PaginationProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  pageSizeOptions?: number[];
}

export function Pagination({
  pagination,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 30, 50, 100]
}: PaginationProps) {
  const { page, size, total, pages } = pagination;
  const [jumpPage, setJumpPage] = useState(String(page));

  /**
   * 同步当前页码到输入框
   */
  useEffect(() => {
    setJumpPage(String(page));
  }, [page]);

  /**
   * 生成页码数组
   * 智能显示当前页附近的页码，用省略号表示跳过的页码
   */
  const pageNumbers = generatePageNumbers({
    currentPage: page,
    totalPages: pages
  });

  /**
   * 处理页码输入变化（只允许输入数字）
   */
  const handleJumpPageChange = (value: string) => {
    // 只允许输入数字
    if (value === '' || /^\d+$/.test(value)) {
      setJumpPage(value);
    }
  };

  /**
   * 处理输入框回车
   * 超过最大页码时自动跳转到最大页码
   */
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') {
      return;
    }

    const pageNumber = parseInt(jumpPage);
    if (pageNumber >= 1) {
      const targetPage = Math.min(pageNumber, pages);
      if (targetPage !== page) {
        onPageChange(targetPage);
      }
    }
  };

  return (
    <div className='border-border/50 mt-4 border-t pt-4'>
      <div className='flex items-center justify-between'>
        {/* 左侧：总数和每页显示 */}
        <div className='flex items-center gap-4'>
          <span className='text-muted-foreground text-sm'>
            共{' '}
            <span className='text-primary font-semibold tabular-nums'>
              {total}
            </span>{' '}
            条记录
          </span>
          <div className='flex items-center gap-2'>
            <span className='text-muted-foreground text-sm'>每页显示</span>
            <Select
              value={String(size)}
              onValueChange={(value) => onPageSizeChange(parseInt(value))}
            >
              <SelectTrigger className='h-8 w-[75px] cursor-pointer text-sm'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((pageSize) => (
                  <SelectItem
                    key={pageSize}
                    value={String(pageSize)}
                    className='cursor-pointer'
                  >
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className='text-muted-foreground text-sm'>条</span>
          </div>
        </div>

        {/* 右侧：分页控制 */}
        <div className='flex items-center gap-3'>
          {/* 上一页 */}
          <Button
            variant='outline'
            size='sm'
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className='h-8 cursor-pointer'
          >
            上一页
          </Button>

          {/* 页码列表 */}
          <div className='flex items-center gap-1'>
            {pageNumbers.map((pageNum, index) => {
              if (pageNum === '...') {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className='text-muted-foreground flex h-8 w-8 items-center justify-center text-sm'
                  >
                    •••
                  </span>
                );
              }

              const isCurrentPage = pageNum === page;
              return (
                <Button
                  key={pageNum}
                  variant={isCurrentPage ? 'default' : 'outline'}
                  size='sm'
                  onClick={() => onPageChange(pageNum as number)}
                  disabled={isCurrentPage}
                  className={`h-8 w-8 cursor-pointer p-0 tabular-nums ${
                    isCurrentPage
                      ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                      : 'hover:bg-accent hover:shadow-sm'
                  }`}
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>

          {/* 下一页 */}
          <Button
            variant='outline'
            size='sm'
            onClick={() => onPageChange(page + 1)}
            disabled={page >= pages}
            className='h-8 cursor-pointer'
          >
            下一页
          </Button>

          {/* 跳转到指定页 */}
          <div className='flex items-center gap-2'>
            <span className='text-muted-foreground text-sm'>跳至</span>
            <Input
              type='text'
              value={jumpPage}
              onChange={(e) => handleJumpPageChange(e.target.value)}
              onKeyDown={handleKeyPress}
              className='h-8 w-16 text-center'
            />
            <span className='text-muted-foreground text-sm'>页</span>
          </div>
        </div>
      </div>
    </div>
  );
}
