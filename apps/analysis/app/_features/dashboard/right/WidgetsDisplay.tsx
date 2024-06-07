'use client';

import { Decimal } from 'decimal.js';

import { MainWidget } from '@app/_components/dashboard/right/MainWidget';
import { WidgetCarousel } from '@app/_components/dashboard/right/WidgetCarousel';
import { TotalReturnWidget } from '@app/_components/widgets';
import { PerformanceData } from '@app/_lib/calculation';

type TWidgetsDisplayProps = {
  performance: PerformanceData;
};

export const WidgetsDisplay = ({ performance }: TWidgetsDisplayProps) => {
  const netProfit = new Decimal(performance.netProfit);
  const initialCapital = new Decimal(performance.initialCapital);

  return (
    <div className="h-full flex flex-col gap-2">
      <MainWidget
        content={<TotalReturnWidget netProfit={netProfit} initialCapital={initialCapital} />}
      />

      <WidgetCarousel performance={performance} />
    </div>
  );
};
