/**
 * 多选下拉组件
 *
 * @description
 * 通用的多选下拉组件，支持标签展示和多选
 * 使用 SmartEnum.options 格式 {code, desc}
 */

'use client';

import * as React from 'react';
import { ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';

/** 选项格式：与 SmartEnum.options 一致 */
interface SelectOption {
  code: number;
  desc: string;
}

interface MultiSelectProps {
  /** 选项列表 */
  options: SelectOption[];
  /** 已选中的值 (code 数组) */
  value: number[];
  /** 选中值变化回调 */
  onChange: (value: number[]) => void;
  /** 占位符 */
  placeholder?: string;
  /** 自定义类名 */
  className?: string;
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = '请选择',
  className
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  // 获取已选择的选项
  const selectedOptions = React.useMemo(
    () => options.filter((opt) => value.includes(opt.code)),
    [options, value]
  );

  // 切换选项
  const handleToggle = (code: number) => {
    if (value.includes(code)) {
      onChange(value.filter((v) => v !== code));
    } else {
      onChange([...value, code]);
    }
  };

  // 移除单个
  const handleRemove = (code: number, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(value.filter((v) => v !== code));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          className={cn(
            'h-auto min-h-9 w-full justify-between px-3 py-1.5',
            className
          )}
        >
          <div className='flex flex-1 flex-wrap gap-1'>
            {selectedOptions.length === 0 ? (
              <span className='text-muted-foreground font-normal'>
                {placeholder}
              </span>
            ) : (
              <>
                {selectedOptions.slice(0, 2).map((opt) => (
                  <Badge
                    key={opt.code}
                    variant='secondary'
                    className='text-xs font-normal'
                  >
                    {opt.desc}
                    <X
                      className='hover:text-destructive ml-1 h-3 w-3 cursor-pointer'
                      onClick={(e) => handleRemove(opt.code, e)}
                    />
                  </Badge>
                ))}
                {selectedOptions.length > 2 && (
                  <Badge variant='secondary' className='text-xs font-normal'>
                    +{selectedOptions.length - 2}
                  </Badge>
                )}
              </>
            )}
          </div>
          <ChevronDown className='text-muted-foreground ml-2 h-4 w-4' />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className='w-[var(--radix-popover-trigger-width)] p-1'
        align='start'
      >
        <div className='max-h-[200px] overflow-auto'>
          {options.map((opt) => (
            <div
              key={opt.code}
              className='hover:bg-accent flex cursor-pointer items-center gap-2 rounded px-2 py-1.5'
              onClick={() => handleToggle(opt.code)}
            >
              <Checkbox checked={value.includes(opt.code)} />
              <span className='text-sm'>{opt.desc}</span>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
