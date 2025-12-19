/**
 * 全局根布局
 *
 * @description
 * 系统的唯一根布局，包含 HTML、Body 结构及全局基础配置
 */

import { Metadata } from 'next';
import { geistSans, geistMono } from '@/lib/fonts';
import '@/app/globals.css';
import { Toaster } from '@/components/ui/sonner';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

export const metadata: Metadata = {
  title: {
    template: '%s | N Admin',
    default: 'N Admin'
  },
  description: '现代化的后台管理系统'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground relative min-h-screen antialiased`}
      >
        <NuqsAdapter>
          <Toaster />
          {children}
        </NuqsAdapter>
      </body>
    </html>
  );
}
