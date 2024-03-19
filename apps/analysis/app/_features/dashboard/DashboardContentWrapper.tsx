import { PropsWithChildren } from 'react';

import { cn } from '@app/_lib/utils';

type DashboardContentWrapperProps = {
  className?: string;
};
const DashboardContentWrapper = ({
  children,
  className,
}: PropsWithChildren<DashboardContentWrapperProps>) => {
  return <div className={cn('w-full h-[80%]', className)}>{children}</div>;
};

export default DashboardContentWrapper;
