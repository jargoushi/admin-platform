import React from 'react';
import { Badge } from '@/components/ui/badge';
import { SmartEnum, EnumItem } from '@/lib/enum';

export interface StatusBadgeProps {
  /** 业务代码 */
  code: number | string | undefined | null;
  /** 智能枚举实例 */
  enum: SmartEnum<EnumItem>;
  /** 回退配置 */
  fallback?: Partial<EnumItem>;
  /** 额外类名 */
  className?: string;
}

export function StatusBadge({
  code,
  enum: enumInstance,
  fallback = { label: '未知', variant: 'outline' },
  className = ''
}: StatusBadgeProps) {
  const config = enumInstance.get(code) || fallback;

  return (
    <Badge
      variant={config.variant || 'default'}
      className={`px-2 py-0.5 text-[10px] leading-tight font-normal ${config.bg || ''} ${config.color || ''} hover:bg-opacity-80 border-none ${className}`}
    >
      {config.label}
    </Badge>
  );
}

