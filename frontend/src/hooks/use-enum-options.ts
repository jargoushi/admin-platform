/**
 * 通用枚举选项加载 Hook
 *
 * @description
 * 从 API 加载枚举选项并转换为 SmartEnum 格式
 *
 * @example
 * const channelEnum = useEnumOptions(CommonApiService.getChannels);
 * const projectEnum = useEnumOptions(CommonApiService.getProjects);
 */

'use client';

import * as React from 'react';
import { SmartEnum, EnumItem } from '@/lib/enum';

/** API 返回的选项格式 */
interface ApiOption {
  code: number;
  desc: string;
}

/**
 * 通用枚举选项加载 Hook
 * @param fetcher API 获取函数
 * @returns SmartEnum 或 null（加载中）
 */
export function useEnumOptions(
  fetcher: () => Promise<ApiOption[]>
): SmartEnum<EnumItem> | null {
  const [enumData, setEnumData] = React.useState<SmartEnum<EnumItem> | null>(null);

  React.useEffect(() => {
    fetcher().then((items) => {
      setEnumData(new SmartEnum(items.map(i => ({ code: i.code, label: i.desc }))));
    });
  }, []);

  return enumData;
}
