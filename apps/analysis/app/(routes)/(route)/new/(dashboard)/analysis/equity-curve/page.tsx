import DashboardContentWrapper from '@app/_features/dashboard/DashboardContentWrapper';
import { NewEquityCurve } from '@app/_features/dashboard/left/content/NewEquityCurve';

const EquityCurvePage = () => {
  return (
    <DashboardContentWrapper>
      <NewEquityCurve />
    </DashboardContentWrapper>
  );
};

export default EquityCurvePage;
