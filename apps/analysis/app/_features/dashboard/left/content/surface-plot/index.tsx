'use client';

import { SurfacePlotGraph } from '@app/_features/dashboard/left/content/surface-plot/SurfacePlotGraph';
import { useBacktestData } from '@app/_providers/backtest';

export const NewSurfacePlot = () => {
  const { backtests } = useBacktestData();

  return (
    <div className="relative h-full">
      {backtests.size === 0 ? (
        <div className="flex justify-center items-center h-full font-sans text-2xl">No Records</div>
      ) : (
        <SurfacePlotGraph backtests={backtests} />
      )}
    </div>
  );
};
