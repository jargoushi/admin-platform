'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileQuestion, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className='bg-background relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden p-4'>
      {/* 巨大的背景数字装饰 */}
      <div className='pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden select-none'>
        <span className='text-primary/[0.03] dark:text-primary/[0.05] text-[30vw] leading-none font-black tracking-tighter'>
          404
        </span>
      </div>

      {/* 动态渐变背景 */}
      <div className='pointer-events-none absolute inset-0 overflow-hidden'>
        <div className='bg-primary/10 absolute top-1/4 -left-20 h-80 w-80 animate-pulse rounded-full blur-3xl' />
        <div className='bg-accent/10 absolute -right-20 bottom-1/4 h-80 w-80 animate-pulse rounded-full blur-3xl delay-1000' />
      </div>

      <div className='relative z-10 w-full max-w-md'>
        {/* 玻璃态卡片 */}
        <div className='bg-background/40 border-border/50 flex flex-col items-center rounded-3xl border p-8 text-center shadow-2xl backdrop-blur-2xl backdrop-saturate-150'>
          {/* 浮动图标 */}
          <div className='bg-primary/10 mb-6 flex h-20 w-20 animate-bounce items-center justify-center rounded-2xl'>
            <FileQuestion className='text-primary h-10 w-10' />
          </div>

          <h1 className='mb-2 text-3xl font-bold tracking-tight'>页面不见了</h1>
          <p className='text-muted-foreground mb-8 text-balance'>
            抱歉，您访问的页面不存在或已被移除。请检查网址是否正确，或返回首页。
          </p>

          {/* 操作按钮 */}
          <div className='grid w-full grid-cols-1 gap-3 sm:grid-cols-2'>
            <Button
              asChild
              size='lg'
              className='group relative overflow-hidden rounded-xl font-medium transition-all hover:shadow-lg active:scale-95'
            >
              <Link href='/'>
                <Home className='mr-2 h-4 w-4 transition-transform group-hover:scale-110' />
                返回首页
              </Link>
            </Button>
            <Button
              onClick={() => window.history.back()}
              variant='outline'
              size='lg'
              className='hover:bg-accent/50 rounded-xl font-medium transition-all active:scale-95'
            >
              <ArrowLeft className='mr-2 h-4 w-4' />
              回到上一页
            </Button>
          </div>
        </div>

        {/* 底部装饰文字 */}
        <p className='text-muted-foreground/40 mt-8 text-center text-xs font-medium tracking-widest uppercase'>
          N Admin Page Not Found
        </p>
      </div>
    </div>
  );
}
