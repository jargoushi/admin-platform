'use client';

import React, { ReactNode } from 'react';
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
 * 确认对话框 Props - 极简设计
 */
export interface ConfirmationDialogProps {
  isOpen: boolean;
  isLoading: boolean;
  description: ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * 确认对话框组件
 *
 * 极简设计：固定标题、按钮文本，只需传入确认消息和回调
 */
export function ConfirmationDialog({
  isOpen,
  isLoading,
  description,
  onConfirm,
  onCancel
}: ConfirmationDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className='sm:max-w-xl'>
        <DialogHeader className='space-y-3'>
          <DialogTitle>操作确认</DialogTitle>
          <DialogDescription asChild>
            <div className='text-muted-foreground py-4 text-sm leading-relaxed'>
              {description}
            </div>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className='gap-2 pt-2 sm:gap-0'>
          <Button onClick={onConfirm} disabled={isLoading}>
            {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            确认
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
