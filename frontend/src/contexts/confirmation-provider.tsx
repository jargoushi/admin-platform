/**
 * 全局确认弹窗上下文提供者
 *
 * @description
 * 提供声明式的确认弹窗管理，支持在任何地方通过 Hook 触发确认
 * 包含完整的 UI 渲染逻辑，逻辑自闭环，无需手动挂载组件
 */

'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

/**
 * 确认选项配置
 */
export interface ConfirmOptions {
    /** 标题 */
    title?: string;
    /** 描述文字/内容 */
    description: ReactNode;
    /** 确认按钮文字 */
    confirmText?: string;
    /** 取消按钮文字 */
    cancelText?: string;
    /** 确认回调（支持异步） */
    onConfirm: () => Promise<void> | void;
}

/**
 * 逻辑状态
 */
interface ConfirmState extends ConfirmOptions {
    isOpen: boolean;
    isLoading: boolean;
}

/**
 * 上下文接口
 */
interface ConfirmationContextProps {
    /** 触发确认弹窗 */
    confirm: (options: ConfirmOptions) => void;
    /** 关闭弹窗 */
    close: () => void;
}

const ConfirmationContext = createContext<ConfirmationContextProps | undefined>(undefined);

/**
 * 确认弹窗提供者组件
 */
export function ConfirmationProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<ConfirmState>({
        isOpen: false,
        isLoading: false,
        title: '操作确认',
        description: '',
        confirmText: '确认',
        cancelText: '取消',
        onConfirm: () => { }
    });

    const confirm = useCallback((options: ConfirmOptions) => {
        setState({
            isOpen: true,
            isLoading: false,
            title: options.title || '操作确认',
            description: options.description,
            confirmText: options.confirmText || '确认',
            cancelText: options.cancelText || '取消',
            onConfirm: options.onConfirm
        });
    }, []);

    const close = useCallback(() => {
        setState((prev) => ({ ...prev, isOpen: false }));
        // 延迟重重置状态，避免动画中内容跳变
        setTimeout(() => {
            setState((prev) => ({
                ...prev,
                isLoading: false,
                description: ''
            }));
        }, 300);
    }, []);

    const handleConfirm = useCallback(async () => {
        setState((prev) => ({ ...prev, isLoading: true }));
        try {
            await state.onConfirm();
            close();
        } catch (error) {
            setState((prev) => ({ ...prev, isLoading: false }));
            console.error('Confirmation action failed:', error);
        }
    }, [state, close]);

    return (
        <ConfirmationContext.Provider value={{ confirm, close }}>
            {children}

            <Dialog open={state.isOpen} onOpenChange={(open) => !open && close()}>
                <DialogContent className='sm:max-w-md'>
                    <DialogHeader className='space-y-3'>
                        <DialogTitle>{state.title}</DialogTitle>
                        <DialogDescription asChild>
                            <div className='text-muted-foreground py-4 text-sm leading-relaxed whitespace-pre-wrap'>
                                {state.description}
                            </div>
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className='flex items-center justify-end gap-3 pt-2'>
                        <Button variant='outline' onClick={close} disabled={state.isLoading}>
                            {state.cancelText}
                        </Button>
                        <Button onClick={handleConfirm} disabled={state.isLoading}>
                            {state.isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                            {state.confirmText}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </ConfirmationContext.Provider>
    );
}

/**
 * 使用全局确认弹窗的 Hook
 */
export function useConfirmation() {
    const context = useContext(ConfirmationContext);
    if (!context) {
        throw new Error('useConfirmation must be used within a ConfirmationProvider');
    }
    return context;
}
