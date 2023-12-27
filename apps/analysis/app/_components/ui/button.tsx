import { ButtonHTMLAttributes, ReactNode, forwardRef } from 'react';

type ButtonVariant = 'primary' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';

type ButtonSize = 'default' | 'sm' | 'lg' | 'xl' | 'icon';

const buttonVariants = {
  primary:
    'bg-primary text-neutral-900 hover:bg-primary/90 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50/90',
  destructive:
    'bg-red-500 text-neutral-50 hover:bg-red-500/90 dark:bg-red-900 dark:text-neutral-50 dark:hover:bg-red-900/90',
  outline:
    'border border-neutral-200 bg-white hover:bg-neutral-100 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-800 dark:hover:text-neutral-50',
  secondary:
    'bg-neutral-100 text-neutral-900 hover:bg-neutral-100/80 dark:bg-neutral-800 dark:text-neutral-50 dark:hover:bg-neutral-800/80',
  ghost:
    'hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-50',
  link: 'text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-50',
};

const buttonSizes = {
  default: 'h-10 px-4 py-2',
  sm: 'h-9 rounded-md px-3',
  lg: 'h-11 rounded-md px-8',
  xl: 'h-12 rounded-md px-11 text-base',
  icon: ' w-10',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children?: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'default', ...props }, ref) => {
    const variantClass = buttonVariants[variant] || buttonVariants['primary'];
    const sizeClass = buttonSizes[size] || buttonSizes['default'];

    return (
      <button
        className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-bold ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-neutral-950 dark:focus-visible:ring-neutral-300 ${variantClass} ${sizeClass} ${className}`}
        ref={ref}
        {...props}
      />
    );
  },
);

Button.displayName = 'Button';

export { Button, buttonVariants };
