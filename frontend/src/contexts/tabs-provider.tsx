'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getBreadcrumbs } from '@/constants/router';

export interface Tab {
  title: string;
  path: string;
  closable: boolean;
}

interface TabsContextType {
  tabs: Tab[];
  activeTabPath: string;
  addTab: (tab: Tab) => void;
  closeTab: (path: string) => void;
  closeOtherTabs: (path: string) => void;
  closeAllTabs: () => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

const STORAGE_KEY = 'admin-platform-tabs';
const HOME_PATH = '/dashboard';

export function TabsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const prevTabsLength = React.useRef(0);

  // 初始化：从 localStorage 加载或添加首页
  useEffect(() => {
    const savedTabs = localStorage.getItem(STORAGE_KEY);
    let initialTabs: Tab[] = [];

    if (savedTabs) {
      try {
        initialTabs = JSON.parse(savedTabs);
      } catch (e) {
        console.error('Failed to parse saved tabs', e);
      }
    }

    // 确保首页始终存在且不可关闭
    if (!initialTabs.find(t => t.path === HOME_PATH)) {
      initialTabs.unshift({ title: '首页', path: HOME_PATH, closable: false });
    }

    setTabs(initialTabs);
    prevTabsLength.current = initialTabs.length;
    setIsInitialized(true);
  }, []);

  // 持久化
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tabs));
    }
  }, [tabs, isInitialized]);

  // 监听标签页变化，如果当前路径对应的标签被关闭，则跳转到最后一个标签
  useEffect(() => {
    if (!isInitialized || tabs.length === 0) return;

    const isCurrentPathOpen = tabs.some(t => t.path === pathname);

    // 核心修复：仅当标签页数量减少（说明发生了关闭操作）且当前路径不再存在时，才触发跳转
    if (!isCurrentPathOpen && tabs.length < prevTabsLength.current) {
      const lastTab = tabs[tabs.length - 1];
      router.push(lastTab.path);
    }

    // 更新引用，记录当前长度
    prevTabsLength.current = tabs.length;
  }, [tabs, pathname, router, isInitialized]);

  // 监听路由变化，自动添加标签
  useEffect(() => {
    if (!isInitialized) return;

    const breadcrumbs = getBreadcrumbs(pathname);
    if (breadcrumbs.length > 0) {
      const lastBreadcrumb = breadcrumbs[breadcrumbs.length - 1];
      const newTab: Tab = {
        title: lastBreadcrumb.title,
        path: pathname,
        closable: pathname !== HOME_PATH
      };

      setTabs(prev => {
        if (prev.find(t => t.path === pathname)) return prev;
        return [...prev, newTab];
      });
    }
  }, [pathname, isInitialized]);

  const addTab = useCallback((tab: Tab) => {
    setTabs(prev => {
      if (prev.find(t => t.path === tab.path)) return prev;
      return [...prev, tab];
    });
  }, []);

  const closeTab = useCallback((path: string) => {
    setTabs(prev => {
      const tabToClose = prev.find(t => t.path === path);
      if (!tabToClose || !tabToClose.closable) return prev;
      return prev.filter(t => t.path !== path);
    });
  }, []);

  const closeOtherTabs = useCallback((path: string) => {
    setTabs(prev => {
      const currentTab = prev.find(t => t.path === path);
      const homeTab = prev.find(t => t.path === HOME_PATH);

      const newTabs = [];
      if (homeTab) newTabs.push(homeTab);
      if (currentTab && currentTab.path !== HOME_PATH) newTabs.push(currentTab);

      return newTabs;
    });
  }, []);

  const closeAllTabs = useCallback(() => {
    setTabs(prev => {
      const homeTab = prev.find(t => t.path === HOME_PATH);
      return homeTab ? [homeTab] : [{ title: '首页', path: HOME_PATH, closable: false }];
    });
  }, []);

  return (
    <TabsContext.Provider value={{
      tabs,
      activeTabPath: pathname,
      addTab,
      closeTab,
      closeOtherTabs,
      closeAllTabs
    }}>
      {children}
    </TabsContext.Provider>
  );
}

export function useTabs() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('useTabs must be used within a TabsProvider');
  }
  return context;
}
