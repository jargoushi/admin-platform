/**
 * 激活码数据表格组件
 *
 * @description
 * 显示激活码列表,支持复制、激活、作废、查看详情等操作
 * 组件内部管理详情弹窗和确认弹窗
 */

'use client';

import { useMemo, useCallback } from 'react';
import { Check, X, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// 引入弹窗基础设施
import { useGenericDialogs } from '@/hooks/use-generic-dialogs';
import { useConfirmation } from '@/hooks/use-confirmation';

import { DataTable, type Column } from '@/components/table/data-table';
import {
  ActionDropdown,
  type ActionItem
} from '@/components/table/action-dropdown';
import type { ActivationCode } from '../types';
import { ACTIVATION_CODE_TYPES, ACTIVATION_CODE_STATUSES } from '../constants';
import { findDescByCode } from '@/types/common';
import { ActivationApiService } from '@/service/api/activation.api';
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
  // 管理详情弹窗
  const { openDialog, DialogsContainer } = useGenericDialogs<ActivationCode>({
    dialogs: {
      detail: {
        title: '激活码详情',
        component: ActivationCodeDetailView,
        className: 'sm:max-w-[600px]'
      }
    }
  });

  // 管理确认弹窗
  const { confirm, ConfirmDialog } = useConfirmation();

  /**
   * 处理查看详情
   */
  const handleViewDetail = useCallback(
    async (code: ActivationCode) => {
      const detail = await ActivationApiService.getDetail(code.activation_code);
      if (detail) {
        openDialog('detail', detail);
      }
    },
    [openDialog]
  );

  /**
   * 处理激活操作
   */
  const handleActivate = useCallback(
    (code: ActivationCode) => {
      confirm({
        description: `确定要激活"${code.activation_code}" 吗？`,
        onConfirm: async () => {
          await ActivationApiService.activate(code.activation_code);
          onRefresh?.();
        }
      });
    },
    [confirm, onRefresh]
  );

  /**
   * 处理作废操作
   */
  const handleInvalidate = useCallback(
    (code: ActivationCode) => {
      confirm({
        description: `确定要作废激活码 "${code.activation_code}" 吗？\n\n作废后将无法恢复！`,
        onConfirm: async () => {
          await ActivationApiService.invalidate({
            activation_code: code.activation_code
          });
          onRefresh?.();
        }
      });
    },
    [confirm, onRefresh]
  );
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
        render: (_, record) => {
          const typeColors: Record<
            number,
            'secondary' | 'info' | 'warning' | 'default'
          > = {
            0: 'secondary', // 日卡
            1: 'info', // 月卡
            2: 'warning', // 年卡
            3: 'default' // 永久卡
          };
          return (
            <Badge variant={typeColors[record.type] || 'secondary'}>
              {findDescByCode(ACTIVATION_CODE_TYPES, record.type)}
            </Badge>
          );
        }
      },
      {
        key: 'status',
        title: '状态',
        className: 'w-[100px]',
        render: (_, record) => {
          const statusColors: Record<
            number,
            'secondary' | 'info' | 'success' | 'destructive'
          > = {
            0: 'secondary', // 未使用
            1: 'info', // 已分发
            2: 'success', // 已激活
            3: 'destructive' // 作废
          };
          return (
            <Badge variant={statusColors[record.status] || 'secondary'}>
              {findDescByCode(ACTIVATION_CODE_STATUSES, record.status)}
            </Badge>
          );
        }
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
          const actions: ActionItem[] = [];

          if (record.status === 1) {
            actions.push({
              key: 'activate',
              label: '激活',
              icon: <Check className='mr-2 h-4 w-4' />,
              onClick: () => handleActivate(record)
            });
          }

          if (record.status === 1 || record.status === 2) {
            actions.push({
              key: 'invalidate',
              label: '作废',
              icon: <X className='mr-2 h-4 w-4' />,
              onClick: () => handleInvalidate(record)
            });
          }

          actions.push({
            key: 'detail',
            label: '详情',
            icon: <Eye className='mr-2 h-4 w-4' />,
            onClick: () => handleViewDetail(record)
          });

          return <ActionDropdown actions={actions} />;
        }
      }
    ],
    [handleActivate, handleInvalidate, handleViewDetail]
  );

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        rowKey='activation_code'
      />

      {/* 弹窗容器 */}
      <DialogsContainer />
      <ConfirmDialog />
    </>
  );
}
