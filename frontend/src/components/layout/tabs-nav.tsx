'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTabs } from '@/contexts/tabs-provider';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';

export function TabsNav() {
  const { tabs, activeTabPath, closeTab, closeOtherTabs, closeAllTabs } = useTabs();
  const scrollRef = useRef<HTMLDivElement>(null);

  // 自动滚动到当前激活的标签
  useEffect(() => {
    const activeElement = scrollRef.current?.querySelector('[data-active="true"]');
    if (activeElement) {
      activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    }
  }, [activeTabPath]);

  return (
    <div className="flex w-full items-center bg-background/50 px-4 py-2">
      <div
        ref={scrollRef}
        className="flex flex-1 items-center gap-1 overflow-x-auto no-scrollbar"
      >
        {tabs.map((tab) => (
          <ContextMenu key={tab.path}>
            <ContextMenuTrigger>
              <div
                data-active={activeTabPath === tab.path}
                className={cn(
                  "group relative flex h-9 items-center gap-2 rounded-md px-3 py-1 transition-all duration-200",
                  activeTabPath === tab.path
                    ? "bg-primary/10 text-primary shadow-sm"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                <Link
                  href={tab.path}
                  className="text-sm font-medium whitespace-nowrap"
                >
                  {tab.title}
                </Link>

                {tab.closable && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      closeTab(tab.path);
                    }}
                    className={cn(
                      "flex h-4 w-4 items-center justify-center rounded-full transition-all hover:bg-primary/20 hover:text-primary",
                      activeTabPath === tab.path ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    )}
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}

                {/* 底部激活条 */}
                {activeTabPath === tab.path && (
                  <div className="absolute bottom-0 left-0 h-0.5 w-full bg-primary rounded-full" />
                )}
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem onClick={() => closeTab(tab.path)} disabled={!tab.closable}>
                关闭当前
              </ContextMenuItem>
              <ContextMenuItem onClick={() => closeOtherTabs(tab.path)}>
                关闭其他
              </ContextMenuItem>
              <ContextMenuItem onClick={() => closeAllTabs()}>
                关闭所有
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        ))}
      </div>
    </div>
  );
}
