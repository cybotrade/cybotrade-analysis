import { PropsWithChildren } from 'react';

const DashboardMainWrapper = ({ children }: PropsWithChildren) => {
  return <div className="col-[2]">{children}</div>;
};

export default DashboardMainWrapper;
