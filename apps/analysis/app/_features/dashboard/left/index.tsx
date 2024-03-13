import { DashboardFooter } from '@app/_features/dashboard/left/DashboardFooter';
import { DashboardHeader } from '@app/_features/dashboard/left/DashboardHeader';
import DashboardMainWrapper from '@app/_features/dashboard/left/DashboardMainWrapper';
import { DashboardSidebar } from '@app/_features/dashboard/left/DashboardSidebar';
import DashboardContent from '@app/_features/dashboard/left/content';

const DashboardLeftSide = () => {
  return (
    <div className="col-[1] grid auto-cols-[4rem_1fr] gap-5">
      <DashboardSidebar />
      <DashboardMainWrapper>
        <DashboardHeader />
        <DashboardContent />
        <DashboardFooter />
      </DashboardMainWrapper>
    </div>
  );
};

export default DashboardLeftSide;
