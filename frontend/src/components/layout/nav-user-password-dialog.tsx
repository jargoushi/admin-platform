'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
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
import { passwordSchema, type PasswordFormData } from './nav-user.schema';

interface PasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (data: PasswordFormData) => Promise<void>;
  loading: boolean;
}

export function PasswordDialog({
  open,
  onOpenChange,
  onUpdate,
  loading
}: PasswordDialogProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { newPassword: '', confirmPassword: '' }
  });

  const handleSubmit = async (data: PasswordFormData) => {
    await onUpdate(data);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>修改密码</DialogTitle>
          <DialogDescription>
            密码需8-20位，包含大小写字母和数字
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='newPassword'>新密码</Label>
            <div className='relative'>
              <Input
                id='newPassword'
                type={showPassword ? 'text' : 'password'}
                placeholder='8-20位，包含大小写字母和数字'
                className='pr-10'
                {...form.register('newPassword')}
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2'
              >
                {showPassword ? (
                  <EyeOff className='h-4 w-4' />
                ) : (
                  <Eye className='h-4 w-4' />
                )}
              </button>
            </div>
            {form.formState.errors.newPassword && (
              <p className='text-sm text-red-500'>
                {form.formState.errors.newPassword.message}
              </p>
            )}
          </div>
          <div className='space-y-2'>
            <Label htmlFor='confirmPassword'>确认密码</Label>
            <div className='relative'>
              <Input
                id='confirmPassword'
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder='请再次输入新密码'
                className='pr-10'
                {...form.register('confirmPassword')}
              />
              <button
                type='button'
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className='text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2'
              >
                {showConfirmPassword ? (
                  <EyeOff className='h-4 w-4' />
                ) : (
                  <Eye className='h-4 w-4' />
                )}
              </button>
            </div>
            {form.formState.errors.confirmPassword && (
              <p className='text-sm text-red-500'>
                {form.formState.errors.confirmPassword.message}
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
              确认修改
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
