'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCcw, Home, ArrowLeft } from 'lucide-react';

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 记录错误到错误报告服务
    console.error('Dashboard Error:', error);
  }, [error]);

  return (
    <div className='bg-background relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden p-4'>
      {/* 动态背景装饰 */}
      <div className='pointer-events-none absolute inset-0 overflow-hidden'>
        <div className='bg-primary/10 absolute -top-24 -left-24 h-96 w-96 animate-pulse rounded-full blur-3xl' />
        <div className='bg-accent/10 absolute -right-24 -bottom-24 h-96 w-96 animate-pulse rounded-full blur-3xl delay-700' />
      </div>

      <div className='relative z-10 w-full max-w-md'>
        {/* 玻璃态卡片 */}
        <div className='bg-background/40 border-border/50 flex flex-col items-center rounded-3xl border p-8 text-center shadow-2xl backdrop-blur-2xl backdrop-saturate-150'>
          {/* 错误图标 */}
          <div className='bg-primary/10 mb-6 flex h-20 w-20 items-center justify-center rounded-2xl'>
            <AlertCircle className='text-primary h-10 w-10 animate-bounce' />
          </div>

          <h1 className='mb-2 text-3xl font-bold tracking-tight'>出错了</h1>
          <p className='text-muted-foreground mb-8 text-balance'>
            抱歉，后台系统遇到了一个意外错误。我们已经记录了此问题，并将尽快修复。
          </p>

          {/* 错误详情（仅开发环境或具有 digest 时显示） */}
          {error.digest && (
            <div className='bg-muted/50 mb-8 w-full rounded-xl p-3 text-left'>
              <p className='text-muted-foreground font-mono text-[10px] tracking-wider uppercase'>
                Error ID
              </p>
              <code className='text-foreground/80 font-mono text-xs break-all'>
                {error.digest}
              </code>
            </div>
          )}

          {/* 操作按钮 */}
          <div className='grid w-full grid-cols-1 gap-3 sm:grid-cols-2'>
            <Button
              onClick={() => reset()}
              size='lg'
              className='group relative overflow-hidden rounded-xl font-medium transition-all hover:shadow-lg active:scale-95'
            >
              <RefreshCcw className='mr-2 h-4 w-4 transition-transform group-hover:rotate-180' />
              重试一下
            </Button>
            <Button
              asChild
              variant='outline'
              size='lg'
              className='hover:bg-accent/50 rounded-xl font-medium transition-all active:scale-95'
            >
              <Link href='/'>
                <Home className='mr-2 h-4 w-4' />
                返回首页
              </Link>
            </Button>
          </div>

          {/* 辅助链接 */}
          <button
            onClick={() => window.history.back()}
            className='text-muted-foreground hover:text-foreground mt-8 flex items-center gap-2 text-sm transition-colors'
          >
            <ArrowLeft className='h-4 w-4' />
            回到上一页
          </button>
        </div>

        {/* 底部装饰文字 */}
        <p className='text-muted-foreground/40 mt-8 text-center text-xs font-medium tracking-widest uppercase'>
          N Admin Dashboard Recovery
        </p>
      </div>
    </div>
  );
}
