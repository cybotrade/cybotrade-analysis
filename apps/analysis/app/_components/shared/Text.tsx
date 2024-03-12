import { cn } from '@app/_lib/utils';

type TextProps = {
  content: string | number;
  className: string;
};

export const Text = ({ content, className }: TextProps) => {
  return <span className={cn('', className)}>{content}</span>;
};
