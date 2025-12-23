'use client';

import * as React from 'react';
import { PageHeader } from '@/components/table/page-header';

interface MonitorStatsPageHeaderProps {
  onRefresh: () => void;
}

export function MonitorStatsPageHeader({ onRefresh }: MonitorStatsPageHeaderProps) {
  return <PageHeader onRefresh={onRefresh} />;
}
