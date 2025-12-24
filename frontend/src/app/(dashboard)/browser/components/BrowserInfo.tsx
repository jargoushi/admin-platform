/**
 * 浏览器信息展示组件
 *
 * @description
 * 使用 InfoList 体系，提供简洁的浏览器详情展示。
 */

'use client';

import React from 'react';
import {
  InfoList,
  type InfoSection
} from '@/components/data/info-list';
import { StatusBadge } from '@/components/data/status-badge';
import { BROWSER_STATUS_ENUM } from '../constants';
import { type DialogComponentProps } from '@/contexts/dialog-provider';
import { type BrowserDetail } from '../types';

export function BrowserInfo({
  data
}: DialogComponentProps<BrowserDetail>) {
  if (!data) return null;

  const fingerPrint = data.browserFingerPrint || {};

  const sections: InfoSection<BrowserDetail>[] = [
    {
      title: '基本信息',
      items: [
        { label: '窗口名称', key: 'name' },
        { label: '窗口ID', key: 'id', contentClassName: 'font-mono text-xs' },
        {
          label: '状态',
          key: 'status',
          render: (v) => (
            <StatusBadge code={v as number} enum={BROWSER_STATUS_ENUM} />
          )
        },
        { label: '序号', key: 'seq' },
        { label: '代理类型', key: 'proxyType', render: (v) => v || '直连' },
        {
          label: '代理地址',
          key: 'host',
          render: (_, d) => (d.host ? `${d.host}:${d.port}` : '-')
        },
        { label: '创建时间', key: 'createdTime' }
      ]
    },
    {
      title: '指纹配置',
      items: [
        { label: '内核产品', key: 'coreProduct', render: () => fingerPrint.coreProduct },
        { label: '内核版本', key: 'coreVersion', render: () => fingerPrint.coreVersion },
        {
          label: '操作系统',
          key: 'os',
          render: () => `${fingerPrint.os} (${fingerPrint.ostype})`
        },
        {
          label: '窗口分辨率',
          key: 'resolution',
          render: () => `${fingerPrint.openWidth} x ${fingerPrint.openHeight}`
        },
        {
          label: 'User Agent',
          key: 'userAgent',
          span: 2,
          render: () => fingerPrint.userAgent,
          contentClassName: 'break-all text-xs text-muted-foreground'
        }
      ]
    }
  ];

  return <InfoList data={data} sections={sections} />;
}
