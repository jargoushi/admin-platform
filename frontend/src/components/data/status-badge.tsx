import React from 'react';
import { Badge } from '@/components/ui/badge';
import { SmartEnum, EnumItem } from '@/lib/enum';

export interface StatusBadgeProps {
  /** 业务代码 */
  code: number | string | undefined | null;
  /** 智能枚举实例 */
  enum: SmartEnum<EnumItem>;
}

export function StatusBadge({
  code,
  enum: enumInstance
}: StatusBadgeProps) {
  const config = enumInstance.get(code) || { label: '未知', variant: 'outline' as const };

  return (
    <Badge
      variant={config.variant || 'default'}
      className='px-2.5 py-1 text-xs font-medium rounded-full border-0'
    >
      {config.label}
    </Badge>
  );
}

