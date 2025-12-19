'use client';

import PageContainer from '@/components/layout/page-container';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Activity,
  BarChart3,
  CheckCircle2,
  Clock,
  Monitor,
  Plus,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';

// 模拟统计数据
const stats = [
  {
    title: '任务总量',
    value: '1,284',
    description: '今日新增 +12%',
    icon: BarChart3,
    color: 'text-blue-500'
  },
  {
    title: '活跃监控',
    value: '42',
    description: '运行中 38 个',
    icon: Monitor,
    color: 'text-purple-500'
  },
  {
    title: '任务成功率',
    value: '98.5%',
    description: '较昨日提升 0.2%',
    icon: CheckCircle2,
    color: 'text-emerald-500'
  },
  {
    title: '激活码余量',
    value: '156',
    description: '建议及时补充',
    icon: Zap,
    color: 'text-amber-500'
  }
];

// 模拟趋势图数据
const chartData = [
  { date: '2025-12-13', success: 120, failed: 5 },
  { date: '2025-12-14', success: 150, failed: 8 },
  { date: '2025-12-15', success: 180, failed: 12 },
  { date: '2025-12-16', success: 140, failed: 4 },
  { date: '2025-12-17', success: 210, failed: 15 },
  { date: '2025-12-18', success: 250, failed: 10 },
  { date: '2025-12-19', success: 230, failed: 7 }
];

// 模拟最近活动
const recentActivities = [
  {
    id: 1,
    user: 'Admin',
    action: '创建了监控配置',
    target: '创建了监控配置',
    time: '2 分钟前',
    status: 'success'
  },
  {
    id: 2,
    user: 'System',
    action: '自动执行任务',
    target: '自动执行任务',
    time: '15 分钟前',
    status: 'success'
  },
  {
    id: 3,
    user: 'User_08',
    action: '激活了账号',
    target: '高级会员',
    time: '1 小时前',
    status: 'info'
  },
  {
    id: 4,
    user: 'System',
    action: '任务执行失败',
    target: '视频号 - 数据同步',
    time: '2 小时前',
    status: 'error'
  }
];

export default function DashboardPage() {
  return (
    <PageContainer scrollable={true}>
      <div className='flex w-full flex-col space-y-6'>
        {/* 欢迎语 */}
        <div className='flex items-center justify-between'>
          <div>
            <h2 className='text-3xl font-bold tracking-tight'>仪表盘概览</h2>
            <p className='text-muted-foreground'>
              欢迎回来，这是您系统的实时运行状态。
            </p>
          </div>
          <div className='flex items-center gap-2'>
            <Button>
              <Plus className='mr-2 h-4 w-4' /> 新建监控
            </Button>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
          {stats.map((stat) => (
            <Card
              key={stat.title}
              className='border-border/50 overflow-hidden shadow-sm transition-all hover:shadow-md'
            >
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{stat.value}</div>
                <p className='text-muted-foreground mt-1 text-xs'>
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
          {/* 趋势图表 */}
          <Card className='border-border/50 col-span-4 shadow-sm'>
            <CardHeader>
              <CardTitle>任务执行趋势</CardTitle>
              <CardDescription>过去 7 天的任务执行情况统计</CardDescription>
            </CardHeader>
            <CardContent className='pl-2'>
              <div className='h-[300px] w-full'>
                <ResponsiveContainer width='100%' height='100%'>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient
                        id='colorSuccess'
                        x1='0'
                        y1='0'
                        x2='0'
                        y2='1'
                      >
                        <stop
                          offset='5%'
                          stopColor='hsl(var(--primary))'
                          stopOpacity={0.3}
                        />
                        <stop
                          offset='95%'
                          stopColor='hsl(var(--primary))'
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray='3 3'
                      vertical={false}
                      stroke='hsl(var(--border))'
                    />
                    <XAxis
                      dataKey='date'
                      stroke='hsl(var(--muted-foreground))'
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) =>
                        value.split('-').slice(1).join('/')
                      }
                    />
                    <YAxis
                      stroke='hsl(var(--muted-foreground))'
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${value}`}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className='bg-background border-border rounded-lg border p-2 shadow-md'>
                              <p className='text-xs font-medium'>
                                {payload[0].payload.date}
                              </p>
                              <div className='mt-1 flex flex-col gap-1'>
                                <p className='text-primary text-xs'>
                                  成功:{' '}
                                  <span className='font-bold'>
                                    {payload[0].value}
                                  </span>
                                </p>
                                <p className='text-destructive text-xs'>
                                  失败:{' '}
                                  <span className='font-bold'>
                                    {payload[1].value}
                                  </span>
                                </p>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area
                      type='monotone'
                      dataKey='success'
                      stroke='hsl(var(--primary))'
                      strokeWidth={2}
                      fillOpacity={1}
                      fill='url(#colorSuccess)'
                    />
                    <Area
                      type='monotone'
                      dataKey='failed'
                      stroke='hsl(var(--destructive))'
                      strokeWidth={2}
                      fill='transparent'
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* 最近活动 */}
          <Card className='border-border/50 col-span-3 shadow-sm'>
            <CardHeader>
              <CardTitle>最近活动</CardTitle>
              <CardDescription>系统内最新的操作记录</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-8'>
                {recentActivities.map((activity) => (
                  <div key={activity.id} className='flex items-center'>
                    <div
                      className={`mr-4 rounded-full p-2 ${
                        activity.status === 'success'
                          ? 'bg-emerald-500/10 text-emerald-500'
                          : activity.status === 'error'
                            ? 'bg-destructive/10 text-destructive'
                            : 'bg-blue-500/10 text-blue-500'
                      }`}
                    >
                      <Activity className='h-4 w-4' />
                    </div>
                    <div className='min-w-0 flex-1 space-y-1'>
                      <p className='text-sm leading-none font-medium'>
                        {activity.user}{' '}
                        <span className='text-muted-foreground font-normal'>
                          {activity.action}
                        </span>
                      </p>
                      <p className='text-muted-foreground truncate text-xs'>
                        {activity.target}
                      </p>
                    </div>
                    <div className='text-muted-foreground ml-auto flex items-center text-xs'>
                      <Clock className='mr-1 h-3 w-3' />
                      {activity.time}
                    </div>
                  </div>
                ))}
              </div>
              <Button variant='ghost' className='mt-6 w-full text-xs'>
                查看全部动态
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
