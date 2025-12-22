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
import { useTableActions } from '@/hooks/use-table-actions';
import { DataTable, type Column } from '@/components/table/data-table';
import {
  ActionDropdown,
  type ActionItem
} from '@/components/table/action-dropdown';
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
  const { openDialog } = useTableActions({ onRefresh });

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
        render: (_: unknown, record: MonitorConfig) => (
          <StatusBadge
            code={record.channel_code}
            enum={CHANNEL_ENUM}
          />
        )
      },
      {
        key: 'account_name',
        title: '账号名称',
        className: 'min-w-[150px]',
        render: (_: unknown, record: MonitorConfig) => (
          <span className='text-sm'>
            {record.account_name || (
              <span className='text-muted-foreground'>未知</span>
            )}
          </span>
        )
      },
      {
        key: 'target_url',
        title: '目标链接',
        className: 'min-w-[200px] max-w-[300px]',
        render: (_: unknown, record: MonitorConfig) => (
          <span className='line-clamp-2 text-sm break-all'>
            {record.target_url}
          </span>
        )
      },
      {
        key: 'is_active',
        title: '状态',
        className: 'w-[100px] text-center',
        render: (_: unknown, record: MonitorConfig) => (
          <StatusBadge
            code={record.is_active}
            enum={ACTIVE_STATUS_ENUM}
          />
        )
      },
      {
        key: 'last_run_at',
        title: '上次执行时间',
        className: 'w-[180px]',
        render: (_: unknown, record: MonitorConfig) => (
          <span className='text-sm'>
            {record.last_run_at || (
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
          const actions: ActionItem<MonitorConfig>[] = [
            {
              key: 'stats',
              label: '查看数据',
              icon: <BarChart3 className='mr-2 h-4 w-4' />,
              onClick: (r) => openDialog({
                title: '每日数据统计',
                description: '查看监控配置的每日数据趋势',
                component: MonitorDailyStatsChart,
                data: r,
                className: 'sm:max-w-6xl max-h-[90vh] overflow-y-auto'
              })
            },
            {
              key: 'update',
              label: '修改',
              icon: <Edit className='mr-2 h-4 w-4' />,
              onClick: (r) => openDialog({
                title: '修改监控配置',
                description: '修改监控目标链接',
                component: MonitorConfigUpdateForm,
                data: r
              })
            },
            {
              key: 'toggle',
              label: record.is_active === 1 ? '禁用' : '启用',
              icon: <Power className='mr-2 h-4 w-4' />,
              confirm: {
                description: (r) => `确定要${r.is_active === 1 ? '禁用' : '启用'}该监控配置吗？`
              },
              onClick: async (r) => { await MonitorApiService.toggle(Number(r.id), r.is_active === 1 ? 0 : 1); }
            },
            {
              key: 'delete',
              label: '删除',
              icon: <Trash2 className='mr-2 h-4 w-4' />,
              className: 'text-destructive focus:text-destructive',
              confirm: {
                description: (r) => `确定要删除该监控配置吗？\n\n账号：${r.account_name || '未知'}\n删除后将无法恢复！`
              },
              onClick: async (r) => { await MonitorApiService.delete(Number(r.id)); }
            }
          ];

          return <ActionDropdown record={record} actions={actions} />;
        }
      }
    ],
    [openDialog]
  );

  return (
    <DataTable columns={columns} data={data} loading={loading} rowKey='id' />
  );
}

