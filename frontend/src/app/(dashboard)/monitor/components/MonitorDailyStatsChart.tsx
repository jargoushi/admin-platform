/**
 * 监控每日数据统计图表组件
 *
 * @description
 * 展示指定监控配置的每日数据趋势图表
 * 包括粉丝数、获赞数、播放量、内容数的变化趋势
 */

'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  DateRangePicker,
  type DateRange
} from '@/components/ui/date-range-picker';
import { MonitorApiService } from '@/service/api/monitor.api';
import type {
  MonitorConfig,
  MonitorDailyStatsQueryRequest,
  MonitorDailyStats
} from '../types';
import { Loader2, TrendingUp, TrendingDown } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface MonitorDailyStatsChartProps {
  /** 监控配置（从 GenericDialogs 传递） */
  data?: MonitorConfig;
}

export function MonitorDailyStatsChart({
  data: config
}: MonitorDailyStatsChartProps) {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<MonitorDailyStats[]>([]);

  // 默认查询最近30天
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date()
  });

  /**
   * 查询数据
   */
  const fetchStats = useCallback(async () => {
    if (!config) return;
    if (!dateRange?.from || !dateRange?.to) return;

    setLoading(true);
    try {
      const request: MonitorDailyStatsQueryRequest = {
        config_id: config.id,
        start_date: format(dateRange!.from!, 'yyyy-MM-dd'),
        end_date: format(dateRange!.to!, 'yyyy-MM-dd')
      };
      const data = await MonitorApiService.getDailyStats(request);
      setStats(data);
    } catch (error) {
      console.error('查询每日数据失败:', error);
      setStats([]);
    } finally {
      setLoading(false);
    }
  }, [config, dateRange]);

  /**
   * 计算数据变化趋势
   */
  const trends = useMemo(() => {
    if (stats.length < 2) {
      return {
        follower: 0,
        liked: 0,
        view: 0,
        content: 0
      };
    }

    const latest = stats[stats.length - 1];
    const previous = stats[stats.length - 2];

    return {
      follower: latest.follower_count - previous.follower_count,
      liked: latest.liked_count - previous.liked_count,
      view: latest.view_count - previous.view_count,
      content: latest.content_count - previous.content_count
    };
  }, [stats]);

  /**
   * 格式化数字
   */
  const formatNumber = (num: number): string => {
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + 'w';
    }
    return num.toLocaleString();
  };

  /**
   * 渲染趋势指示器
   */
  const renderTrend = (value: number) => {
    if (value > 0) {
      return (
        <span className='flex items-center text-xs text-green-600'>
          <TrendingUp className='mr-1 h-3 w-3' />+{formatNumber(value)}
        </span>
      );
    } else if (value < 0) {
      return (
        <span className='flex items-center text-xs text-red-600'>
          <TrendingDown className='mr-1 h-3 w-3' />
          {formatNumber(value)}
        </span>
      );
    }
    return <span className='text-muted-foreground text-xs'>-</span>;
  };

  // 初始加载
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // 最新数据
  const latestStats = stats.length > 0 ? stats[stats.length - 1] : null;

  // 如果没有配置数据，显示加载状态
  if (!config) {
    return (
      <div className='flex items-center justify-center py-8'>
        <div className='text-muted-foreground'>加载中...</div>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {/* 查询条件 */}
      <Card>
        <CardHeader>
          <CardTitle className='text-base'>数据查询</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex items-end gap-4'>
            <div className='flex-1 space-y-2'>
              <Label>日期范围</Label>
              <DateRangePicker
                value={dateRange}
                onChange={(range) => {
                  if (range?.from && range?.to) {
                    setDateRange(range);
                  }
                }}
                disabled={loading}
              />
            </div>
            <Button onClick={fetchStats} disabled={loading}>
              {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              查询
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 数据概览卡片 */}
      {latestStats && (
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-muted-foreground text-sm font-medium'>
                粉丝数
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {formatNumber(latestStats.follower_count)}
              </div>
              <div className='mt-1'>{renderTrend(trends.follower)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-muted-foreground text-sm font-medium'>
                获赞数
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {formatNumber(latestStats.liked_count)}
              </div>
              <div className='mt-1'>{renderTrend(trends.liked)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-muted-foreground text-sm font-medium'>
                播放量
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {formatNumber(latestStats.view_count)}
              </div>
              <div className='mt-1'>{renderTrend(trends.view)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-muted-foreground text-sm font-medium'>
                内容数
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {formatNumber(latestStats.content_count)}
              </div>
              <div className='mt-1'>{renderTrend(trends.content)}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 数据表格 */}
      <Card>
        <CardHeader>
          <CardTitle className='text-base'>每日明细数据</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className='flex items-center justify-center py-8'>
              <Loader2 className='text-muted-foreground h-8 w-8 animate-spin' />
            </div>
          ) : stats.length === 0 ? (
            <div className='text-muted-foreground py-8 text-center'>
              暂无数据
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full text-sm'>
                <thead>
                  <tr className='border-b'>
                    <th className='px-4 py-2 text-left'>日期</th>
                    <th className='px-4 py-2 text-right'>粉丝数</th>
                    <th className='px-4 py-2 text-right'>获赞数</th>
                    <th className='px-4 py-2 text-right'>播放量</th>
                    <th className='px-4 py-2 text-right'>内容数</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.map((stat) => (
                    <tr key={stat.id} className='hover:bg-muted/50 border-b'>
                      <td className='px-4 py-2'>
                        {format(new Date(stat.stat_date), 'yyyy-MM-dd', {
                          locale: zhCN
                        })}
                      </td>
                      <td className='px-4 py-2 text-right'>
                        {formatNumber(stat.follower_count)}
                      </td>
                      <td className='px-4 py-2 text-right'>
                        {formatNumber(stat.liked_count)}
                      </td>
                      <td className='px-4 py-2 text-right'>
                        {formatNumber(stat.view_count)}
                      </td>
                      <td className='px-4 py-2 text-right'>
                        {formatNumber(stat.content_count)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
