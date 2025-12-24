'use client';

import * as React from 'react';
import { PageActions } from '@/components/action/page-actions';

interface MonitorStatsPageHeaderProps {
  onRefresh: () => void;
}

export function MonitorStatsPageHeader({ onRefresh }: MonitorStatsPageHeaderProps) {
  return <PageActions onRefresh={onRefresh} />;
}
