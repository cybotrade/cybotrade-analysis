import { PropsWithChildren } from 'react';

const DashboardContentWrapper = ({ children }: PropsWithChildren) => {
  return <div className="w-full h-[80%]">{children}</div>;
};

export default DashboardContentWrapper;
