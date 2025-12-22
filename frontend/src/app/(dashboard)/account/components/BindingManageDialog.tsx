/**
 * 绑定管理弹窗 - 管理账号的项目渠道绑定
 */

'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { Plus, Trash2, Pencil, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { MultiSelect } from '@/components/ui/multi-select';
import { useConfirmation } from '@/contexts/confirmation-provider';
import { AccountApiService } from '@/service/api/account.api';
import { CommonApiService, type EnumItem } from '@/service/api/common.api';
import {
  bindingSchema,
  bindingUpdateSchema,
  type BindingFormData,
  type BindingUpdateFormData
} from '../account.schema';
import type { Account, Binding } from '../types';
import { DialogComponentProps } from '@/contexts/dialog-provider';

export function BindingManageDialog({ data: account }: DialogComponentProps<Account>) {
  const [bindings, setBindings] = useState<Binding[]>([]);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<EnumItem[]>([]);
  const [channels, setChannels] = useState<EnumItem[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const { confirm } = useConfirmation();

  const channelOptions = useMemo(
    () => channels.map(c => ({ value: c.code, label: c.desc })),
    [channels]
  );

  const addForm = useForm<BindingFormData>({
    resolver: zodResolver(bindingSchema),
    defaultValues: { project_code: undefined, channel_codes: [], browser_id: '' }
  });

  const editForm = useForm<BindingUpdateFormData>({
    resolver: zodResolver(bindingUpdateSchema),
    defaultValues: { id: 0, channel_codes: [], browser_id: '' }
  });

  // 加载数据
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
    if (!account) return;
    Promise.all([CommonApiService.getProjects(), CommonApiService.getChannels()])
      .then(([p, c]) => { setProjects(p); setChannels(c); });
    fetchBindings();
    setShowAddForm(false);
    setEditingId(null);
  }, [account, fetchBindings]);

  // 新增绑定
  const handleAdd = async (data: BindingFormData) => {
    if (!account) return;
    setSubmitting(true);
    try {
      await AccountApiService.bind(account.id, {
        project_code: data.project_code,
        channel_codes: data.channel_codes,
        browser_id: data.browser_id || undefined
      });
      toast.success(`成功绑定 ${data.channel_codes.length} 个渠道`);
      setShowAddForm(false);
      addForm.reset();
      fetchBindings();
    } finally {
      setSubmitting(false);
    }
  };

  // 编辑绑定
  const handleStartEdit = (binding: Binding) => {
    setEditingId(binding.id);
    editForm.reset({
      id: binding.id,
      channel_codes: binding.channel_codes,
      browser_id: binding.browser_id || ''
    });
  };

  const handleSaveEdit = async (data: BindingUpdateFormData) => {
    setSubmitting(true);
    try {
      await AccountApiService.updateBinding({
        id: data.id,
        channel_codes: data.channel_codes,
        browser_id: data.browser_id || undefined
      });
      toast.success('更新成功');
      setEditingId(null);
      fetchBindings();
    } finally {
      setSubmitting(false);
    }
  };

  // 解绑
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
      {/* 新增绑定 */}
      {!showAddForm ? (
        <Button variant='outline' size='sm' onClick={() => setShowAddForm(true)}>
          <Plus className='mr-1 h-4 w-4' /> 新增绑定
        </Button>
      ) : (
        <div className='space-y-3 rounded-lg border p-3'>
          <div className='grid grid-cols-3 gap-3'>
            <div className='space-y-1'>
              <Label className='text-xs'>项目 *</Label>
              <Controller
                name='project_code'
                control={addForm.control}
                render={({ field }) => (
                  <Select value={field.value?.toString() || ''} onValueChange={v => field.onChange(Number(v))}>
                    <SelectTrigger className='h-9'><SelectValue placeholder='选择项目' /></SelectTrigger>
                    <SelectContent>
                      {projects.map(p => <SelectItem key={p.code} value={p.code.toString()}>{p.desc}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className='space-y-1'>
              <Label className='text-xs'>渠道 *</Label>
              <Controller
                name='channel_codes'
                control={addForm.control}
                render={({ field }) => (
                  <MultiSelect options={channelOptions} value={field.value} onChange={field.onChange} placeholder='选择渠道' />
                )}
              />
            </div>
            <div className='space-y-1'>
              <Label className='text-xs'>浏览器 ID</Label>
              <Input className='h-9' placeholder='可选' {...addForm.register('browser_id')} />
            </div>
          </div>
          <div className='flex gap-2'>
            <Button size='sm' onClick={addForm.handleSubmit(handleAdd)} disabled={submitting}>确认</Button>
            <Button size='sm' variant='ghost' onClick={() => { setShowAddForm(false); addForm.reset(); }}>取消</Button>
          </div>
        </div>
      )}

      {/* 绑定列表 */}
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
              <TableRow><TableCell colSpan={4} className='py-6 text-center text-muted-foreground'>加载中...</TableCell></TableRow>
            ) : bindings.length === 0 ? (
              <TableRow><TableCell colSpan={4} className='py-6 text-center text-muted-foreground'>暂无绑定</TableCell></TableRow>
            ) : (
              bindings.map(binding => (
                <TableRow key={binding.id}>
                  <TableCell className='text-sm'>{binding.project_name}</TableCell>
                  <TableCell>
                    {editingId === binding.id ? (
                      <Controller
                        name='channel_codes'
                        control={editForm.control}
                        render={({ field }) => (
                          <MultiSelect options={channelOptions} value={field.value} onChange={field.onChange} />
                        )}
                      />
                    ) : (
                      <span className='text-sm'>{binding.channel_names.join(', ')}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === binding.id ? (
                      <Input className='h-8' {...editForm.register('browser_id')} />
                    ) : (
                      <span className='font-mono text-xs'>{binding.browser_id || '-'}</span>
                    )}
                  </TableCell>
                  <TableCell className='text-center'>
                    {editingId === binding.id ? (
                      <div className='flex justify-center gap-1'>
                        <Button size='icon' variant='ghost' className='h-7 w-7' onClick={editForm.handleSubmit(handleSaveEdit)} disabled={submitting}>
                          <Check className='h-4 w-4' />
                        </Button>
                        <Button size='icon' variant='ghost' className='h-7 w-7' onClick={() => setEditingId(null)}>
                          <X className='h-4 w-4' />
                        </Button>
                      </div>
                    ) : (
                      <div className='flex justify-center gap-1'>
                        <Button size='icon' variant='ghost' className='h-7 w-7' onClick={() => handleStartEdit(binding)}>
                          <Pencil className='h-3.5 w-3.5' />
                        </Button>
                        <Button size='icon' variant='ghost' className='h-7 w-7 text-destructive' onClick={() => handleUnbind(binding)}>
                          <Trash2 className='h-3.5 w-3.5' />
                        </Button>
                      </div>
                    )}
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
