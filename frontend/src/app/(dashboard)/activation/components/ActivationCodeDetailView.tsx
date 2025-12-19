'use client';

import React from 'react';

// 引入公共组件和类型
import {
  EntityDetailView,
  FieldConfig
} from '@/components/shared/entity-detail-view';
import { formatDateTime } from '@/lib/date';
import type { ActivationCode } from '../types';
import { ACTIVATION_CODE_TYPES, ACTIVATION_CODE_STATUSES } from '../constants';
import { findDescByCode } from '@/types/common';

/**
 * 激活码详情视图配置
 */
const CODE_DETAIL_CONFIG: FieldConfig<ActivationCode>[] = [
  {
    label: '激活码',
    key: 'activation_code',
    render: (value: unknown) => (
      <code className='font-mono text-lg font-medium break-all'>
        {value as string}
      </code>
    )
  },
  {
    label: '类型',
    key: 'type',
    render: (_, data: ActivationCode) => (
      <span className='text-sm'>
        {findDescByCode(ACTIVATION_CODE_TYPES, data.type)}
      </span>
    )
  },
  {
    label: '状态',
    key: 'status',
    render: (_, data: ActivationCode) => (
      <span className='text-sm'>
        {findDescByCode(ACTIVATION_CODE_STATUSES, data.status)}
      </span>
    )
  },
  {
    label: '创建时间',
    key: 'created_at',
    render: (value: unknown) => formatDateTime(value as string)
  },
  {
    label: '更新时间',
    key: 'updated_at',
    render: (value: unknown) => formatDateTime(value as string)
  },
  {
    label: '过期时间',
    key: 'expire_time',
    render: (_: unknown, data: ActivationCode) => {
      // 匹配原始逻辑:类型 3 为永久有效
      if (data.type === 3) return <span className='text-sm'>永久有效</span>;
      return (
        <span className='text-sm'>{formatDateTime(data.expire_time)}</span>
      );
    }
  },
  {
    label: '分发时间',
    key: 'distributed_at',
    render: (value: unknown) => formatDateTime(value as string)
  },
  {
    label: '激活时间',
    key: 'activated_at',
    render: (value: unknown) => formatDateTime(value as string)
  }
];

interface ActivationCodeDetailViewProps {
  /** 详情数据 */
  data: ActivationCode | null;
}

/**
 * 激活码详情视图组件
 */
export function ActivationCodeDetailView({
  data
}: ActivationCodeDetailViewProps) {
  if (!data) {
    return null;
  }

  return <EntityDetailView data={data} config={CODE_DETAIL_CONFIG} />;
}
