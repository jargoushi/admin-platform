/**
 * 全局弹窗上下文提供者
 *
 * @description
 * 提供声明式的弹窗管理，支持在任何地方通过 Hook 打开弹窗
 * 解决了组件内挂载 DialogsContainer 的繁琐逻辑
 */

'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode, ComponentType } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';

/**
 * 弹窗组件通用 Props
 */
export interface DialogComponentProps<T = any> {
    /** 传递给组件的数据/Props */
    data?: T;
    /** 关闭弹窗的回调 */
    onClose: () => void;
    /** 其他属性 */
    [key: string]: any;
}

/**
 * 弹窗配置选项
 */
export interface DialogOptions<T = any> {
    /** 标题 */
    title: string;
    /** 描述 */
    description?: string;
    /** 要渲染的组件 */
    component: ComponentType<DialogComponentProps<T>>;
    /** 传递给组件的数据 */
    data?: T;
    /** 样式类 */
    className?: string;
    /** 弹窗关闭后的回调 */
    onClose?: () => void;
}

/**
 * 上下文接口
 */
interface DialogContextProps {
    /** 打开弹窗 */
    open: <T>(options: DialogOptions<T>) => void;
    /** 关闭当前弹窗 */
    close: () => void;
}

const DialogContext = createContext<DialogContextProps | undefined>(undefined);

/**
 * 弹窗提供者组件
 */
export function DialogProvider({ children }: { children: ReactNode }) {
    const [options, setOptions] = useState<DialogOptions<any> | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    // 使用 function 关键字避免 TSX 解析泛型歧义
    const open = useCallback(function <T>(openOptions: DialogOptions<T>) {
        setOptions(openOptions);
        setIsOpen(true);
    }, []);

    const close = useCallback(() => {
        setIsOpen(false);
        // 执行关闭回调
        options?.onClose?.();

        // 延迟清空配置，避免关闭动画中内容突变
        // 保存当前 options 引用，只清空当前弹窗的配置
        const currentOptions = options;
        setTimeout(() => {
            setOptions((prev) => (prev === currentOptions ? null : prev));
        }, 300);
    }, [options]);

    return (
        <DialogContext.Provider value={{ open, close }}>
            {children}

            {/* 全局单例弹窗渲染 */}
            <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
                {options && (
                    <DialogContent className={options.className || 'sm:max-w-2xl'}>
                        <DialogHeader>
                            <DialogTitle>{options.title}</DialogTitle>
                            {options.description && (
                                <DialogDescription>{options.description}</DialogDescription>
                            )}
                        </DialogHeader>

                        {/* 动态渲染组件 */}
                        <options.component
                            data={options.data}
                            onClose={close}
                        />
                    </DialogContent>
                )}
            </Dialog>
        </DialogContext.Provider>
    );
}

/**
 * 使用全局弹窗的 Hook
 */
export function useDialog() {
    const context = useContext(DialogContext);
    if (!context) {
        throw new Error('useDialog must be used within a DialogProvider');
    }
    return context;
}
