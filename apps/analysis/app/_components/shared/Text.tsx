import { cn } from '@app/_lib/utils';

type TextProps = {
  content: string | number;
  className?: string;
};

export const Text = ({ content, className }: TextProps) => {
  return <div className={cn('', className)}>{content}</div>;
};
