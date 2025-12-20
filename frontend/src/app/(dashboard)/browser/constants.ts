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

export const BROWSER_STATUS = {
  0: { label: '未打开', color: 'text-gray-500', bg: 'bg-gray-100' },
  1: { label: '已打开', color: 'text-green-500', bg: 'bg-green-100' },
  2: { label: '异常', color: 'text-red-500', bg: 'bg-red-100' }
};
