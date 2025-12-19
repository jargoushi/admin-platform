/**
 * 注册表单组件
 *
 * @description
 * 用户注册表单，需要用户名、密码和激活码
 */

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { UserApiService } from '@/service/api/user.api';
import { registerSchema, type RegisterFormData } from './auth.schema';

export function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
      activation_code: ''
    }
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await UserApiService.register({
        username: data.username,
        password: data.password,
        activation_code: data.activation_code
      });

      toast.success('注册成功，请登录');
      router.push('/login');
    } catch (err) {
      let errorMessage = '注册失败，请重试';

      if (axios.isAxiosError(err)) {
        errorMessage =
          err.response?.data?.message || err.message || errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex flex-col space-y-2 text-center'>
        <h1 className='text-2xl font-semibold tracking-tight'>创建账号</h1>
        <p className='text-muted-foreground text-sm'>
          加入我们，开启您的管理之旅
        </p>
      </div>

      <Card className='border-border shadow-sm'>
        <CardContent className='pt-6'>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            {/* 错误提示 */}
            {error && (
              <div className='bg-destructive/10 text-destructive rounded-md p-3 text-sm'>
                {error}
              </div>
            )}

            {/* 用户名 */}
            <div className='grid gap-2'>
              <Label htmlFor='username'>用户名</Label>
              <div className='relative'>
                <div className='text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='h-4 w-4'
                  >
                    <path d='M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2' />
                    <circle cx='12' cy='7' r='4' />
                  </svg>
                </div>
                <Input
                  id='username'
                  type='text'
                  placeholder='2-50位，字母、数字、下划线'
                  className='pl-10'
                  {...register('username')}
                />
              </div>
              {errors.username && (
                <p className='text-destructive text-xs'>
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* 密码 */}
            <div className='grid gap-2'>
              <Label htmlFor='password'>密码</Label>
              <div className='relative'>
                <div className='text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='h-4 w-4'
                  >
                    <rect width='18' height='11' x='3' y='11' rx='2' ry='2' />
                    <path d='M7 11V7a5 5 0 0 1 10 0v4' />
                  </svg>
                </div>
                <Input
                  id='password'
                  type={showPassword ? 'text' : 'password'}
                  placeholder='8-20位，包含大小写字母和数字'
                  className='px-10'
                  {...register('password')}
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors'
                >
                  {showPassword ? (
                    <EyeOff className='h-4 w-4' />
                  ) : (
                    <Eye className='h-4 w-4' />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className='text-destructive text-xs'>
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* 确认密码 */}
            <div className='grid gap-2'>
              <Label htmlFor='confirmPassword'>确认密码</Label>
              <div className='relative'>
                <div className='text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='h-4 w-4'
                  >
                    <path d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10' />
                    <path d='m9 12 2 2 4-4' />
                  </svg>
                </div>
                <Input
                  id='confirmPassword'
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder='请再次输入密码'
                  className='px-10'
                  {...register('confirmPassword')}
                />
                <button
                  type='button'
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className='text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors'
                >
                  {showConfirmPassword ? (
                    <EyeOff className='h-4 w-4' />
                  ) : (
                    <Eye className='h-4 w-4' />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className='text-destructive text-xs'>
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* 激活码 */}
            <div className='grid gap-2'>
              <Label htmlFor='activation_code'>激活码</Label>
              <div className='relative'>
                <div className='text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='h-4 w-4'
                  >
                    <path d='m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4' />
                    <path d='m21 2-9.6 9.6' />
                    <circle cx='7.5' cy='15.5' r='5.5' />
                  </svg>
                </div>
                <Input
                  id='activation_code'
                  type='text'
                  placeholder='请输入激活码'
                  className='pl-10'
                  {...register('activation_code')}
                />
              </div>
              {errors.activation_code && (
                <p className='text-destructive text-xs'>
                  {errors.activation_code.message}
                </p>
              )}
            </div>

            {/* 注册按钮 */}
            <Button type='submit' className='w-full' disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  正在注册...
                </>
              ) : (
                '注册'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className='text-muted-foreground text-center text-sm'>
        已有账号？{' '}
        <Link
          href='/login'
          className='hover:text-primary underline underline-offset-4'
        >
          立即登录
        </Link>
      </div>
    </div>
  );
}
