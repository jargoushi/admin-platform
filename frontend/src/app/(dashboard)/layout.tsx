import type { Metadata } from 'next';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/app-sidebar';
import Header from '@/components/layout/header';
import Providers from '@/contexts/providers';

export const metadata: Metadata = {
  title: 'N Admin',
  description: '现代化的后台管理系统'
};

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* 全局背景装饰 - 仅在后台显示 */}
      <div className='pointer-events-none fixed inset-0 -z-10 overflow-hidden'>
        <div className='bg-primary/5 absolute -top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full blur-[120px]' />
        <div className='bg-accent/5 absolute top-[10%] -right-[10%] h-[40%] w-[40%] rounded-full blur-[120px]' />
        <div className='bg-primary/3 absolute bottom-[-10%] left-[20%] h-[40%] w-[40%] rounded-full blur-[120px]' />
        <div className='bg-background absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] opacity-20' />
      </div>

      <Providers>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset className='relative'>
            {/* 页面内背景装饰 */}
            <div className='pointer-events-none fixed inset-0 overflow-hidden'>
              <div className='bg-primary/5 absolute -top-40 -right-40 h-80 w-80 rounded-full blur-3xl' />
              <div className='bg-accent/5 absolute -bottom-40 -left-40 h-80 w-80 rounded-full blur-3xl' />
              <div className='bg-primary/3 absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl' />
            </div>

            <Header />
            <div className='relative'>{children}</div>
          </SidebarInset>
        </SidebarProvider>
      </Providers>
    </>
  );
}
