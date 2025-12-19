'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { useBreadcrumbs } from '@/hooks/use-breadcrumbs';
import { ChevronRight } from 'lucide-react';
import { Fragment } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface BreadcrumbItemData {
  link: string;
  title: string;
}

export function Breadcrumbs() {
  const items = useBreadcrumbs() as BreadcrumbItemData[];

  if (!items?.length) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isMobileHidden = index < items.length - 2;

          return (
            <Fragment key={`${item.title}-${index}`}>
              <BreadcrumbItem
                className={cn(isMobileHidden && 'hidden md:block')}
              >
                {isLast ? (
                  <BreadcrumbPage className='text-xs font-medium md:text-sm'>
                    {item.title}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={item.link} className='text-xs md:text-sm'>
                      {item.title}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && (
                <BreadcrumbSeparator
                  className={cn(isMobileHidden && 'hidden md:block')}
                >
                  <ChevronRight className='h-4 w-4' />
                </BreadcrumbSeparator>
              )}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
