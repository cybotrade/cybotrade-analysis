import { PropsWithChildren } from 'react';

const DashboardMainWrapper = ({ children }: PropsWithChildren) => {
  return <div className="w-full h-full grid auto-cols-[1fr_28rem] gap-8">{children}</div>;
};

export default DashboardMainWrapper;
