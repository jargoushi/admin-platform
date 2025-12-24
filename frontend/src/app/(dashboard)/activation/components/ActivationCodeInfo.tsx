/**
 * 激活码信息展示组件
 *
 * @description
 * 使用 InfoList 体系，提供简洁的激活码详情展示。
 */

'use client';

import React from 'react';
import {
  InfoList,
  type InfoSection
} from '@/components/data/info-list';
import { formatDateTime } from '@/lib/date';
import type { ActivationCode } from '../types';
import {
  ACTIVATION_STATUS_ENUM,
  ACTIVATION_TYPE_ENUM
} from '../constants';
import { type DialogComponentProps } from '@/contexts/dialog-provider';

export function ActivationCodeInfo({
  data
}: DialogComponentProps<ActivationCode>) {
  if (!data) return null;

  const sections: InfoSection<ActivationCode>[] = [
    {
      title: '基本信息',
      items: [
        {
          label: '激活码',
          key: 'activation_code',
          span: 2,
          render: (value) => (
            <code className='bg-muted rounded px-1.5 py-0.5 font-mono text-base font-semibold text-primary'>
              {value}
            </code>
          )
        },
        {
          label: '类型',
          key: 'type',
          render: (_, d) => ACTIVATION_TYPE_ENUM.getLabel(d.type)
        },
        {
          label: '状态',
          key: 'status',
          render: (_, d) => ACTIVATION_STATUS_ENUM.getLabel(d.status)
        }
      ]
    },
    {
      title: '时间节点',
      items: [
        {
          label: '创建时间',
          key: 'created_at',
          render: (v) => formatDateTime(v)
        },
        {
          label: '更新时间',
          key: 'updated_at',
          render: (v) => formatDateTime(v)
        },
        {
          label: '分发时间',
          key: 'distributed_at',
          render: (v) => formatDateTime(v)
        },
        {
          label: '激活时间',
          key: 'activated_at',
          render: (v) => formatDateTime(v)
        },
        {
          label: '过期时间',
          key: 'expire_time',
          span: 2,
          render: (_, d) =>
            d.type === 3 ? (
              <span className='text-primary font-medium'>永久有效</span>
            ) : (
              formatDateTime(d.expire_time)
            )
        }
      ]
    }
  ];

  return <InfoList data={data} sections={sections} />;
}
