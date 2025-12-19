'use client';
import React from 'react';
import { Breadcrumbs } from './breadcrumbs';
import { ModeToggle } from './mode-toggle';
import { NavUser } from './nav-user';

export default function Header() {
  return (
    <header className='bg-background/80 supports-[backdrop-filter]:bg-background/60 border-border/50 sticky top-0 z-10 border-b backdrop-blur-xl backdrop-saturate-150'>
      <div className='flex h-16 shrink-0 items-center gap-2'>
        {/* 左侧：面包屑 */}
        <div className='flex min-w-0 flex-1 items-center gap-2 px-3 sm:px-4'>
          <div className='min-w-0 flex-1'>
            <Breadcrumbs />
          </div>
        </div>

        {/* 右侧：主题切换 + 用户信息 */}
        <div className='flex items-center gap-2 px-3 sm:gap-4 sm:px-4'>
          <ModeToggle />
          <NavUser />
        </div>
      </div>
    </header>
  );
}
