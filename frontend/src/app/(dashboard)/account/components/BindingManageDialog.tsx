/**
 * 绑定管理弹窗组件
 *
 * @description
 * 管理账号的项目渠道绑定，支持查看、新增、编辑、解绑操作
 */

'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { Plus, Trash2, Link2, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
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
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  bindingSchema,
  bindingUpdateSchema,
  type BindingFormData,
  type BindingUpdateFormData
} from '../account.schema';
import { useConfirmation } from '@/hooks/use-confirmation';
import { AccountApiService } from '@/service/api/account.api';
import { CommonApiService, type EnumItem } from '@/service/api/common.api';
import type { Account, Binding } from '../types';

interface BindingManageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account: Account | null;
}

export function BindingManageDialog({
  open,
  onOpenChange,
  account
}: BindingManageDialogProps) {
  // 绑定列表
  const [bindings, setBindings] = useState<Binding[]>([]);
  const [loading, setLoading] = useState(false);

  // 枚举数据
  const [projects, setProjects] = useState<EnumItem[]>([]);
  const [channels, setChannels] = useState<EnumItem[]>([]);

  // 新建绑定表单状态
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // 编辑表单状态
  const [editingId, setEditingId] = useState<number | null>(null);

  // 新建表单
  const addForm = useForm<BindingFormData>({
    resolver: zodResolver(bindingSchema),
    defaultValues: {
      project_code: undefined,
      channel_codes: [],
      browser_id: ''
    }
  });

  // 编辑表单
  const editForm = useForm<BindingUpdateFormData>({
    resolver: zodResolver(bindingUpdateSchema),
    defaultValues: {
      id: 0,
      channel_codes: [],
      browser_id: ''
    }
  });

  // 确认弹窗
  const { confirm, ConfirmDialog } = useConfirmation();

  // 转换渠道为 MultiSelect 选项格式
  const channelOptions = useMemo(
    () => channels.map((c) => ({ value: c.code, label: c.desc })),
    [channels]
  );

  /**
   * 获取枚举数据
   */
  const fetchEnums = useCallback(async () => {
    try {
      const [projectList, channelList] = await Promise.all([
        CommonApiService.getProjects(),
        CommonApiService.getChannels()
      ]);
      setProjects(projectList);
      setChannels(channelList);
    } catch (error) {
      console.error('获取枚举数据失败', error);
    }
  }, []);

  /**
   * 获取绑定列表
   */
  const fetchBindings = useCallback(async () => {
    if (!account) return;
    setLoading(true);
    try {
      const data = await AccountApiService.getBindings(account.id);
      setBindings(data);
    } catch (error) {
      console.error('获取绑定列表失败', error);
    } finally {
      setLoading(false);
    }
  }, [account]);

  // 打开时加载数据
  useEffect(() => {
    if (open && account) {
      fetchEnums();
      fetchBindings();
      setShowAddForm(false);
      setEditingId(null);
      addForm.reset({
        project_code: undefined,
        channel_codes: [],
        browser_id: ''
      });
    }
  }, [open, account, fetchEnums, fetchBindings, addForm]);

  /**
   * 处理新增绑定
   */
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
      addForm.reset({
        project_code: undefined,
        channel_codes: [],
        browser_id: ''
      });
      fetchBindings();
    } catch (error) {
      console.error('绑定失败', error);
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * 打开编辑
   */
  const handleStartEdit = useCallback(
    (binding: Binding) => {
      setEditingId(binding.id);
      editForm.reset({
        id: binding.id,
        channel_codes: binding.channel_codes,
        browser_id: binding.browser_id || ''
      });
    },
    [editForm]
  );

  /**
   * 取消编辑
   */
  const handleCancelEdit = useCallback(() => {
    setEditingId(null);
  }, []);

  /**
   * 保存编辑
   */
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
    } catch (error) {
      console.error('更新失败', error);
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * 处理解绑
   */
  const handleUnbind = useCallback(
    (binding: Binding) => {
      if (!account) return;
      confirm({
        description: `确定要解绑 "${binding.project_name} - ${binding.channel_names.join(', ')}" 吗？`,
        onConfirm: async () => {
          await AccountApiService.unbind(binding.id);
          toast.success('解绑成功');
          fetchBindings();
        }
      });
    },
    [account, confirm, fetchBindings]
  );

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className='sm:max-w-[700px]'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <Link2 className='h-5 w-5' />
              绑定管理 - {account?.name}
            </DialogTitle>
            <DialogDescription>管理该账号的项目渠道绑定关系</DialogDescription>
          </DialogHeader>

          <div className='space-y-4'>
            {/* 新建绑定 */}
            {!showAddForm ? (
              <Button
                variant='outline'
                size='sm'
                onClick={() => setShowAddForm(true)}
              >
                <Plus className='mr-2 h-4 w-4' />
                新增绑定
              </Button>
            ) : (
              <div className='space-y-4 rounded-lg border p-4'>
                <div className='grid grid-cols-3 gap-4'>
                  {/* 项目选择 */}
                  <div className='space-y-2'>
                    <Label>
                      项目 <span className='text-destructive'>*</span>
                    </Label>
                    <Controller
                      name='project_code'
                      control={addForm.control}
                      render={({ field }) => (
                        <Select
                          value={field.value?.toString() || ''}
                          onValueChange={(v) => field.onChange(Number(v))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder='请选择项目' />
                          </SelectTrigger>
                          <SelectContent>
                            {projects.map((p) => (
                              <SelectItem
                                key={p.code}
                                value={p.code.toString()}
                              >
                                {p.desc}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {addForm.formState.errors.project_code && (
                      <p className='text-destructive text-xs'>
                        {addForm.formState.errors.project_code.message}
                      </p>
                    )}
                  </div>

                  {/* 渠道多选 */}
                  <div className='space-y-2'>
                    <Label>
                      渠道 <span className='text-destructive'>*</span>
                    </Label>
                    <Controller
                      name='channel_codes'
                      control={addForm.control}
                      render={({ field }) => (
                        <MultiSelect
                          options={channelOptions}
                          value={field.value}
                          onChange={field.onChange}
                          placeholder='请选择渠道'
                        />
                      )}
                    />
                    {addForm.formState.errors.channel_codes && (
                      <p className='text-destructive text-xs'>
                        {addForm.formState.errors.channel_codes.message}
                      </p>
                    )}
                  </div>

                  {/* 浏览器 ID */}
                  <div className='space-y-2'>
                    <Label>浏览器 ID（可选）</Label>
                    <Input
                      placeholder='请输入浏览器 ID'
                      {...addForm.register('browser_id')}
                    />
                    {addForm.formState.errors.browser_id && (
                      <p className='text-destructive text-xs'>
                        {addForm.formState.errors.browser_id.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className='flex gap-2'>
                  <Button
                    size='sm'
                    onClick={addForm.handleSubmit(handleAdd)}
                    disabled={submitting}
                  >
                    确认绑定
                  </Button>
                  <Button
                    size='sm'
                    variant='outline'
                    onClick={() => {
                      setShowAddForm(false);
                      addForm.reset({
                        project_code: undefined,
                        channel_codes: [],
                        browser_id: ''
                      });
                    }}
                  >
                    取消
                  </Button>
                </div>
              </div>
            )}

            {/* 绑定列表 */}
            <div className='rounded-lg border'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className='w-[120px]'>项目</TableHead>
                    <TableHead className='w-[200px]'>渠道</TableHead>
                    <TableHead>浏览器 ID</TableHead>
                    <TableHead className='w-[100px] text-center'>
                      操作
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={4} className='py-8 text-center'>
                        <span className='text-muted-foreground'>加载中...</span>
                      </TableCell>
                    </TableRow>
                  ) : bindings.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className='py-8 text-center'>
                        <span className='text-muted-foreground'>暂无绑定</span>
                      </TableCell>
                    </TableRow>
                  ) : (
                    bindings.map((binding) => (
                      <TableRow key={binding.id}>
                        <TableCell>{binding.project_name}</TableCell>
                        <TableCell>
                          {editingId === binding.id ? (
                            <div className='space-y-1'>
                              <Controller
                                name='channel_codes'
                                control={editForm.control}
                                render={({ field }) => (
                                  <MultiSelect
                                    options={channelOptions}
                                    value={field.value}
                                    onChange={field.onChange}
                                    placeholder='请选择渠道'
                                  />
                                )}
                              />
                              {editForm.formState.errors.channel_codes && (
                                <p className='text-destructive text-[10px]'>
                                  {
                                    editForm.formState.errors.channel_codes
                                      .message
                                  }
                                </p>
                              )}
                            </div>
                          ) : (
                            binding.channel_names.join(', ')
                          )}
                        </TableCell>
                        <TableCell>
                          {editingId === binding.id ? (
                            <div className='space-y-1'>
                              <Input
                                className='h-8'
                                placeholder='浏览器 ID'
                                {...editForm.register('browser_id')}
                              />
                              {editForm.formState.errors.browser_id && (
                                <p className='text-destructive text-[10px]'>
                                  {editForm.formState.errors.browser_id.message}
                                </p>
                              )}
                            </div>
                          ) : (
                            <span className='font-mono text-sm'>
                              {binding.browser_id || '-'}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className='text-center'>
                          {editingId === binding.id ? (
                            <div className='flex justify-center gap-1'>
                              <Button
                                size='sm'
                                variant='ghost'
                                onClick={editForm.handleSubmit(handleSaveEdit)}
                                disabled={submitting}
                              >
                                保存
                              </Button>
                              <Button
                                size='sm'
                                variant='ghost'
                                onClick={handleCancelEdit}
                              >
                                取消
                              </Button>
                            </div>
                          ) : (
                            <div className='flex justify-center gap-1'>
                              <Button
                                variant='ghost'
                                size='icon'
                                className='h-8 w-8'
                                onClick={() => handleStartEdit(binding)}
                              >
                                <Pencil className='h-4 w-4' />
                              </Button>
                              <Button
                                variant='ghost'
                                size='icon'
                                className='text-destructive hover:text-destructive h-8 w-8'
                                onClick={() => handleUnbind(binding)}
                              >
                                <Trash2 className='h-4 w-4' />
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
        </DialogContent>
      </Dialog>

      <ConfirmDialog />
    </>
  );
}
