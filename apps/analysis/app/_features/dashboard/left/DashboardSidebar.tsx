'use client';

import { BackIcon } from '@app/_assets/icons';

export const DashboardSidebar = () => {
  return (
    <div className="col-[1] max-w-[4rem] h-full">
      <button
        onClick={() => (window.location.href = '/')}
        className="rounded-full w-16 h-16 bg-[#FFFFFF] border border-[#E1D9D6] flex justify-center items-center"
      >
        <BackIcon className="text-[#706C6C]" />
      </button>
    </div>
  );
};
