/**
 * 监控每日数据统计页面
 */

'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { subDays, format } from 'date-fns';
import { CurdLayout } from '@/components/shared/curd-layout';
import { MonitorApiService } from '@/service/api/monitor.api';
import type { MonitorDailyStats, MonitorDailyStatsQueryRequest } from '../../types';
import {
  FilterLayout,
  FILTER_TYPES,
  FilterFieldConfig
} from '@/components/shared/filter-layout';
import { MonitorStatsPageHeader } from './components/MonitorStatsPageHeader';
import { MonitorStatsTable } from './components/MonitorStatsTable';

export default function MonitorStatsPage() {
  const params = useParams();
  const configId = Number(params.id);

  // 统计页面的筛选配置
  const STATS_FILTERS_CONFIG: FilterFieldConfig<any>[] = [
    {
      type: FILTER_TYPES.DATE_RANGE,
      label: '日期范围',
      startKey: 'start_date',
      endKey: 'end_date'
    }
  ];

  const [loading, setLoading] = React.useState(false);
  const [stats, setStats] = React.useState<MonitorDailyStats[]>([]);

  // 状态管理对齐 FilterLayout 的 values 结构
  const [filters, setFilters] = React.useState({
    start_date: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    end_date: format(new Date(), 'yyyy-MM-dd')
  });

  const fetchStats = React.useCallback(async (searchValues?: any) => {
    if (!configId) return;

    const currentFilters = searchValues || filters;
    if (!currentFilters.start_date || !currentFilters.end_date) return;

    setLoading(true);
    try {
      const request: MonitorDailyStatsQueryRequest = {
        config_id: configId,
        ...currentFilters
      };
      const data = await MonitorApiService.getDailyStats(request);
      setStats(data);
      if (searchValues) setFilters(searchValues);
    } catch (error) {
      console.error('查询每日数据失败:', error);
      setStats([]);
    } finally {
      setLoading(false);
    }
  }, [configId, filters]);

  const handleReset = () => {
    const defaultFilters = {
      start_date: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
      end_date: format(new Date(), 'yyyy-MM-dd')
    };
    setFilters(defaultFilters);
    fetchStats(defaultFilters);
  };

  React.useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <CurdLayout>
      <CurdLayout.Header>
        <MonitorStatsPageHeader onRefresh={() => fetchStats()} />
      </CurdLayout.Header>

      <CurdLayout.Filters>
        <FilterLayout
          config={STATS_FILTERS_CONFIG}
          values={filters}
          onSearch={fetchStats}
          onReset={handleReset}
          loading={loading}
        />
      </CurdLayout.Filters>

      <CurdLayout.Table>
        <MonitorStatsTable data={stats} loading={loading} />
      </CurdLayout.Table>
    </CurdLayout>
  );
}
