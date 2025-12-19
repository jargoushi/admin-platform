'use client';

import * as React from 'react';
import {
  format,
  startOfToday,
  endOfToday,
  startOfYesterday,
  endOfYesterday,
  subDays,
  subMonths
} from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { SelectRangeEventHandler, type DateRange } from 'react-day-picker';

// 导入 shadcn/ui 基础组件
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Calendar } from './calendar';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

export { type DateRange };

/**
 * 默认占位符
 */
const DEFAULT_PLACEHOLDER = '开始时间  ~  结束时间';

interface DateRangePickerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: DateRange;
  onChange: (range: DateRange | undefined) => void;
  disabled?: boolean;
  align?: 'start' | 'center' | 'end';
}

/**
 * 日期范围选择器组件
 */
export function DateRangePicker({
  className,
  value,
  onChange,
  disabled,
  align = 'start',
  ...props
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [internalRange, setInternalRange] = React.useState<
    DateRange | undefined
  >(value);

  React.useEffect(() => {
    setInternalRange(value);
  }, [value]);

  const handleSelect: SelectRangeEventHandler = (range) => {
    setInternalRange(range);

    if (range?.from && range?.to) {
      onChange(range as DateRange);
      setIsOpen(false);
    } else if (!range?.from && !range?.to) {
      onChange(undefined);
    }
  };

  /**
   * 快捷选项配置
   */
  const presets = [
    {
      label: '今天',
      getValue: () => ({
        from: startOfToday(),
        to: endOfToday()
      })
    },
    {
      label: '昨天',
      getValue: () => ({
        from: startOfYesterday(),
        to: endOfYesterday()
      })
    },
    {
      label: '最近一周',
      getValue: () => ({
        from: subDays(startOfToday(), 6),
        to: endOfToday()
      })
    },
    {
      label: '最近一个月',
      getValue: () => ({
        from: subMonths(startOfToday(), 1),
        to: endOfToday()
      })
    }
  ];

  const handlePresetClick = (getValue: () => DateRange) => {
    const range = getValue();
    setInternalRange(range);
    onChange(range);
    setIsOpen(false);
  };

  /**
   * 清空操作处理函数
   */
  const handleClear = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      setInternalRange(undefined);
      onChange(undefined);
      setIsOpen(false);
    },
    [onChange]
  );

  // 显示值的计算
  const displayValue = React.useMemo(() => {
    if (value?.from && value?.to) {
      const start = format(value.from, 'yyyy-MM-dd');
      const end = format(value.to, 'yyyy-MM-dd');
      return `${start} ~ ${end}`;
    }
    return DEFAULT_PLACEHOLDER;
  }, [value]);

  const hasCompleteValue = !!value?.from && !!value?.to;

  return (
    <div className={cn('grid', className)} {...props}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id='date'
            variant={'outline'}
            className={cn(
              'relative h-9 w-64 justify-start pr-3 text-left font-normal',
              !hasCompleteValue && 'text-muted-foreground'
            )}
            disabled={disabled}
          >
            <CalendarIcon className='mr-2 h-4 w-4 shrink-0' />
            <span className='flex-1 truncate overflow-hidden'>
              {displayValue}
            </span>

            {hasCompleteValue && !disabled && (
              <div
                className='absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer p-1'
                onClick={handleClear}
                title='清空日期范围'
              >
                <X className='text-muted-foreground hover:text-foreground h-4 w-4 shrink-0 transition-colors' />
              </div>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0' align={align}>
          <div className='flex h-[340px]'>
            {/* 侧边快捷选项 */}
            <div className='bg-muted/30 flex w-28 flex-col gap-1 border-r p-2'>
              {presets.map((preset) => (
                <Button
                  key={preset.label}
                  variant='ghost'
                  size='sm'
                  className='hover:bg-primary/10 hover:text-primary justify-start font-normal transition-colors'
                  onClick={() => handlePresetClick(preset.getValue)}
                >
                  {preset.label}
                </Button>
              ))}
            </div>

            {/* 日历区域 */}
            <div className='p-2'>
              <Calendar
                initialFocus
                mode='range'
                defaultMonth={internalRange?.from}
                selected={internalRange}
                onSelect={handleSelect}
                numberOfMonths={2}
                locale={zhCN}
                className='p-0'
                classNames={{
                  months: 'flex flex-row gap-4',
                  month: 'space-y-4',
                  caption:
                    'flex justify-center pt-1 relative items-center h-10',
                  caption_label: 'text-sm font-semibold',
                  table: 'w-full border-collapse space-y-1',
                  head_row: 'flex',
                  head_cell:
                    'text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]',
                  row: 'flex w-full mt-2',
                  cell: 'h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
                  day: cn(
                    'h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-accent rounded-md transition-all'
                  ),
                  day_range_start:
                    'day-range-start aria-selected:bg-primary aria-selected:text-primary-foreground',
                  day_range_end:
                    'day-range-end aria-selected:bg-primary aria-selected:text-primary-foreground',
                  day_selected:
                    'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
                  day_today: 'bg-accent text-accent-foreground',
                  day_outside:
                    'day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30',
                  day_disabled: 'text-muted-foreground opacity-50',
                  day_range_middle:
                    'aria-selected:bg-accent aria-selected:text-accent-foreground',
                  day_hidden: 'invisible'
                }}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
