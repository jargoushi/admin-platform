/**
 * 浏览器管理模块常量定义
 */

import {
  FilterFieldConfig,
  FILTER_TYPES
} from '@/components/shared/filter-layout';
import { BrowserListRequest } from './types';

export const DEFAULT_QUERY_PARAMS: BrowserListRequest = {
  page: 1,
  size: 10,
  name: '',
  groupId: ''
};

export const FILTERS_CONFIG: FilterFieldConfig<BrowserListRequest>[] = [
  {
    key: 'name',
    label: '窗口名称',
    type: FILTER_TYPES.INPUT
  },
  {
    key: 'groupId',
    label: '分组ID',
    type: FILTER_TYPES.INPUT
  }
];

import { SmartEnum } from '@/lib/enum';

// ... (DEFAULT_QUERY_PARAMS, FILTERS_CONFIG 不变)

export const BROWSER_STATUS_ENUM = new SmartEnum([
  { code: 0, label: '未打开', variant: 'outline', color: 'text-gray-500', bg: 'bg-gray-100' },
  { code: 1, label: '已打开', variant: 'default', color: 'text-green-500', bg: 'bg-green-100' },
  { code: 2, label: '异常', variant: 'destructive', color: 'text-red-500', bg: 'bg-red-100' }
]);

