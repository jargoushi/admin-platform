/**
 * 任务数据表格组件
 *
 * @description
 * 显示任务列表,支持查看任务详情
 */

'use client';

import { useMemo } from 'react';
import { DataTable, type Column } from '@/components/table/data-table';
import type { MonitorTask } from '../types';
import { CHANNEL_TYPES, TASK_TYPES, TASK_STATUSES } from '../constants';
import { findDescByCode } from '@/types/common';
import { Badge } from '@/components/ui/badge';

/**
 * 表格组件属性
 */
interface MonitorTaskTableProps {
  data: MonitorTask[];
  loading?: boolean;
}

export function MonitorTaskTable({
  data,
  loading = false
}: MonitorTaskTableProps) {
  /**
   * 根据任务状态返回对应的 Badge 样式
   */
  const getStatusVariant = (status: number) => {
    switch (status) {
      case 0:
        return 'secondary'; // 待执行
      case 1:
        return 'default'; // 进行中
      case 2:
        return 'default'; // 成功
      case 3:
        return 'destructive'; // 失败
      default:
        return 'secondary';
    }
  };

  /** 列配置 */
  const columns = useMemo<Column<MonitorTask>[]>(
    () => [
      {
        key: 'id',
        title: '任务ID',
        className: 'w-[100px] text-center'
      },
      {
        key: 'channel_code',
        title: '渠道',
        className: 'w-[120px]',
        render: (_, record) => (
          <span className='text-sm'>
            {findDescByCode(CHANNEL_TYPES, record.channel_code)}
          </span>
        )
      },
      {
        key: 'task_type',
        title: '任务类型',
        className: 'w-[140px]',
        render: (_, record) => (
          <span className='text-sm'>
            {findDescByCode(TASK_TYPES, record.task_type)}
          </span>
        )
      },
      {
        key: 'biz_id',
        title: '业务ID',
        className: 'w-[100px] text-center'
      },
      {
        key: 'task_status',
        title: '任务状态',
        className: 'w-[120px] text-center',
        render: (_, record) => (
          <Badge variant={getStatusVariant(record.task_status)}>
            {findDescByCode(TASK_STATUSES, record.task_status)}
          </Badge>
        )
      },
      {
        key: 'schedule_date',
        title: '调度日期',
        className: 'w-[120px]'
      },
      {
        key: 'duration_ms',
        title: '耗时',
        className: 'w-[100px] text-right',
        render: (_, record) => (
          <span className='text-sm'>
            {record.duration_ms > 0 ? `${record.duration_ms}ms` : '-'}
          </span>
        )
      },
      {
        key: 'error_msg',
        title: '错误信息',
        className: 'min-w-[200px] max-w-[300px]',
        render: (_, record) => (
          <span className='line-clamp-2 text-sm break-all'>
            {record.error_msg || (
              <span className='text-muted-foreground'>-</span>
            )}
          </span>
        )
      },
      {
        key: 'created_at',
        title: '创建时间',
        className: 'w-[180px]'
      },
      {
        key: 'started_at',
        title: '开始时间',
        className: 'w-[180px]',
        render: (_, record) => (
          <span className='text-sm'>
            {record.started_at || (
              <span className='text-muted-foreground'>-</span>
            )}
          </span>
        )
      },
      {
        key: 'finished_at',
        title: '结束时间',
        className: 'w-[180px]',
        render: (_, record) => (
          <span className='text-sm'>
            {record.finished_at || (
              <span className='text-muted-foreground'>-</span>
            )}
          </span>
        )
      }
    ],
    []
  );

  return (
    <DataTable columns={columns} data={data} loading={loading} rowKey='id' />
  );
}
