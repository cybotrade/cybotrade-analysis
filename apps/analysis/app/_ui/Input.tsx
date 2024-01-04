import * as React from 'react';

import { cn } from '@app/_lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  suffix?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, suffix, ...props }, ref) => {
    return (
      <div className={cn('relative flex items-center', className)}>
        <input
          type={type}
          className={cn(
            'flex h-10 w-full rounded-md px-3 py-2 focus-visible:outline-none disabled:cursor-not-allowed',
            'bg-[#fffcf6] file:bg-transparent dark:bg-neutral-700 disabled:opacity-50',
            'border border-[#d8cdc4] file:border-0 dark:border-[#817161]',
            'ring-offset-white focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 dark:ring-offset-neutral-700 dark:focus-visible:ring-neutral-500',
            'text-sm file:text-sm file:font-medium placeholder:text-stone-400 dark:placeholder:text-neutral-500',
            'text-black dark:text-white',
            '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
            className,
          )}
          ref={ref}
          {...props}
        />
        {suffix && <div className="absolute right-0 pr-4">{suffix}</div>}
      </div>
    );
  },
);
Input.displayName = 'Input';

export { Input };
