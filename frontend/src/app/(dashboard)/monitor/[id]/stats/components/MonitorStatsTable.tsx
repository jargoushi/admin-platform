'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { DataTable, type Column } from '@/components/table/data-table';
import type { MonitorDailyStats } from '../../../types';

interface MonitorStatsTableProps {
  data: MonitorDailyStats[];
  loading: boolean;
}

export function MonitorStatsTable({ data, loading }: MonitorStatsTableProps) {
  const formatNumber = (num: number): string => {
    if (num >= 10000) return (num / 10000).toFixed(1) + 'w';
    return num.toLocaleString();
  };

  const columns: Column<MonitorDailyStats>[] = [
    {
      key: 'stat_date',
      title: '日期',
      className: 'w-[150px] text-sm',
      render: (value) => format(new Date(value as string), 'yyyy-MM-dd', { locale: zhCN })
    },
    {
      key: 'follower_count',
      title: '粉丝数',
      className: 'text-right text-sm',
      render: (value) => formatNumber(value as number)
    },
    {
      key: 'liked_count',
      title: '获赞数',
      className: 'text-right text-sm',
      render: (value) => formatNumber(value as number)
    },
    {
      key: 'view_count',
      title: '播放量',
      className: 'text-right text-sm',
      render: (value) => formatNumber(value as number)
    },
    {
      key: 'content_count',
      title: '内容数',
      className: 'text-right text-sm',
      render: (value) => formatNumber(value as number)
    }
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      loading={loading}
      rowKey='id'
    />
  );
}
