import { EquityCurve } from '@app/(routes)/(route)/_components/EquityCurve';
import { Banner } from '@app/_components/shared/Banner';
import { NewEquityCurve } from '@app/_features/dashboard/left/content/NewEquityCurve';

const DashboardContent = () => {
  return (
    <div className="w-full h-[80%]">
      {/*<Banner />*/}
      <NewEquityCurve />
    </div>
  );
};

export default DashboardContent;
