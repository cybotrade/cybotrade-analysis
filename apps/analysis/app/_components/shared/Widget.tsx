'use client';

import { PropsWithChildren, ReactNode } from 'react';

import { cn } from '@app/_lib/utils';

type WidgetProps = {
  className?: string;
  background?: ReactNode;
};
export const Widget = ({ className, background, children }: PropsWithChildren<WidgetProps>) => {
  return (
    <div
      className={cn('w-full h-full border border-[#F0F0F0] rounded-2xl p-6 3xl:p-10', className)}
    >
      {background}
      {children}
    </div>
  );
};
