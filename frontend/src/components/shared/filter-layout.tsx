'use client';

import * as React from 'react';
import { ChevronDown, ChevronUp, Search, RotateCcw, X } from 'lucide-react';
import { format } from 'date-fns';
import { parseAsInteger, parseAsString } from 'nuqs';
import {
  Control,
  Controller,
  FieldValues,
  Path,
  UseFormHandleSubmit,
  useWatch
} from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { DateRangePicker, DateRange } from '@/components/ui/date-range-picker';
import { OptionConfig } from '@/types/common';

// ==================== 类型定义 ====================

export const FILTER_TYPES = {
  INPUT: 'input',
  SELECT: 'select',
  DATE_RANGE: 'date-range'
} as const;

interface BaseFieldConfig {
  label: string;
  advanced?: boolean;
}

export interface InputConfig<T extends FieldValues> extends BaseFieldConfig {
  type: typeof FILTER_TYPES.INPUT;
  key: Path<T>;
}

export interface SelectConfig<T extends FieldValues> extends BaseFieldConfig {
  type: typeof FILTER_TYPES.SELECT;
  key: Path<T>;
  options: OptionConfig[];
}

export interface DateRangeConfig<T extends FieldValues>
  extends BaseFieldConfig {
  type: typeof FILTER_TYPES.DATE_RANGE;
  startKey: Path<T>;
  endKey: Path<T>;
}

export type FilterFieldConfig<T extends FieldValues> =
  | InputConfig<T>
  | SelectConfig<T>
  | DateRangeConfig<T>;

interface FilterLayoutProps<T extends FieldValues> {
  config: FilterFieldConfig<T>[];
  control: Control<T>;
  handleSubmit: UseFormHandleSubmit<T>;
  onSearch: (data: T) => void;
  onReset: () => void;
  loading?: boolean;
}

// ==================== 工具函数 ====================

/**
 * 从筛选配置自动生成 nuqs parsers
 */
export function createFilterParsers<T extends FieldValues>(
  config: FilterFieldConfig<T>[],
  defaultPage = 1,
  defaultSize = 10
): Record<string, unknown> {
  const parsers: Record<string, unknown> = {
    page: parseAsInteger.withDefault(defaultPage),
    size: parseAsInteger.withDefault(defaultSize)
  };

  config.forEach((field) => {
    if (field.type === FILTER_TYPES.DATE_RANGE) {
      parsers[field.startKey as string] = parseAsString;
      parsers[field.endKey as string] = parseAsString;
    } else {
      parsers[field.key as string] =
        field.type === FILTER_TYPES.SELECT ? parseAsInteger : parseAsString;
    }
  });

  return parsers;
}

function getFieldKey<T extends FieldValues>(
  config: FilterFieldConfig<T>
): string {
  return config.type === FILTER_TYPES.DATE_RANGE
    ? String(config.startKey)
    : String(config.key);
}

// ==================== 字段组件 ====================

const FIELD_WIDTH = {
  [FILTER_TYPES.INPUT]: 'w-64',
  [FILTER_TYPES.SELECT]: 'w-30',
  [FILTER_TYPES.DATE_RANGE]: 'w-80'
} as const;

function ClearButton({
  onClick,
  show
}: {
  onClick: () => void;
  show: boolean;
}) {
  if (!show) return null;
  return (
    <button
      type='button'
      onClick={onClick}
      className='hover:bg-accent absolute top-1/2 right-2 z-10 -translate-y-1/2 rounded-sm opacity-0 transition-opacity group-hover:opacity-100'
    >
      <X className='text-muted-foreground hover:text-foreground h-4 w-4' />
    </button>
  );
}

function FilterInput<T extends FieldValues>({
  config,
  control,
  loading
}: {
  config: InputConfig<T>;
  control: Control<T>;
  loading?: boolean;
}) {
  return (
    <Controller
      name={config.key}
      control={control}
      render={({ field }) => (
        <div className='group relative'>
          <Input
            {...field}
            id={String(config.key)}
            value={(field.value as string) ?? ''}
            placeholder='请输入'
            disabled={loading}
            className='h-9 w-full pr-8'
            onChange={(e) => field.onChange(e.target.value || null)}
          />
          <ClearButton
            onClick={() => field.onChange(null)}
            show={Boolean(field.value) && !loading}
          />
        </div>
      )}
    />
  );
}

