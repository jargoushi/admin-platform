/**
 * 设置弹窗
 *
 * @description
 * 通过元数据动态渲染配置界面
 * 配置修改暂存本地，点击保存按钮后统一提交
 */

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import * as Icons from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import {
  CommonApiService,
  type SettingGroupMeta,
  type SettingMeta,
  type SettingValueType
} from '@/service/api/common.api';
import {
  SettingApiService,
  type SettingGroup
} from '@/service/api/setting.api';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// 动态获取图标（后端返回图标名称如 "Settings", "Bell"）
const getIcon = (name: string) => {
  return (
    (Icons as unknown as Record<string, Icons.LucideIcon>)[name] ||
    Icons.Settings
  );
};

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const [metadata, setMetadata] = useState<SettingGroupMeta[]>([]);
  const [groups, setGroups] = useState<SettingGroup[]>([]);
  const [pendingChanges, setPendingChanges] = useState<Record<number, unknown>>(
    {}
  );
  const [activeGroup, setActiveGroup] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const hasChanges = useMemo(
    () => Object.keys(pendingChanges).length > 0,
    [pendingChanges]
  );

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // 顺序获取元数据和设置数据，简化逻辑
      const metaRes = await CommonApiService.getSettingsMetadata();
      const settingsRes = await SettingApiService.getAll();

      setMetadata(metaRes.groups);
      setGroups(settingsRes.groups);
      setPendingChanges({});

      if (metaRes.groups.length > 0 && activeGroup === null) {
        setActiveGroup(metaRes.groups[0].code);
      }
    } catch (error) {
      console.error('获取配置失败', error);
    } finally {
      setLoading(false);
    }
  }, [activeGroup]);

  useEffect(() => {
    if (open) fetchData();
  }, [open, fetchData]);

  // 获取当前显示值
  const getCurrentValue = (code: number, defaultVal: unknown): unknown => {
    if (code in pendingChanges) return pendingChanges[code];
    for (const group of groups) {
      const setting = group.settings.find((s) => s.setting_key === code);
      if (setting) return setting.setting_value;
    }
    return defaultVal;
  };

  const handleChange = (key: number, value: unknown) => {
    setPendingChanges((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!hasChanges) return;
    setSaving(true);
    try {
      // 顺序提交变更，避免并发压力，逻辑更清晰
      for (const [key, value] of Object.entries(pendingChanges)) {
        await SettingApiService.update({
          setting_key: Number(key),
          setting_value: value
        });
      }

      toast.success('保存成功');
      setPendingChanges({});
      fetchData();
    } catch (error) {
      console.error('保存失败', error);
    } finally {
      setSaving(false);
    }
  };

  // 恢复所有默认值
  const handleResetAll = async () => {
    setSaving(true);
    try {
      // 获取所有配置项 code
      const allCodes = metadata.flatMap((g) => g.settings.map((s) => s.code));
      await Promise.all(allCodes.map((code) => SettingApiService.reset(code)));
      toast.success('已恢复默认值');
      setPendingChanges({});
      fetchData();
    } catch (error) {
      console.error('恢复失败', error);
    } finally {
      setSaving(false);
    }
  };

  const currentGroupMeta = metadata.find((g) => g.code === activeGroup);

  // 根据类型渲染控件
  const renderControl = (meta: SettingMeta) => {
    const value = getCurrentValue(meta.code, meta.default);
    const type = meta.type as SettingValueType;

    switch (type) {
      case 'bool':
        return (
          <Switch
            checked={value as boolean}
            onCheckedChange={(v) => handleChange(meta.code, v)}
          />
        );
      case 'int':
      case 'float':
        return (
          <Input
            type='number'
            className='h-8 w-24 text-right'
            value={value as number}
            onChange={(e) => handleChange(meta.code, Number(e.target.value))}
          />
        );
      case 'path':
      case 'str':
        return (
          <Input
            className='h-8 w-56'
            value={value as string}
            onChange={(e) => handleChange(meta.code, e.target.value)}
          />
        );
      case 'textarea':
      case 'json':
        return (
          <Textarea
            className='w-64 resize-none font-mono text-sm'
            rows={3}
            value={
              typeof value === 'string' ? value : JSON.stringify(value, null, 2)
            }
            onChange={(e) => handleChange(meta.code, e.target.value)}
          />
        );
      case 'select':
        return (
          <Select
            value={String(value)}
            onValueChange={(v) => handleChange(meta.code, v)}
          >
            <SelectTrigger className='h-8 w-40'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {meta.options?.map((opt) => (
                <SelectItem key={opt.value} value={String(opt.value)}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      default:
        return (
          <Input
            className='h-8 w-48'
            value={String(value)}
            onChange={(e) => handleChange(meta.code, e.target.value)}
          />
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-3xl gap-0 overflow-hidden p-0'>
        <DialogTitle className='sr-only'>设置</DialogTitle>
        <div className='flex h-[480px]'>
          {/* 左侧导航 */}
          <div className='bg-muted/40 flex w-44 flex-col border-r py-4'>
            <div className='px-4 pb-3'>
              <h2 className='text-muted-foreground text-sm font-semibold'>
                设置
              </h2>
            </div>
            <nav className='flex-1 space-y-0.5 px-2'>
              {metadata.map((group) => {
                const Icon = getIcon(group.icon!);
                const isActive = activeGroup === group.code;
                return (
                  <button
                    key={group.code}
                    onClick={() => setActiveGroup(group.code)}
                    className={cn(
                      'flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground font-medium'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    )}
                  >
                    <Icon className='h-4 w-4' />
                    {group.name}
                  </button>
                );
              })}
            </nav>
            <div className='space-y-2 border-t px-2 pt-3'>
              <Button
                className='w-full'
                size='sm'
                onClick={handleSave}
                disabled={!hasChanges || saving}
              >
                <Icons.Save className='mr-2 h-4 w-4' />
                {saving ? '保存中...' : hasChanges ? '保存修改' : '已保存'}
              </Button>
              <Button
                className='w-full'
                size='sm'
                variant='outline'
                onClick={handleResetAll}
                disabled={saving}
              >
                <Icons.RotateCcw className='mr-2 h-4 w-4' />
                恢复默认
              </Button>
            </div>
          </div>

          {/* 右侧内容 */}
          <div className='flex-1 overflow-auto'>
            {loading ? (
              <div className='text-muted-foreground flex h-full items-center justify-center'>
                加载中...
              </div>
            ) : currentGroupMeta ? (
              <div className='p-6'>
                <h3 className='mb-4 text-base font-semibold'>
                  {currentGroupMeta.name}
                </h3>
                <div className='space-y-4'>
                  {currentGroupMeta.settings.map((meta) => (
                    <div
                      key={meta.code}
                      className='flex items-center justify-between py-2'
                    >
                      <div className='flex items-center gap-2'>
                        <span className='text-sm'>{meta.name}</span>
                        {meta.required && (
                          <span className='text-destructive text-xs'>*</span>
                        )}
                      </div>
                      <div className='flex items-center gap-2'>
                        {renderControl(meta)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className='text-muted-foreground flex h-full items-center justify-center'>
                请选择分组
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
