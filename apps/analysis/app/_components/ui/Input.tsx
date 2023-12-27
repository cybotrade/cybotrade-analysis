import clsx from 'clsx';
import * as React from 'react';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={clsx(
          'flex h-10 w-full rounded-md px-3 py-2 focus-visible:outline-none disabled:cursor-not-allowed',
          'bg-[#fffcf6] file:bg-transparent dark:bg-neutral-700 disabled:opacity-50',
          'border border-[#d8cdc4] file:border-0 dark:border-[#817161]',
          'ring-offset-white focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 dark:ring-offset-neutral-700 dark:focus-visible:ring-neutral-500',
          'text-sm file:text-sm file:font-medium placeholder:text-neutral-600 dark:placeholder:text-neutral-500',
          'text-black dark:text-white',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

export { Input };
