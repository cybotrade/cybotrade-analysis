import DashboardContentWrapper from '@app/_features/dashboard/DashboardContentWrapper';
import { NewSurfacePlot } from '@app/_features/dashboard/left/content/surface-plot';

const SurfacePlotPage = () => {
  return (
    <DashboardContentWrapper>
      <NewSurfacePlot />
    </DashboardContentWrapper>
  );
};

export default SurfacePlotPage;
