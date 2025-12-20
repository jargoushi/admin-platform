/**
 * 浏览器管理数据表格
 */

'use client';

import { useMemo, useCallback } from 'react';
import { Play, Square, Trash2, Info } from 'lucide-react';
import { DataTable, type Column } from '@/components/table/data-table';
import {
    ActionDropdown,
    type ActionItem
} from '@/components/table/action-dropdown';
import { useConfirmation } from '@/hooks/use-confirmation';
import { useGenericDialogs } from '@/hooks/use-generic-dialogs';
import { BrowserApiService } from '@/service/api/browser.api';
import { StatusBadge } from '@/components/shared/status-badge';
import { toast } from 'sonner';
import type { BrowserListItem, BrowserDetail } from '../types';
import { BROWSER_STATUS } from '../constants';
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
    const { confirm, ConfirmDialog } = useConfirmation();

    // Scheme 2: 使用通用对话框管理
    const { openDialog, DialogsContainer } = useGenericDialogs<BrowserDetail>({
        dialogs: {
            detail: {
                title: '浏览器详情',
                description: '查看指纹及环境配置信息',
                component: BrowserDetailView
            }
        }
    });

    const handleOpen = useCallback(
        async (record: BrowserListItem) => {
            try {
                const result = await BrowserApiService.open({ ids: [record.id] });
                if (result.success_count > 0) {
                    toast.success(`窗口 [${record.name}] 已启动`);
                    onRefresh?.();
                } else {
                    toast.error(
                        `窗口 [${record.name}] 启动失败: ${result.results[0]?.error}`
                    );
                }
            } catch (e) {
                toast.error('打开浏览器失败');
            }
        },
        [onRefresh]
    );

    const handleClose = useCallback(
        async (record: BrowserListItem) => {
            try {
                await BrowserApiService.close(record.id);
                toast.success(`窗口 [${record.name}] 已关闭`);
                onRefresh?.();
            } catch (e) {
                toast.error('关闭浏览器失败');
            }
        },
        [onRefresh]
    );

    const handleDelete = useCallback(
        (record: BrowserListItem) => {
            confirm({
                description: `确定要彻底删除窗口 [${record.name}] 吗？此操作不可恢复。`,
                onConfirm: async () => {
                    await BrowserApiService.delete(record.id);
                    toast.success('窗口已删除');
                    onRefresh?.();
                }
            });
        },
        [confirm, onRefresh]
    );

    const handleViewDetail = useCallback(
        async (record: BrowserListItem) => {
            try {
                const detail = await BrowserApiService.getDetail(record.id);
                openDialog('detail', detail);
            } catch (e) {
                toast.error('获取详情失败');
            }
        },
        [openDialog]
    );

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
                render: (_, record) => (
                    <StatusBadge code={record.status} configMap={BROWSER_STATUS} />
                )
            },
            {
                key: 'proxy',
                title: '代理信息',
                className: 'min-w-[200px]',
                render: (_, record) => (
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
                render: (_, record) => {
                    const actions: ActionItem[] = [
                        {
                            key: 'detail',
                            label: '查看详情',
                            icon: <Info className='mr-2 h-4 w-4' />,
                            onClick: () => handleViewDetail(record)
                        },
                        {
                            key: 'open',
                            label: '打开窗口',
                            icon: <Play className='mr-2 h-4 w-4' />,
                            onClick: () => handleOpen(record),
                            disabled: record.status === 1
                        },
                        {
                            key: 'close',
                            label: '关闭窗口',
                            icon: <Square className='mr-2 h-4 w-4' />,
                            onClick: () => handleClose(record),
                            disabled: record.status !== 1
                        },
                        {
                            key: 'delete',
                            label: '彻底删除',
                            icon: <Trash2 className='mr-2 h-4 w-4' />,
                            onClick: () => handleDelete(record),
                            className: 'text-destructive focus:text-destructive'
                        }
                    ];

                    return <ActionDropdown actions={actions} />;
                }
            }
        ],
        [handleOpen, handleClose, handleDelete, handleViewDetail]
    );

    return (
        <>
            <DataTable columns={columns} data={data} loading={loading} rowKey='id' />
            <ConfirmDialog />
            <DialogsContainer />
        </>
    );
}
