import DashboardLeftSide from '@app/_features/dashboard/left';
import DashboardRightSide from '@app/_features/dashboard/right';

const Dashboard = () => {
  return (
    <div className="w-full h-full grid auto-cols-[1fr_28rem] gap-8">
      <DashboardLeftSide />
      <DashboardRightSide />
    </div>
  );
};

export default Dashboard;
