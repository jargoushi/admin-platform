'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem
} from '@/components/ui/sidebar';
import { navList } from '@/constants/router';
import { NavItem } from '@/types/nav';

export function NavMain() {
  const pathname = usePathname();

  // 检查是否为当前路径或其子路径
  const isActivePath = (url: string): boolean => {
    if (url === '#') return false;
    return pathname === url || pathname.startsWith(url + '/');
  };

  // 检查是否有子项被激活
  const hasActiveChild = (items: NavItem[]): boolean => {
    return items.some(
      (item) =>
        isActivePath(item.url) || (item.items && hasActiveChild(item.items))
    );
  };

  return (
    <SidebarGroup>
      <SidebarMenu>
        {navList.map((item) => {
          const isItemActive = isActivePath(item.url);
          const hasActiveSubItem = item.items
            ? hasActiveChild(item.items)
            : false;
          const shouldOpen = isItemActive || hasActiveSubItem;

          return (
            <Collapsible key={item.title} asChild defaultOpen={shouldOpen}>
              <SidebarMenuItem>
                {item.items?.length ? (
                  <>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.title}
                        isActive={isItemActive}
                        className='cursor-pointer'
                      >
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={isActivePath(subItem.url)}
                            >
                              <Link href={subItem.url}>
                                {subItem.icon && <subItem.icon />}
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </>
                ) : (
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={isItemActive}
                  >
                    <Link href={item.url}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
