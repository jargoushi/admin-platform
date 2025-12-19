import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function PageContainer({
  children,
  scrollable = true
}: {
  children: React.ReactNode;
  scrollable?: boolean;
}) {
  return (
    <>
      {scrollable ? (
        <ScrollArea className='h-[calc(100dvh-52px)]'>
          <div className='animate-in fade-in slide-in-from-bottom-2 flex flex-1 p-4 duration-300 md:px-6'>
            {children}
          </div>
        </ScrollArea>
      ) : (
        <div className='animate-in fade-in slide-in-from-bottom-2 flex flex-1 p-4 duration-300 md:px-6'>
          {children}
        </div>
      )}
    </>
  );
}
