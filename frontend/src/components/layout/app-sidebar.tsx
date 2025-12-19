'use client';

import * as React from 'react';

import { Sidebar, SidebarContent, useSidebar } from '@/components/ui/sidebar';
import { NavMain } from './nav-main';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { setOpen } = useSidebar();

  return (
    <Sidebar
      variant='inset'
      collapsible='icon'
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}
    >
      <SidebarContent>
        <NavMain />
      </SidebarContent>
    </Sidebar>
  );
}
