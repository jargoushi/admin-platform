/**
 * 账号对话框组件
 *
 * @description
 * 创建和编辑账号的对话框
 */

'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { accountSchema, type AccountFormData } from '../account.schema';
import type { Account, AccountCreateRequest } from '../types';
import { DEFAULT_ACCOUNT_FORM } from '../constants';

/**
 * 对话框属性
 */
interface AccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** 编辑模式时传入账号数据 */
  account?: Account | null;
  /** 提交回调 */
  onSubmit: (data: AccountCreateRequest) => Promise<void>;
  /** 是否正在提交 */
  loading?: boolean;
}

export function AccountDialog({
  open,
  onOpenChange,
  account,
  onSubmit,
  loading = false
}: AccountDialogProps) {
  const isEdit = !!account;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: DEFAULT_ACCOUNT_FORM
  });

  // 打开对话框时初始化表单
  useEffect(() => {
    if (open) {
      if (account) {
        reset({
          name: account.name,
          platform_account: account.platform_account || '',
          platform_password: account.platform_password || '',
          description: account.description || ''
        });
      } else {
        reset(DEFAULT_ACCOUNT_FORM);
      }
    }
  }, [open, account, reset]);

  const handleFormSubmit = async (data: AccountCreateRequest) => {
    await onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>{isEdit ? '编辑账号' : '新建账号'}</DialogTitle>
          <DialogDescription>
            {isEdit ? '修改账号信息' : '创建一个新的账号'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-4'>
          {/* 账号名称 */}
          <div className='space-y-2'>
            <Label htmlFor='name'>
              账号名称 <span className='text-destructive'>*</span>
            </Label>
            <Input
              id='name'
              placeholder='请输入账号名称'
              {...register('name')}
            />
            {errors.name && (
              <p className='text-destructive text-sm'>{errors.name.message}</p>
            )}
          </div>

          {/* 平台账号 */}
          <div className='space-y-2'>
            <Label htmlFor='platform_account'>平台账号</Label>
            <Input
              id='platform_account'
              placeholder='请输入第三方平台账号'
              {...register('platform_account')}
            />
          </div>

          {/* 平台密码 */}
          <div className='space-y-2'>
            <Label htmlFor='platform_password'>平台密码</Label>
            <Input
              id='platform_password'
              type='password'
              placeholder='请输入第三方平台密码'
              {...register('platform_password')}
            />
          </div>

          {/* 描述 */}
          <div className='space-y-2'>
            <Label htmlFor='description'>描述</Label>
            <Textarea
              id='description'
              placeholder='请输入账号描述'
              rows={3}
              {...register('description')}
            />
          </div>

          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
            >
              取消
            </Button>
            <Button type='submit' disabled={loading}>
              {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              {isEdit ? '保存' : '创建'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/**
 * 删除确认对话框
 */
interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account?: Account | null;
  onConfirm: () => Promise<void>;
  loading?: boolean;
}

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  account,
  onConfirm,
  loading = false
}: DeleteConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[400px]'>
        <DialogHeader>
          <DialogTitle>确认删除</DialogTitle>
          <DialogDescription>
            确定要删除账号 <span className='font-medium'>{account?.name}</span>{' '}
            吗？此操作不可恢复。
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button variant='destructive' onClick={onConfirm} disabled={loading}>
            {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            删除
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
