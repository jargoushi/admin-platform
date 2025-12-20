/**
 * 通用状态徽章组件
 */

'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';

export interface StatusConfig {
  label: string;
  color?: string; // 文字颜色类名
  bg?: string; // 背景颜色类名
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

export interface StatusBadgeProps {
  code: number | string;
  configMap: Record<number | string, StatusConfig>;
  fallback?: StatusConfig;
  className?: string;
}

export function StatusBadge({
  code,
  configMap,
  fallback = { label: '未知', variant: 'outline' },
  className = ''
}: StatusBadgeProps) {
  const config = configMap[code] || fallback;

  return (
    <Badge
      variant={config.variant || 'default'}
      className={`px-2 py-0.5 text-[10px] leading-tight font-normal ${config.bg || ''} ${config.color || ''} hover:bg-opacity-80 border-none ${className}`}
    >
      {config.label}
    </Badge>
  );
}
