/**
 * 账号配置管理 Tab 页面
 */

'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { AccountApiService } from '@/service/api/account.api';
import { SettingGroupView } from './components/SettingGroupView';
import type { SettingGroup } from '../../types';

export default function AccountSettingsPage() {
  const params = useParams();
  const accountId = Number(params.id);

  const [groups, setGroups] = React.useState<SettingGroup[]>([]);
  const [loading, setLoading] = React.useState(true);

  const fetchSettings = React.useCallback(async () => {
    if (!accountId) return;
    setLoading(true);
    try {
      const res = await AccountApiService.getSettings(accountId);
      setGroups(res.groups);
    } finally {
      setLoading(false);
    }
  }, [accountId]);

  React.useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleUpdate = async (key: number, value: unknown) => {
    await AccountApiService.updateSetting(accountId, { setting_key: key, setting_value: value });
    toast.success('配置已更新');
    fetchSettings();
  };

  const handleReset = async (key: number) => {
    await AccountApiService.resetSetting(accountId, key);
    toast.success('配置已重置');
    fetchSettings();
  };

  if (loading) {
    return (
      <div className='flex min-h-[300px] items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <div className='flex min-h-[300px] items-center justify-center text-muted-foreground'>
        暂无配置项
      </div>
    );
  }

  return (
    <div className='space-y-8'>
      {groups.map((group) => (
        <SettingGroupView
          key={group.group_code}
          group={group}
          onUpdate={handleUpdate}
          onReset={handleReset}
        />
      ))}
    </div>
  );
}
