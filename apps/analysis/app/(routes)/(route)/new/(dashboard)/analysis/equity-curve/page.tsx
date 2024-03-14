import DashboardContentWrapper from '@app/_features/dashboard/DashboardContentWrapper';
import { NewEquityCurve } from '@app/_features/dashboard/left/content/NewEquityCurve';

const Page = () => {
  return (
    <DashboardContentWrapper>
      <NewEquityCurve />
    </DashboardContentWrapper>
  );
};

export default Page;
