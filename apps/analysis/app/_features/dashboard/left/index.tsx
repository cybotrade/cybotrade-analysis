import { DashboardFooter } from '@app/_features/dashboard/left/DashboardFooter';
import { DashboardHeader } from '@app/_features/dashboard/left/DashboardHeader';

const DashboardLeftSide = () => {
  return (
    <div className="col-[1]">
      <DashboardHeader />
      <DashboardFooter />
    </div>
  );
};

export default DashboardLeftSide;
