/**
 * 绑定管理弹窗 - 列表展示 + 操作按钮
 */

'use client';

import { useState, useCallback, useEffect } from 'react';
import { Plus, Trash2, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { useConfirmation } from '@/contexts/confirmation-provider';
import { useDialog, type DialogComponentProps } from '@/contexts/dialog-provider';
import { AccountApiService } from '@/service/api/account.api';
import { BindingAddForm } from './BindingAddForm';
import { BindingEditForm } from './BindingEditForm';
import type { Account, Binding } from '../types';

export function BindingManageDialog({ data: account }: DialogComponentProps<Account>) {
  const [bindings, setBindings] = useState<Binding[]>([]);
  const [loading, setLoading] = useState(false);
  const dialog = useDialog();
  const { confirm } = useConfirmation();

  const fetchBindings = useCallback(async () => {
    if (!account) return;
    setLoading(true);
    try {
      setBindings(await AccountApiService.getBindings(account.id));
    } finally {
      setLoading(false);
    }
  }, [account]);

  useEffect(() => {
    fetchBindings();
  }, [fetchBindings]);

  const handleAdd = () => {
    dialog.open({
      title: '新增绑定',
      component: BindingAddForm,
      data: account,
      onClose: fetchBindings
    });
  };

  const handleEdit = (binding: Binding) => {
    dialog.open({
      title: '编辑绑定',
      component: BindingEditForm,
      data: binding,
      onClose: fetchBindings
    });
  };

  const handleUnbind = (binding: Binding) => {
    confirm({
      description: `确定解绑 "${binding.project_name}" 吗？`,
      onConfirm: async () => {
        await AccountApiService.unbind(binding.id);
        toast.success('解绑成功');
        fetchBindings();
      }
    });
  };

  return (
    <div className='space-y-4'>
      <Button variant='outline' size='sm' onClick={handleAdd}>
        <Plus className='mr-1 h-4 w-4' /> 新增绑定
      </Button>

      <div className='rounded-lg border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[100px]'>项目</TableHead>
              <TableHead>渠道</TableHead>
              <TableHead className='w-[150px]'>浏览器 ID</TableHead>
              <TableHead className='w-[80px] text-center'>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className='py-6 text-center text-muted-foreground'>
                  加载中...
                </TableCell>
              </TableRow>
            ) : bindings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className='py-6 text-center text-muted-foreground'>
                  暂无绑定
                </TableCell>
              </TableRow>
            ) : (
              bindings.map(binding => (
                <TableRow key={binding.id}>
                  <TableCell className='text-sm'>{binding.project_name}</TableCell>
                  <TableCell className='text-sm'>{binding.channel_names.join(', ')}</TableCell>
                  <TableCell className='font-mono text-xs'>{binding.browser_id || '-'}</TableCell>
                  <TableCell className='text-center'>
                    <div className='flex justify-center gap-1'>
                      <Button size='icon' variant='ghost' className='h-7 w-7' onClick={() => handleEdit(binding)}>
                        <Pencil className='h-3.5 w-3.5' />
                      </Button>
                      <Button size='icon' variant='ghost' className='h-7 w-7 text-destructive' onClick={() => handleUnbind(binding)}>
                        <Trash2 className='h-3.5 w-3.5' />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
