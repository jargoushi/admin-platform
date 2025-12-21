/**
 * 账号编辑表单组件
 *
 * @description
 * 用于 useGenericDialogs 配置的账号编辑表单
 * 符合 DialogComponentProps 接口约束
 */

'use client';

import { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DialogFooter } from '@/components/ui/dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { accountSchema, type AccountFormData } from '../account.schema';
import { AccountApiService } from '@/service/api/account.api';
import { DEFAULT_ACCOUNT_FORM } from '../constants';
import type { DialogComponentProps } from '@/contexts/dialog-provider';
import type { Account } from '../types';

/**
 * 账号编辑表单
 */
export function AccountEditForm({ data, onClose }: DialogComponentProps<Account>) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<AccountFormData>({
        resolver: zodResolver(accountSchema),
        defaultValues: DEFAULT_ACCOUNT_FORM
    });

    // 初始化表单数据
    useEffect(() => {
        if (data) {
            reset({
                name: data.name,
                platform_account: data.platform_account || '',
                platform_password: data.platform_password || '',
                description: data.description || ''
            });
        }
    }, [data, reset]);

    const onSubmit = useCallback(
        async (formData: AccountFormData) => {
            if (!data) return;
            setIsSubmitting(true);
            try {
                await AccountApiService.update({
                    id: data.id,
                    ...formData
                });
                toast.success('账号更新成功');
                onClose();
            } catch (error) {
                console.error('更新失败', error);
            } finally {
                setIsSubmitting(false);
            }
        },
        [data, onClose]
    );

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            {/* 账号名称 */}
            <div className='space-y-2'>
                <Label htmlFor='name'>
                    账号名称 <span className='text-destructive'>*</span>
                </Label>
                <Input id='name' placeholder='请输入账号名称' {...register('name')} />
                {errors.name && (
                    <p className='text-destructive text-sm'>{errors.name.message}</p>
                )}
            </div>

            {/* 平台账号 */}
            <div className='space-y-2'>
                <Label htmlFor='platform_account'>平台账号</Label>
                <Input
                    id='platform_account'
                    placeholder='请输入第三方平台账号'
                    {...register('platform_account')}
                />
            </div>

            {/* 平台密码 */}
            <div className='space-y-2'>
                <Label htmlFor='platform_password'>平台密码</Label>
                <Input
                    id='platform_password'
                    type='password'
                    placeholder='请输入第三方平台密码'
                    {...register('platform_password')}
                />
            </div>

            {/* 描述 */}
            <div className='space-y-2'>
                <Label htmlFor='description'>描述</Label>
                <Textarea
                    id='description'
                    placeholder='请输入账号描述'
                    rows={3}
                    {...register('description')}
                />
            </div>

            <DialogFooter>
                <Button type='button' variant='outline' onClick={onClose}>
                    取消
                </Button>
                <Button type='submit' disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                    保存
                </Button>
            </DialogFooter>
        </form>
    );
}
