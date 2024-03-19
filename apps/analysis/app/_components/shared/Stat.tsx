'use client';

import { Text } from '@app/_components/shared/Text';
import { cn } from '@app/_lib/utils';

type StatProps = {
  containerClassName?: string;
  label?: string;
  labelClassName?: string;
  content: string | number;
  contentClassName?: string;
};

export const Stat = ({
  containerClassName,
  label,
  content,
  labelClassName,
  contentClassName,
}: StatProps) => {
  return (
    <div className={cn('flex flex-col font-sora text-[#232222]', containerClassName)}>
      {label && <Text content={label} className={cn(labelClassName)} />}
      <Text content={content} className={cn(contentClassName)} />
    </div>
  );
};
