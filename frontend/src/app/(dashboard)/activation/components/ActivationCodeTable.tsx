/**
 * 激活码数据表格组件
 *
 * @description
 * 显示激活码列表,支持复制、激活、作废、查看详情等操作
 * 组件内部管理详情弹窗和确认弹窗
 */

'use client';

import { useMemo } from 'react';
import { Check, X, Eye } from 'lucide-react';
import { useTableActions } from '@/hooks/use-table-actions';
import { DataTable, type Column } from '@/components/table/data-table';
import {
  ActionDropdown,
  type ActionItem
} from '@/components/table/action-dropdown';
import type { ActivationCode } from '../types';
import {
  ACTIVATION_STATUS_ENUM,
  ACTIVATION_TYPE_ENUM
} from '../constants';
import { ActivationApiService } from '@/service/api/activation.api';
import { StatusBadge } from '@/components/shared/status-badge';
import { ActivationCodeDetailView } from './ActivationCodeDetailView';

/**
 * 表格组件属性
 */
interface ActivationCodeTableProps {
  data: ActivationCode[];
  loading?: boolean;
  /** 操作成功后的回调(用于刷新列表) */
  onRefresh?: () => void;
}

export function ActivationCodeTable({
  data,
  loading = false,
  onRefresh
}: ActivationCodeTableProps) {
  const { openDialog } = useTableActions({ onRefresh });

  /** 列配置 */
  const columns = useMemo<Column<ActivationCode>[]>(
    () => [
      {
        key: 'activation_code',
        title: '激活码',
        className: 'min-w-[280px] font-mono font-medium'
      },
      {
        key: 'type',
        title: '类型',
        className: 'w-[100px]',
        render: (_, record) => (
          <StatusBadge
            code={record.type}
            enum={ACTIVATION_TYPE_ENUM}
          />
        )
      },
      {
        key: 'status',
        title: '状态',
        className: 'w-[100px]',
        render: (_, record) => (
          <StatusBadge
            code={record.status}
            enum={ACTIVATION_STATUS_ENUM}
          />
        )
      },
      {
        key: 'distributed_at',
        title: '分发时间',
        className: 'w-[180px]'
      },
      {
        key: 'activated_at',
        title: '激活时间',
        className: 'w-[180px]'
      },
      {
        key: 'expire_time',
        title: '过期时间',
        className: 'w-[180px]',
        render: (_: unknown, record: ActivationCode) => {
          if (record.type === 3) {
            return (
              <span className='text-muted-foreground text-sm'>永久有效</span>
            );
          }
          return <span className='text-sm'>{record.expire_time}</span>;
        }
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
        render: (_: unknown, record: ActivationCode) => {
          const actions: ActionItem<ActivationCode>[] = [
            {
              key: 'activate',
              label: '激活',
              icon: <Check className='h-4 w-4' />,
              hidden: (r) => r.status !== 1,
              confirm: {
                description: (r) => `确定要激活"${r.activation_code}" 吗？`
              },
              onClick: async (r) => { await ActivationApiService.activate(r.activation_code); }
            },
            {
              key: 'invalidate',
              label: '作废',
              icon: <X className='h-4 w-4' />,
              hidden: (r) => r.status !== 1 && r.status !== 2,
              confirm: {
                description: (r) => `确定要作废激活码 "${r.activation_code}" 吗？\n\n作废后将无法恢复！`
              },
              onClick: async (r) => { await ActivationApiService.invalidate({ activation_code: r.activation_code }); }
            },
            {
              key: 'detail',
              label: '详情',
              icon: <Eye className='h-4 w-4' />,
              onClick: async (r) => {
                const detail = await ActivationApiService.getDetail(r.activation_code);
                if (detail) {
                  openDialog({
                    title: '激活码详情',
                    component: ActivationCodeDetailView,
                    data: detail,
                    className: 'sm:max-w-[600px]'
                  });
                }
              }
            }
          ];

          return <ActionDropdown record={record} actions={actions} />;
        }
      }
    ],
    [openDialog]
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      loading={loading}
      rowKey='activation_code'
    />
  );
}
