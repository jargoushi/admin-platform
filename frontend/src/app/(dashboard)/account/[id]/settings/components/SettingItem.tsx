/**
 * 配置项组件
 *
 * @description
 * 展示单个可编辑的配置项
 */

'use client';

import * as React from 'react';
import { RotateCcw, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Setting } from '../../../types';

interface SettingItemProps {
  setting: Setting;
  onUpdate: (key: number, value: unknown) => Promise<void>;
  onReset: (key: number) => Promise<void>;
}

export function SettingItem({ setting, onUpdate, onReset }: SettingItemProps) {
  const [editing, setEditing] = React.useState(false);
  const [value, setValue] = React.useState<unknown>(setting.setting_value);
  const [loading, setLoading] = React.useState(false);

  // 同步外部值
  React.useEffect(() => {
    setValue(setting.setting_value);
  }, [setting.setting_value]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await onUpdate(setting.setting_key, value);
      setEditing(false);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    setLoading(true);
    try {
      await onReset(setting.setting_key);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setValue(setting.setting_value);
    setEditing(false);
  };

  // 根据值类型渲染编辑器
  const renderEditor = () => {
    if (setting.value_type === 'boolean') {
      return (
        <Switch
          checked={value as boolean}
          onCheckedChange={(checked) => {
            setValue(checked);
            if (!editing) setEditing(true);
          }}
          disabled={loading}
        />
      );
    }

    if (setting.value_type === 'number') {
      return (
        <Input
          type='number'
          value={String(value ?? '')}
          onChange={(e) => setValue(Number(e.target.value))}
          onFocus={() => setEditing(true)}
          disabled={loading}
          className='h-8 w-32'
        />
      );
    }

    // 默认为字符串
    return (
      <Input
        value={String(value ?? '')}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setEditing(true)}
        disabled={loading}
        className='h-8 w-48'
      />
    );
  };

  return (
    <div
      className={cn(
        'flex items-center justify-between rounded-lg border p-4 transition-colors',
        editing && 'border-primary/50 bg-muted/30'
      )}
    >
      {/* 左侧：名称和状态 */}
      <div className='flex items-center gap-3'>
        <span className='font-medium'>{setting.setting_key_name}</span>
        {setting.is_default && (
          <Badge variant='secondary' className='text-xs'>
            默认值
          </Badge>
        )}
      </div>

      {/* 右侧：编辑器和操作 */}
      <div className='flex items-center gap-2'>
        {renderEditor()}

        {editing && (
          <>
            <Button
              size='icon'
              variant='ghost'
              onClick={handleSave}
              disabled={loading}
              className='h-8 w-8 text-green-600 hover:text-green-700'
            >
              <Check className='h-4 w-4' />
            </Button>
            <Button
              size='icon'
              variant='ghost'
              onClick={handleCancel}
              disabled={loading}
              className='h-8 w-8'
            >
              <X className='h-4 w-4' />
            </Button>
          </>
        )}

        {!setting.is_default && !editing && (
          <Button
            size='sm'
            variant='ghost'
            onClick={handleReset}
            disabled={loading}
            className='text-muted-foreground hover:text-foreground'
          >
            <RotateCcw className='mr-1 h-3 w-3' />
            重置
          </Button>
        )}
      </div>
    </div>
  );
}
