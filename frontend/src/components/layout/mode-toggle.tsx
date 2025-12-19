'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';

/**
 * 主题切换按钮
 * 点击在浅色和深色模式之间切换
 */
export function ModeToggle() {
  const { setTheme, theme } = useTheme();

  /**
   * 切换主题
   * 浅色 → 深色
   * 深色 → 浅色
   * 其他 → 浅色（默认）
   */
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Button
      variant='outline'
      size='sm'
      className='h-8 w-8 px-0'
      onClick={toggleTheme}
      aria-label='切换主题'
    >
      <Sun className='h-4 w-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90' />
      <Moon className='absolute h-4 w-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0' />
      <span className='sr-only'>切换主题</span>
    </Button>
  );
}
