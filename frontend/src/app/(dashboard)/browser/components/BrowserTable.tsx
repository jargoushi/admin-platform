/**
 * 浏览器管理数据表格
 */

'use client';

import { useMemo, useCallback } from 'react';
import { Play, Square, Trash2 } from 'lucide-react';
import { DataTable, type Column } from '@/components/table/data-table';
import {
    ActionDropdown,
    type ActionItem
} from '@/components/table/action-dropdown';
import { useConfirmation } from '@/hooks/use-confirmation';
import { BrowserApiService } from '@/service/api/browser.api';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import type { BrowserListItem } from '../types';
import { BROWSER_STATUS } from '../constants';

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

    const handleOpen = useCallback(
        async (record: BrowserListItem) => {
            try {
                const result = await BrowserApiService.open({ ids: [record.id] });
                if (result.success_count > 0) {
                    toast.success(`窗口 [${record.name}] 已启动`);
                    onRefresh?.();
                } else {
                    toast.error(`窗口 [${record.name}] 启动失败: ${result.results[0]?.error}`);
                }
            } catch (error) {
                toast.error('请求失败');
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
            } catch (error) {
                toast.error('关闭失败');
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
                render: (_, record) => {
                    const status = BROWSER_STATUS[record.status as keyof typeof BROWSER_STATUS] || BROWSER_STATUS[0];
                    return (
                        <Badge className={`${status.bg} ${status.color} border-none hover:bg-opacity-80`}>
                            {status.label}
                        </Badge>
                    );
                }
            },
            {
                key: 'proxy',
                title: '代理信息',
                className: 'min-w-[200px]',
                render: (_, record) => (
                    <div className='text-xs space-y-1'>
                        {record.proxyType ? (
                            <>
                                <div className='font-medium text-primary'>{record.proxyType.toUpperCase()}</div>
                                <div className='text-muted-foreground'>{record.host}:{record.port}</div>
                            </>
                        ) : (
                            <span className='text-muted-foreground'>直连</span>
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
        [handleOpen, handleClose, handleDelete]
    );

    return (
        <>
            <DataTable columns={columns} data={data} loading={loading} rowKey='id' />
            <ConfirmDialog />
        </>
    );
}