function FilterSelect<T extends FieldValues>({
  config,
  control,
  loading
}: {
  config: SelectConfig<T>;
  control: Control<T>;
  loading?: boolean;
}) {
  return (
    <Controller
      name={config.key}
      control={control}
      render={({ field }) => {
        const hasValue = field.value != null && field.value !== '';
        return (
          <div className='group relative'>
            <Select
              value={hasValue ? String(field.value) : ''}
              onValueChange={(val) => {
                const option = config.options.find(
                  (opt) => String(opt.code) === val
                );
                field.onChange(option?.code);
              }}
              disabled={loading}
            >
              <SelectTrigger
                id={String(config.key)}
                className={`h-9 w-full ${hasValue ? 'group-hover:[&>svg]:opacity-0' : ''}`}
              >
                <SelectValue placeholder='请选择' />
              </SelectTrigger>
              <SelectContent>
                {config.options.map((opt) => (
                  <SelectItem key={opt.code} value={String(opt.code)}>
                    {opt.desc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <ClearButton
              onClick={() => field.onChange(null)}
              show={hasValue && !loading}
            />
          </div>
        );
      }}
    />
  );
}

function FilterDateRange<T extends FieldValues>({
  config,
  control,
  loading
}: {
  config: DateRangeConfig<T>;
  control: Control<T>;
  loading?: boolean;
}) {
  const { startKey, endKey } = config;
  const startValue = useWatch({ control, name: startKey });
  const endValue = useWatch({ control, name: endKey });

  const value: DateRange | undefined =
    startValue && endValue
      ? {
          from: new Date(startValue as string),
          to: new Date(endValue as string)
        }
      : undefined;

  return (
    <Controller
      name={startKey}
      control={control}
      render={({ field: startField }) => (
        <Controller
          name={endKey}
          control={control}
          render={({ field: endField }) => (
            <DateRangePicker
              id={String(startKey)}
              value={value}
              onChange={(range) => {
                if (range?.from && range?.to) {
                  startField.onChange(format(range.from, 'yyyy-MM-dd'));
                  endField.onChange(format(range.to, 'yyyy-MM-dd'));
                } else {
                  startField.onChange(null);
                  endField.onChange(null);
                }
              }}
              disabled={loading}
            />
          )}
        />
      )}
    />
  );
}

function FilterField<T extends FieldValues>({
  config,
  control,
  loading
}: {
  config: FilterFieldConfig<T>;
  control: Control<T>;
  loading?: boolean;
}) {
  const width = FIELD_WIDTH[config.type];

  return (
    <div className={`${width} flex-shrink-0 space-y-2`}>
      <Label htmlFor={getFieldKey(config)}>{config.label}</Label>
      {config.type === FILTER_TYPES.INPUT && (
        <FilterInput config={config} control={control} loading={loading} />
      )}
      {config.type === FILTER_TYPES.SELECT && (
        <FilterSelect config={config} control={control} loading={loading} />
      )}
      {config.type === FILTER_TYPES.DATE_RANGE && (
        <FilterDateRange config={config} control={control} loading={loading} />
      )}
    </div>
  );
}

// ==================== 主组件 ====================

export function FilterLayout<T extends FieldValues>({
  config,
  control,
  handleSubmit,
  onSearch,
  onReset,
  loading = false
}: FilterLayoutProps<T>) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const primaryFilters = config.filter((c) => !c.advanced);
  const advancedFilters = config.filter((c) => c.advanced);
  const showToggle = advancedFilters.length > 0;

  return (
    <form
      onSubmit={handleSubmit(onSearch)}
      className='bg-card border-border/50 rounded-xl border p-5 shadow-sm'
    >
      <div className='flex flex-col gap-4 md:flex-row'>
        <div className='flex flex-1 flex-wrap items-start gap-4'>
          {primaryFilters.map((c) => (
            <FilterField
              key={getFieldKey(c)}
              config={c}
              control={control}
              loading={loading}
            />
          ))}
        </div>

        <div className='flex shrink-0 items-end gap-2'>
          <Button type='submit' disabled={loading} size='sm' className='h-9'>
            <Search className='mr-2 h-4 w-4' />
            查询
          </Button>
          <Button
            type='button'
            variant='outline'
            onClick={onReset}
            disabled={loading}
            size='sm'
            className='h-9'
          >
            <RotateCcw className='mr-2 h-4 w-4' />
            重置
          </Button>

          {showToggle && (
            <Button
              type='button'
              variant='ghost'
              onClick={() => setIsExpanded(!isExpanded)}
              size='sm'
              className='h-9 gap-1'
            >
              {isExpanded ? '收起' : '展开'}
              {isExpanded ? (
                <ChevronUp className='h-4 w-4' />
              ) : (
                <ChevronDown className='h-4 w-4' />
              )}
            </Button>
          )}
        </div>
      </div>

      {isExpanded && showToggle && (
        <div className='mt-4 border-t pt-4'>
          <div className='flex flex-wrap gap-4'>
            {advancedFilters.map((c) => (
              <FilterField
                key={getFieldKey(c)}
                config={c}
                control={control}
                loading={loading}
              />
            ))}
          </div>
        </div>
      )}
    </form>
  );
}
