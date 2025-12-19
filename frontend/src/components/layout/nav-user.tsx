'use client';

import { useEffect, useState } from 'react';
import { BadgeCheck, LogOut, Lock, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { getInitials } from '@/lib/utils';
import { AuthApiService } from '@/service/api/auth.api';
import { UserApiService } from '@/service/api/user.api';
import type { UserProfile } from '@/types/auth';
import { SettingsDialog } from './settings-dialog';
import type { ProfileFormData, PasswordFormData } from './nav-user.schema';
import { ProfileDialog } from './nav-user-profile-dialog';
import { PasswordDialog } from './nav-user-password-dialog';

export function NavUser() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);

  // 获取用户信息
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await AuthApiService.getProfile();
        setUser(profile);
      } catch {
        // 未登录或获取失败
      }
    };
    fetchProfile();
  }, []);

  const displayUser = user || { id: 0, username: '游客', email: '未登录' };

  // 更新用户信息
  const handleUpdateProfile = async (data: ProfileFormData) => {
    if (!user) return;
    setIsUpdating(true);
    try {
      await UserApiService.update(user.id, data);
      toast.success('更新成功');
      const newProfile = await AuthApiService.getProfile();
      setUser(newProfile);
      setProfileDialogOpen(false);
    } catch (error) {
      console.error('更新失败:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  // 修改密码
  const handleChangePassword = async (data: PasswordFormData) => {
    setIsUpdating(true);
    try {
      await AuthApiService.changePassword(data.newPassword);
      toast.success('密码修改成功');
      setPasswordDialogOpen(false);
    } catch (error) {
      console.error('修改密码失败:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  // 退出登录
  const handleLogout = async () => {
    try {
      await AuthApiService.logout();
      toast.success('退出登录成功');
      router.push('/login');
      router.refresh();
    } catch {
      router.push('/login');
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='relative h-9 w-9 rounded-full'
            title={displayUser.username}
          >
            <Avatar className='border-border/50 hover:border-primary/50 h-9 w-9 border transition-colors'>
              <AvatarImage
                src='/avatars/default.jpg'
                alt={displayUser.username}
              />
              <AvatarFallback className='bg-primary/10 text-primary font-medium'>
                {getInitials(displayUser.username)}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56' align='end' sideOffset={8}>
          <DropdownMenuLabel className='font-normal'>
            <div className='flex flex-col space-y-1'>
              <p className='text-sm leading-none font-medium'>
                {displayUser.username}
              </p>
              <p className='text-muted-foreground text-xs leading-none'>
                {displayUser.email || '未设置邮箱'}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => setProfileDialogOpen(true)}
              className='cursor-pointer'
            >
              <BadgeCheck className='mr-2 h-4 w-4' />
              <span>账号设置</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setPasswordDialogOpen(true)}
              className='cursor-pointer'
            >
              <Lock className='mr-2 h-4 w-4' />
              <span>修改密码</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setSettingsDialogOpen(true)}
              className='cursor-pointer'
            >
              <Settings className='mr-2 h-4 w-4' />
              <span>系统设置</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            className='cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-950/50'
          >
            <LogOut className='mr-2 h-4 w-4' />
            <span>退出登录</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 账号设置弹窗 */}
      <ProfileDialog
        open={profileDialogOpen}
        onOpenChange={setProfileDialogOpen}
        user={user}
        onUpdate={handleUpdateProfile}
        loading={isUpdating}
      />

      {/* 修改密码弹窗 */}
      <PasswordDialog
        open={passwordDialogOpen}
        onOpenChange={setPasswordDialogOpen}
        onUpdate={handleChangePassword}
        loading={isUpdating}
      />

      {/* 系统设置弹窗 */}
      <SettingsDialog
        open={settingsDialogOpen}
        onOpenChange={setSettingsDialogOpen}
      />
    </>
  );
}
