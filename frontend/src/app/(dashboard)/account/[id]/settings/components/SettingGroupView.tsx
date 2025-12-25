/**
 * 配置分组组件
 *
 * @description
 * 按分组展示配置项列表
 */

'use client';

import * as React from 'react';
import { SettingItem } from './SettingItem';
import type { SettingGroup } from '../../../types';

interface SettingGroupViewProps {
  group: SettingGroup;
  onUpdate: (key: number, value: unknown) => Promise<void>;
  onReset: (key: number) => Promise<void>;
}

export function SettingGroupView({ group, onUpdate, onReset }: SettingGroupViewProps) {
  return (
    <div className='space-y-4'>
      {/* 分组标题 */}
      <h3 className='text-sm font-semibold text-foreground'>{group.group}</h3>

      {/* 配置项列表 */}
      <div className='space-y-2'>
        {group.settings.map((setting) => (
          <SettingItem
            key={setting.setting_key}
            setting={setting}
            onUpdate={onUpdate}
            onReset={onReset}
          />
        ))}
      </div>
    </div>
  );
}
