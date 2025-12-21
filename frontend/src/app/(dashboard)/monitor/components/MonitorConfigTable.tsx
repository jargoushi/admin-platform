/**
 * 监控配置数据表格组件
 *
 * @description
 * 显示监控配置列表,支持修改、切换状态、删除等操作
 * 组件内部管理修改弹窗和确认弹窗
 */

'use client';

import { useMemo, useCallback } from 'react';
import { Edit, Power, Trash2, BarChart3 } from 'lucide-react';

// 引入弹窗基础设施
import { useDialog } from '@/contexts/dialog-provider';
import { useConfirmation } from '@/contexts/confirmation-provider';

import { DataTable, type Column } from '@/components/table/data-table';
import {
  ActionDropdown,
  type ActionItem
} from '@/components/table/action-dropdown';
import type { MonitorConfig } from '../types';
import { findDescByCode } from '@/types/common';
import { MonitorApiService } from '@/service/api/monitor.api';
import { MonitorConfigUpdateForm } from './MonitorConfigUpdateForm';
import { MonitorDailyStatsChart } from './MonitorDailyStatsChart';
import { StatusBadge } from '@/components/shared/status-badge';
import {
  ACTIVE_STATUS_CONFIG,
  CHANNEL_TYPES
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
  // 全局弹窗
  const { open } = useDialog();

  // 管理确认弹窗
  const { confirm } = useConfirmation();

  /**
   * 处理修改操作
   */
  const handleUpdate = useCallback(
    (config: MonitorConfig) => {
      open({
        title: '修改监控配置',
        description: '修改监控目标链接',
        component: MonitorConfigUpdateForm,
        data: config,
        onClose: () => onRefresh?.()
      });
    },
    [open, onRefresh]
  );

  /**
   * 处理查看数据统计
   */
  const handleViewStats = useCallback(
    (config: MonitorConfig) => {
      open({
        title: '每日数据统计',
        description: '查看监控配置的每日数据趋势',
        component: MonitorDailyStatsChart,
        data: config,
        className: 'sm:max-w-6xl max-h-[90vh] overflow-y-auto'
      });
    },
    [open]
  );

  // ... (handleToggle, handleDelete, columns 渲染其余逻辑保持不变)

  /**
   * 处理切换状态操作
   */
  const handleToggle = useCallback(
    (config: MonitorConfig) => {
      const newStatus = config.is_active === 1 ? 0 : 1;
      const statusText = newStatus === 1 ? '启用' : '禁用';

      confirm({
        description: `确定要${statusText}该监控配置吗？`,
        onConfirm: async () => {
          await MonitorApiService.toggle(Number(config.id), newStatus);
          onRefresh?.();
        }
      });
    },
    [confirm, onRefresh]
  );

  /**
   * 处理删除操作
   */
  const handleDelete = useCallback(
    (config: MonitorConfig) => {
      confirm({
        description: `确定要删除该监控配置吗？\n\n账号：${config.account_name || '未知'}\n删除后将无法恢复！`,
        onConfirm: async () => {
          await MonitorApiService.delete(Number(config.id));
          onRefresh?.();
        }
      });
    },
    [confirm, onRefresh]
  );

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
        render: (_, record) => (
          <span className='text-sm'>
            {findDescByCode(CHANNEL_TYPES, record.channel_code)}
          </span>
        )
      },
      {
        key: 'account_name',
        title: '账号名称',
        className: 'min-w-[150px]',
        render: (_, record) => (
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
        render: (_, record) => (
          <span className='line-clamp-2 text-sm break-all'>
            {record.target_url}
          </span>
        )
      },
      {
        key: 'is_active',
        title: '状态',
        className: 'w-[100px] text-center',
        render: (_, record) => (
          <StatusBadge
            code={record.is_active}
            configMap={ACTIVE_STATUS_CONFIG}
          />
        )
      },
      {
        key: 'last_run_at',
        title: '上次执行时间',
        className: 'w-[180px]',
        render: (_, record) => (
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
          const actions: ActionItem[] = [
            {
              key: 'stats',
              label: '查看数据',
              icon: <BarChart3 className='mr-2 h-4 w-4' />,
              onClick: () => handleViewStats(record)
            },
            {
              key: 'update',
              label: '修改',
              icon: <Edit className='mr-2 h-4 w-4' />,
              onClick: () => handleUpdate(record)
            },
            {
              key: 'toggle',
              label: record.is_active === 1 ? '禁用' : '启用',
              icon: <Power className='mr-2 h-4 w-4' />,
              onClick: () => handleToggle(record)
            },
            {
              key: 'delete',
              label: '删除',
              icon: <Trash2 className='mr-2 h-4 w-4' />,
              onClick: () => handleDelete(record),
              className: 'text-destructive focus:text-destructive'
            }
          ];

          return <ActionDropdown actions={actions} />;
        }
      }
    ],
    [handleViewStats, handleUpdate, handleToggle, handleDelete]
  );

  return (
    <DataTable columns={columns} data={data} loading={loading} rowKey='id' />
  );
}

