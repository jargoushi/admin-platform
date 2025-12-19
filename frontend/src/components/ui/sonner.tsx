'use client';

import { useTheme } from 'next-themes';
import { Toaster as Sonner, ToasterProps } from 'sonner';

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className='toaster group'
      position='top-center'
      duration={2000}
      richColors
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-md group-[.toaster]:rounded-lg group-[.toaster]:px-6 group-[.toaster]:py-3 group-[.toaster]:min-w-[300px]',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton:
            'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton:
            'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
          success:
            'group-[.toaster]:border-green-200 group-[.toaster]:bg-green-50 group-[.toaster]:text-green-700 dark:group-[.toaster]:bg-green-950/30 dark:group-[.toaster]:border-green-900/50 dark:group-[.toaster]:text-green-400',
          error:
            'group-[.toaster]:border-red-200 group-[.toaster]:bg-red-50 group-[.toaster]:text-red-700 dark:group-[.toaster]:bg-red-950/30 dark:group-[.toaster]:border-red-900/50 dark:group-[.toaster]:text-red-400',
          info: 'group-[.toaster]:border-blue-200 group-[.toaster]:bg-blue-50 group-[.toaster]:text-blue-700 dark:group-[.toaster]:bg-blue-950/30 dark:group-[.toaster]:border-blue-900/50 dark:group-[.toaster]:text-blue-400',
          warning:
            'group-[.toaster]:border-yellow-200 group-[.toaster]:bg-yellow-50 group-[.toaster]:text-yellow-700 dark:group-[.toaster]:bg-yellow-950/30 dark:group-[.toaster]:border-yellow-900/50 dark:group-[.toaster]:text-yellow-400'
        }
      }}
      {...props}
    />
  );
};

export { Toaster };
