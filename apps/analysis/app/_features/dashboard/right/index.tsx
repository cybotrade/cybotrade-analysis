import { ActionHeader } from '@app/_features/dashboard/right/ActionHeader';
import { DataCarousel } from '@app/_features/dashboard/right/DataCarousel';
import { DataDetails } from '@app/_features/dashboard/right/DataDetails';

const DashboardRightSide = () => {
  return (
    <div className="col-[2] grid grid-rows-[5%_auto_min-content] w-full h-full gap-3 rounded-lg bg-[#FFFFFF] border border-[#E1D9D6] px-5 py-3">
      <ActionHeader className="mb-3" />
      <DataCarousel />
      <DataDetails />
    </div>
  );
};

export default DashboardRightSide;
