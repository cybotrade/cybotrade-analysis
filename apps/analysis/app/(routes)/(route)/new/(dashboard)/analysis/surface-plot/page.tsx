import dynamic from 'next/dynamic';

import { Loading } from '@app/_components/loading';
import DashboardContentWrapper from '@app/_features/dashboard/DashboardContentWrapper';

const LoadingSurfacePlot = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <Loading description="Loading ..." />
    </div>
  );
};

const SurfacePlot = dynamic(() => import('@app/(routes)/(route)/_components/SurfacePlot'), {
  loading: () => <LoadingSurfacePlot />,
  ssr: false,
});
const SurfacePlotPage = () => {
  return (
    <DashboardContentWrapper>
      {/*
      <SurfacePlot />
*/}
    </DashboardContentWrapper>
  );
};

export default SurfacePlotPage;
