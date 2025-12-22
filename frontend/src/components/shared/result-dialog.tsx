/**
 * 通用结果展示弹窗组件
 *
 * @description
 * 用于在表单提交成功后展示操作结果
 * 通过 useDialog().open() 打开
 */
'use client';

import * as React from 'react';
import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { copyToClipboard } from '@/lib/utils';
import type { DialogComponentProps } from '@/contexts/dialog-provider';

/**
 * 结果项配置
 */
interface ResultItem {
  /** 标题 */
  title: string;
  /** 结果列表 */
  items: string[];
}

/**
 * 结果数据
 */
export interface ResultDialogData {
  /** 成功消息 */
  message: string;
  /** 结果列表 */
  results: ResultItem[];
}

/**
 * 通用结果展示组件
 */
export function ResultDialog({ data }: DialogComponentProps<ResultDialogData>) {
  if (!data) return null;

  return (
    <div className='space-y-4'>
      <div className='text-sm text-green-600'>{data.message}</div>

      {data.results.map((result, index) => (
        <Card key={index} className='p-4'>
          <div className='flex justify-between border-b pb-2'>
            <h4 className='font-semibold'>{result.title}</h4>
            <Button
              variant='ghost'
              type='button'
              size='sm'
              onClick={() => copyToClipboard(result.items.join('\n'))}
            >
              <Copy className='mr-2 h-4 w-4' />
              复制
            </Button>
          </div>
          <div className='mt-2 max-h-48 space-y-1 overflow-y-auto text-sm'>
            {result.items.map((item) => (
              <code
                key={item}
                className='text-muted-foreground block font-mono'
              >
                {item}
              </code>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
