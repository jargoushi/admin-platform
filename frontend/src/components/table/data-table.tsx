'use client';

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Column<T> {
  key: string;
  title: string;
  className?: string;
  render?: (value: T[keyof T], record: T, index: number) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  rowKey?: keyof T | ((record: T) => string);
}

export function DataTable<T extends object>({
  columns,
  data,
  loading = false,
  rowKey = 'id' as keyof T
}: DataTableProps<T>) {
  const getRowKey = (record: T, index: number): string => {
    if (typeof rowKey === 'function') {
      return rowKey(record);
    }
    const key = rowKey as keyof T;
    return String(record[key]) || index.toString();
  };

  return (
    <div className='bg-card border-border/50 relative h-full overflow-hidden rounded-xl border shadow-sm'>
      <div className='h-full overflow-auto'>
        <Table className='h-full'>
          <TableHeader className='bg-muted/30 sticky top-0 z-10'>
            <TableRow className='bg-muted/30 hover:bg-muted/30 border-border/50'>
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className={cn(
                    'bg-muted/30 sticky top-0 z-10 font-semibold',
                    column.className
                  )}
                >
                  {column.title}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow className='hover:bg-transparent'>
                <TableCell colSpan={columns.length} className='text-center'>
                  <div className='flex min-h-[400px] flex-col items-center justify-center space-y-4'>
                    <div className='relative'>
                      <Loader2 className='text-primary h-10 w-10 animate-spin' />
                      <div className='bg-primary/20 absolute inset-0 h-10 w-10 animate-ping rounded-full' />
                    </div>
                    <p className='text-muted-foreground text-sm font-medium'>
                      加载中...
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow className='hover:bg-transparent'>
                <TableCell colSpan={columns.length} className='text-center'>
                  <div className='flex min-h-[200px] flex-col items-center justify-center space-y-2'>
                    <div className='text-muted-foreground/50 text-4xl'>📭</div>
                    <p className='text-muted-foreground text-sm'>暂无数据</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              data.map((record, index) => (
                <TableRow
                  key={getRowKey(record, index)}
                  className='hover:bg-muted/40 transition-colors duration-150'
                >
                  {columns.map((column) => (
                    <TableCell key={column.key} className={column.className}>
                      {column.render
                        ? column.render(
                            record[column.key as keyof T],
                            record,
                            index
                          )
                        : (record[column.key as keyof T] as React.ReactNode)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
