/**
 * 监控配置数据表格组件
 *
 * @description
 * 显示监控配置列表,支持修改、切换状态、删除等操作
 * 组件内部管理修改弹窗和确认弹窗
 */

'use client';

import { useMemo } from 'react';
import { Edit, Power, Trash2, BarChart3 } from 'lucide-react';
import { DataTable, type Column } from '@/components/table/data-table';
import { ActionDropdown } from '@/components/table/action-dropdown';
import { Action } from '@/types/action';
import type { MonitorConfig } from '../types';
import { MonitorApiService } from '@/service/api/monitor.api';
import { MonitorConfigUpdateForm } from './MonitorConfigUpdateForm';
import { MonitorDailyStatsChart } from './MonitorDailyStatsChart';
import { StatusBadge } from '@/components/shared/status-badge';
import {
  ACTIVE_STATUS_ENUM,
  CHANNEL_ENUM
} from '../constants';

/**
 * 表格组件属性
 */
interface MonitorConfigTableProps {
  data: MonitorConfig[];
  loading?: boolean;
  /** 操作成功后的回调(用于刷新列表) */
  onRefresh?: () => void;
}

export function MonitorConfigTable({
  data,
  loading = false,
  onRefresh
}: MonitorConfigTableProps) {
  /** 列配置 */
  const columns = useMemo<Column<MonitorConfig>[]>(
    () => [
      {
        key: 'id',
        title: 'ID',
        className: 'w-[80px] text-center'
      },
      {
        key: 'channel_code',
        title: '渠道',
        className: 'w-[120px]',
        render: (value: string | number | undefined) => (
          <StatusBadge
            code={value as number}
            enum={CHANNEL_ENUM}
          />
        )
      },
      {
        key: 'account_name',
        title: '账号名称',
        className: 'min-w-[150px]',
        render: (value: string | number | undefined) => (
          <span className='text-sm'>
            {(value as string) || (
              <span className='text-muted-foreground'>未知</span>
            )}
          </span>
        )
      },
      {
        key: 'target_url',
        title: '目标链接',
        className: 'min-w-[200px] max-w-[300px]',
        render: (value: string | number | undefined) => (
          <span className='line-clamp-2 text-sm break-all'>
            {value as string}
          </span>
        )
      },
      {
        key: 'is_active',
        title: '状态',
        className: 'w-[100px] text-center',
        render: (value: string | number | undefined) => (
          <StatusBadge
            code={value as number}
            enum={ACTIVE_STATUS_ENUM}
          />
        )
      },
      {
        key: 'last_run_at',
        title: '上次执行时间',
        className: 'w-[180px]',
        render: (value: string | number | undefined) => (
          <span className='text-sm'>
            {(value as string) || (
              <span className='text-muted-foreground'>未执行</span>
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
        key: 'actions',
        title: '操作',
        className: 'w-[120px] text-center',
        render: (_: unknown, record: MonitorConfig) => {
          const actions: Action<MonitorConfig>[] = [
            {
              key: 'stats',
              label: '查看数据',
              icon: BarChart3,
              dialog: {
                title: '每日数据统计',
                description: '查看监控配置的每日数据趋势',
                component: MonitorDailyStatsChart,
                className: 'sm:max-w-6xl max-h-[90vh] overflow-y-auto'
              }
            },
            {
              key: 'update',
              label: '修改',
              icon: Edit,
              dialog: {
                title: '修改监控配置',
                description: '修改监控目标链接',
                component: MonitorConfigUpdateForm
              }
            },
            {
              key: 'toggle',
              label: record.is_active === 1 ? '禁用' : '启用',
              icon: Power,
              confirm: {
                description: (r) => `确定要${r.is_active === 1 ? '禁用' : '启用'}该监控配置吗？`
              },
              onClick: (r) => MonitorApiService.toggle(Number(r.id), r.is_active === 1 ? 0 : 1)
            },
            {
              key: 'delete',
              label: '删除',
              icon: Trash2,
              className: 'text-destructive focus:text-destructive',
              confirm: {
                description: (r) => `确定要删除该监控配置吗？\n\n账号：${r.account_name || '未知'}\n删除后将无法恢复！`
              },
              onClick: (r) => MonitorApiService.delete(Number(r.id))
            }
          ];

          return <ActionDropdown record={record} actions={actions} onRefresh={onRefresh} />;
        }
      }
    ],
    [onRefresh]
  );

  return (
    <DataTable columns={columns} data={data} loading={loading} rowKey='id' />
  );
}

