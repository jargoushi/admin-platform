'use client';
import React from 'react';
import { ThemeProvider } from 'next-themes';
import { DialogProvider } from '@/contexts/dialog-provider';
import { ConfirmationProvider } from '@/contexts/confirmation-provider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute='class'
      defaultTheme='system'
      enableSystem
      disableTransitionOnChange
    >
      <ConfirmationProvider>
        <DialogProvider>{children}</DialogProvider>
      </ConfirmationProvider>
    </ThemeProvider>
  );
}
