/**
 * 登录表单组件
 *
 * @description
 * 用户登录表单，使用 react-hook-form 管理表单状态
 * 支持记住用户名功能
 */

'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { AuthApiService } from '@/service/api/auth.api';
import { loginSchema, type LoginFormData } from './auth.schema';

const REMEMBER_KEY = 'remember_username';

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: ''
    }
  });

  // 加载记住的用户名
  useEffect(() => {
    const savedUsername = localStorage.getItem(REMEMBER_KEY);
    if (savedUsername) {
      setValue('username', savedUsername);
      setRememberMe(true);
    }
  }, [setValue]);

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await AuthApiService.login(data.username, data.password);

      // 处理记住用户名
      if (rememberMe) {
        localStorage.setItem(REMEMBER_KEY, data.username);
      } else {
        localStorage.removeItem(REMEMBER_KEY);
      }

      // 登录成功，使用 window.location.href 强制全页刷新跳转
      // 这样可以确保从 (auth) 根布局平滑过渡到 (dashboard) 根布局
      window.location.href = '/user';
    } catch (err) {
      let errorMessage = '登录失败，请重试';

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
        <h1 className='text-2xl font-semibold tracking-tight'>登录账号</h1>
        <p className='text-muted-foreground text-sm'>
          输入您的用户名和密码以访问系统
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
                  placeholder='请输入用户名'
                  className='pl-10'
                  {...register('username', {
                    required: '请输入用户名'
                  })}
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
              <div className='flex items-center justify-between'>
                <Label htmlFor='password'>密码</Label>
                <Link
                  href='/forgot-password'
                  className='text-muted-foreground hover:text-primary text-xs underline-offset-4 hover:underline'
                >
                  忘记密码？
                </Link>
              </div>
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
                  placeholder='请输入密码'
                  className='px-10'
                  {...register('password', {
                    required: '请输入密码'
                  })}
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

            {/* 记住密码 */}
            <div className='flex items-center space-x-2'>
              <Checkbox
                id='remember'
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked === true)}
              />
              <Label
                htmlFor='remember'
                className='text-sm leading-none font-normal peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
              >
                记住用户名
              </Label>
            </div>

            {/* 登录按钮 */}
            <Button type='submit' className='w-full' disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  正在登录...
                </>
              ) : (
                '登录'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className='text-muted-foreground text-center text-sm'>
        还没有账号？{' '}
        <Link
          href='/register'
          className='hover:text-primary underline underline-offset-4'
        >
          立即注册
        </Link>
      </div>
    </div>
  );
}
