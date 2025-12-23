/**
 * 绑定列表表格
 */

'use client';

import { Trash2, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { DataTable, type Column } from '@/components/table/data-table';
import { useConfirmation } from '@/contexts/confirmation-provider';
import { useDialog } from '@/contexts/dialog-provider';
import { AccountApiService } from '@/service/api/account.api';
import { BindingEditForm } from './BindingEditForm';
import type { Binding } from '../../types';

interface BindingTableProps {
  data: Binding[];
  loading: boolean;
  onRefresh: () => void;
}

export function BindingTable({ data, loading, onRefresh }: BindingTableProps) {
  const dialog = useDialog();
  const { confirm } = useConfirmation();

  const handleEdit = (binding: Binding) => {
    dialog.open({
      title: '编辑绑定',
      component: BindingEditForm,
      data: binding,
      onClose: onRefresh
    });
  };

  const handleUnbind = (binding: Binding) => {
    confirm({
      description: `确定解绑 "${binding.project_name}" 吗？`,
      onConfirm: async () => {
        await AccountApiService.unbind(binding.id);
        toast.success('解绑成功');
        onRefresh();
      }
    });
  };

  const columns: Column<Binding>[] = [
    {
      key: 'project_name',
      title: '项目',
      className: 'w-[150px] text-sm'
    },
    {
      key: 'channel_names',
      title: '渠道',
      className: 'text-sm',
      render: (value) => (value as string[]).join(', ')
    },
    {
      key: 'browser_id',
      title: '浏览器 ID',
      className: 'w-[200px] font-mono text-xs',
      render: (value) => (value as string) || '-'
    },
    {
      key: 'actions',
      title: '操作',
      className: 'w-[100px] text-center',
      render: (_, record) => (
        <div className='flex justify-center gap-1'>
          <Button
            size='icon'
            variant='ghost'
            className='h-8 w-8'
            onClick={() => handleEdit(record)}
          >
            <Pencil className='h-4 w-4' />
          </Button>
          <Button
            size='icon'
            variant='ghost'
            className='h-8 w-8 text-destructive'
            onClick={() => handleUnbind(record)}
          >
            <Trash2 className='h-4 w-4' />
          </Button>
        </div>
      )
    }
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      loading={loading}
      rowKey="id"
    />
  );
}
