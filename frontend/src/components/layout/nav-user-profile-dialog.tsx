'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { profileSchema, type ProfileFormData } from './nav-user.schema';
import type { UserProfile } from '@/types/auth';

interface ProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserProfile | null;
  onUpdate: (data: ProfileFormData) => Promise<void>;
  loading: boolean;
}

export function ProfileDialog({
  open,
  onOpenChange,
  user,
  onUpdate,
  loading
}: ProfileDialogProps) {
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: user?.username || '',
      phone: user?.phone || '',
      email: user?.email || ''
    }
  });

  const handleSubmit = async (data: ProfileFormData) => {
    await onUpdate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>账号设置</DialogTitle>
          <DialogDescription>更新您的个人信息</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='username'>用户名</Label>
            <Input
              id='username'
              placeholder='2-50位，字母、数字、下划线'
              {...form.register('username')}
            />
            {form.formState.errors.username && (
              <p className='text-sm text-red-500'>
                {form.formState.errors.username.message}
              </p>
            )}
          </div>
          <div className='space-y-2'>
            <Label htmlFor='phone'>手机号</Label>
            <Input
              id='phone'
              placeholder='请输入手机号'
              {...form.register('phone')}
            />
            {form.formState.errors.phone && (
              <p className='text-sm text-red-500'>
                {form.formState.errors.phone.message}
              </p>
            )}
          </div>
          <div className='space-y-2'>
            <Label htmlFor='email'>邮箱</Label>
            <Input
              id='email'
              type='email'
              placeholder='请输入邮箱'
              {...form.register('email')}
            />
            {form.formState.errors.email && (
              <p className='text-sm text-red-500'>
                {form.formState.errors.email.message}
              </p>
            )}
          </div>
          <div className='flex justify-end gap-2'>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
            >
              取消
            </Button>
            <Button type='submit' disabled={loading}>
              {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              保存
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
