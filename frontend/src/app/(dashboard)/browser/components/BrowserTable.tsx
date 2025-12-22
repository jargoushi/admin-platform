/**
 * 浏览器管理数据表格
 */

'use client';

import { useMemo } from 'react';
import { Play, Square, Trash2, Info } from 'lucide-react';
import { DataTable, type Column } from '@/components/table/data-table';
import { ActionDropdown } from '@/components/table/action-dropdown';
import { Action } from '@/types/action';
import { BrowserApiService } from '@/service/api/browser.api';
import { StatusBadge } from '@/components/shared/status-badge';
import type { BrowserListItem } from '../types';
import { BROWSER_STATUS_ENUM } from '../constants';
import { BrowserDetailView } from './BrowserDetailView';

interface BrowserTableProps {
    data: BrowserListItem[];
    loading?: boolean;
    onRefresh?: () => void;
}

export function BrowserTable({
    data,
    loading = false,
    onRefresh
}: BrowserTableProps) {
    const columns = useMemo<Column<BrowserListItem>[]>(
        () => [
            {
                key: 'seq',
                title: '序号',
                className: 'w-[80px] text-center'
            },
            {
                key: 'name',
                title: '窗口名称',
                className: 'min-w-[150px]'
            },
            {
                key: 'id',
                title: '窗口ID',
                className: 'w-[200px] text-sm font-mono'
            },
            {
                key: 'status',
                title: '状态',
                className: 'w-[100px] text-center',
                render: (value: string | number | undefined) => (
                    <StatusBadge code={value as number} enum={BROWSER_STATUS_ENUM} />
                )
            },
            {
                key: 'proxy',
                title: '代理信息',
                className: 'min-w-[200px]',
                render: (_: unknown, record: BrowserListItem) => (
                    <div className='text-xs'>
                        {record.proxyType ? (
                            <div className='flex items-center space-x-1'>
                                <span className='text-primary font-medium'>
                                    {record.proxyType.toUpperCase()}
                                </span>
                                <span className='text-muted-foreground'>
                                    ({record.host}:{record.port})
                                </span>
                            </div>
                        ) : (
                            <span className='text-muted-foreground italic'>直连</span>
                        )}
                    </div>
                )
            },
            {
                key: 'createdTime',
                title: '创建时间',
                className: 'w-[180px]'
            },
            {
                key: 'actions',
                title: '操作',
                className: 'w-[120px] text-center',
                render: (_: unknown, record: BrowserListItem) => {
                    const actions: Action<BrowserListItem>[] = [
                        {
                            key: 'detail',
                            label: '查看详情',
                            icon: Info,
                            dialog: {
                                title: '浏览器详情',
                                description: '查看指纹及环境配置信息',
                                component: BrowserDetailView
                            }
                        },
                        {
                            key: 'open',
                            label: '打开窗口',
                            icon: Play,
                            disabled: (r) => r.status === 1,
                            onClick: (r) => BrowserApiService.open({ ids: [r.id] })
                        },
                        {
                            key: 'close',
                            label: '关闭窗口',
                            icon: Square,
                            disabled: (r) => r.status !== 1,
                            onClick: (r) => BrowserApiService.close(r.id)
                        },
                        {
                            key: 'delete',
                            label: '彻底删除',
                            icon: Trash2,
                            className: 'text-destructive focus:text-destructive',
                            confirm: {
                                description: (r) => `确定要彻底删除窗口 [${r.name}] 吗？此操作不可恢复。`
                            },
                            onClick: (r) => BrowserApiService.delete(r.id)
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

