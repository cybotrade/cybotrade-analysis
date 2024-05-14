'use client';

import { SurfacePlotGraph } from '@app/_features/dashboard/left/content/surface-plot/SurfacePlotGraph';
import { NoRecord } from '@app/_features/dashboard/status/no-record';
import { Processing } from '@app/_features/dashboard/status/processing';
import { useBacktestData } from '@app/_providers/backtest';

export const NewSurfacePlot = () => {
  const { plot } = useBacktestData();

  return (
    <div className="relative h-full">
      {!plot ? <Processing /> : plot.length === 0 ? <NoRecord /> : <SurfacePlotGraph plot={plot} />}
    </div>
  );
};
