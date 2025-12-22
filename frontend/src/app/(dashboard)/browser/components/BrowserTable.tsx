/**
 * 浏览器管理数据表格
 */

'use client';

import { useMemo } from 'react';
import { Play, Square, Trash2, Info } from 'lucide-react';
import { useTableActions } from '@/hooks/use-table-actions';
import { DataTable, type Column } from '@/components/table/data-table';
import {
    ActionDropdown,
    type ActionItem
} from '@/components/table/action-dropdown';
import { BrowserApiService } from '@/service/api/browser.api';
import { StatusBadge } from '@/components/shared/status-badge';
import { toast } from 'sonner';
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
    const { openDialog } = useTableActions({ onRefresh });

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
                render: (_: unknown, record: BrowserListItem) => (
                    <StatusBadge code={record.status} enum={BROWSER_STATUS_ENUM} />
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
                    const actions: ActionItem<BrowserListItem>[] = [
                        {
                            key: 'detail',
                            label: '查看详情',
                            icon: <Info className='h-4 w-4' />,
                            onClick: async (r) => {
                                try {
                                    const detail = await BrowserApiService.getDetail(r.id);
                                    openDialog({
                                        title: '浏览器详情',
                                        description: '查看指纹及环境配置信息',
                                        component: BrowserDetailView,
                                        data: detail
                                    });
                                } catch {
                                    toast.error('获取详情失败');
                                }
                            }
                        },
                        {
                            key: 'open',
                            label: '打开窗口',
                            icon: <Play className='h-4 w-4' />,
                            disabled: (r) => r.status === 1,
                            onClick: async (r) => {
                                try {
                                    const result = await BrowserApiService.open({ ids: [r.id] });
                                    if (result.success_count > 0) {
                                        toast.success(`窗口 [${r.name}] 已启动`);
                                        onRefresh?.();
                                    } else {
                                        toast.error(`窗口 [${r.name}] 启动失败: ${result.results[0]?.error}`);
                                    }
                                } catch {
                                    toast.error('打开浏览器失败');
                                }
                            }
                        },
                        {
                            key: 'close',
                            label: '关闭窗口',
                            icon: <Square className='h-4 w-4' />,
                            disabled: (r) => r.status !== 1,
                            onClick: async (r) => {
                                try {
                                    await BrowserApiService.close(r.id);
                                    toast.success(`窗口 [${r.name}] 已关闭`);
                                    onRefresh?.();
                                } catch {
                                    toast.error('关闭浏览器失败');
                                }
                            }
                        },
                        {
                            key: 'delete',
                            label: '彻底删除',
                            icon: <Trash2 className='h-4 w-4' />,
                            className: 'text-destructive focus:text-destructive',
                            confirm: {
                                description: (r) => `确定要彻底删除窗口 [${r.name}] 吗？此操作不可恢复。`
                            },
                            onClick: async (r) => {
                                await BrowserApiService.delete(r.id);
                                toast.success('窗口已删除');
                                onRefresh?.();
                            }
                        }
                    ];

                    return <ActionDropdown record={record} actions={actions} />;
                }
            }
        ],
        [openDialog, onRefresh]
    );


    return (
        <DataTable columns={columns} data={data} loading={loading} rowKey='id' />
    );
}

