import { NavItem } from '@/types/nav';
import {
  Settings,
  Activity,
  Eye,
  ListChecks,
  Ticket,
  Users,
  UserCircle,
  LayoutDashboard,
  Chrome
} from 'lucide-react';

// 系统导航列表
export const navList: NavItem[] = [
  {
    title: '仪表盘',
    url: '/dashboard',
    icon: LayoutDashboard,
    isActive: true
  },
  {
    title: '数据监控',
    url: '#',
    icon: Activity,
    isActive: false,
    items: [
      {
        title: '监控配置',
        url: '/monitor',
        icon: Eye
      },
      {
        title: '任务管理',
        url: '/task',
        icon: ListChecks
      },
      {
        title: '浏览器管理',
        url: '/browser',
        icon: Chrome
      }
    ]
  },
  {
    title: '系统管理',
    url: '#',
    icon: Settings,
    isActive: false,
    items: [
      {
        title: '激活码管理',
        url: '/activation',
        icon: Ticket
      },
      {
        title: '用户管理',
        url: '/user',
        icon: Users
      },
      {
        title: '账号管理',
        url: '/account',
        icon: UserCircle
      }
    ]
  }
];
// 面包屑项类型
export type BreadcrumbItem = {
  title: string;
  link: string;
};

/**
 * 递归生成扁平化路由映射表
 */
const generateRouteMap = (
  items: NavItem[],
  parent: BreadcrumbItem[] = []
): Record<string, BreadcrumbItem[]> => {
  return items.reduce((acc, item) => {
    const current = [...parent, { title: item.title, link: item.url }];
    if (item.url !== '#') acc[item.url] = current;
    return item.items ? { ...acc, ...generateRouteMap(item.items, current) } : acc;
  }, {} as Record<string, BreadcrumbItem[]>);
};

// 导出扁平化路由映射表
export const routeMap = generateRouteMap(navList);

/**
 * 根据当前路径获取面包屑
 */
export const getBreadcrumbs = (path: string): BreadcrumbItem[] => routeMap[path] || [];
