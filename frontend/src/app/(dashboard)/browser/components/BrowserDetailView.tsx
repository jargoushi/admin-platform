/**
 * 浏览器详情展示组件
 */

'use client';

import React from 'react';
import { type BrowserDetail } from '../types';
import { StatusBadge } from '@/components/shared/status-badge';
import { BROWSER_STATUS_ENUM } from '../constants';
import { type DialogComponentProps } from '@/contexts/dialog-provider';

export function BrowserDetailView({ data }: DialogComponentProps<BrowserDetail>) {
  if (!data) return null;
  const fingerPrint = data.browserFingerPrint || {};

  const detailItems = [
    { label: '窗口名称', value: data.name },
    { label: '窗口ID', value: data.id, className: 'font-mono text-xs' },
    {
      label: '状态',
      value: <StatusBadge code={data.status} enum={BROWSER_STATUS_ENUM} />
    },
    { label: '序号', value: data.seq },
    { label: '代理类型', value: data.proxyType || '直连' },
    { label: '代理地址', value: data.host ? `${data.host}:${data.port}` : '-' },
    { label: '创建时间', value: data.createdTime }
  ];

  const fingerPrintItems = [
    { label: '内核产品', value: fingerPrint.coreProduct },
    { label: '内核版本', value: fingerPrint.coreVersion },
    { label: '操作系统', value: `${fingerPrint.os} (${fingerPrint.ostype})` },
    {
      label: '窗口分辨率',
      value: `${fingerPrint.openWidth} x ${fingerPrint.openHeight}`
    },
    { label: 'User Agent', value: fingerPrint.userAgent, fullWidth: true }
  ];

  return (
    <div className='space-y-6 py-4'>
      <section>
        <h3 className='text-muted-foreground mb-3 text-sm font-medium'>
          基本信息
        </h3>
        <div className='bg-muted/30 grid grid-cols-2 gap-4 rounded-lg border p-4'>
          {detailItems.map((item, index) => (
            <div
              key={index}
              className={`space-y-1 ${item.label === 'User Agent' ? 'col-span-2' : ''}`}
            >
              <div className='text-muted-foreground text-xs'>{item.label}</div>
              <div className={`text-sm ${item.className || ''}`}>
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className='text-muted-foreground mb-3 text-sm font-medium'>
          指纹配置
        </h3>
        <div className='bg-muted/30 grid grid-cols-2 gap-4 rounded-lg border p-4'>
          {fingerPrintItems.map((item, index) => (
            <div
              key={index}
              className={`space-y-1 ${item.fullWidth ? 'col-span-2' : ''}`}
            >
              <div className='text-muted-foreground text-xs'>{item.label}</div>
              <div className='text-sm break-all'>{item.value || '-'}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
