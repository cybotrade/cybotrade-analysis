import { UniqueIdentifier } from '@dnd-kit/core';
import { Decimal } from 'decimal.js';
import React from 'react';

import { AverageTradesDaysWidget } from '@app/_components/widgets/average-trades-days';
import { BestTradeWidget } from '@app/_components/widgets/best-trade';
import { LargestRoiWidget } from '@app/_components/widgets/largest-roi';
import { MaxDDWidget } from '@app/_components/widgets/max-dd';
import { WinRateWidget } from '@app/_components/widgets/win-rate';
import { PerformanceData } from '@app/_lib/calculation';

export const getWidgets = (performance: PerformanceData): Record<string, React.ReactNode> => {
  return {
    'win-rate': <WinRateWidget winRate={new Decimal(performance.winRate)} />,
    'best-trade': <BestTradeWidget bestTrade={new Decimal(performance.bestTradePnl)} />,
    'largest-roi': <LargestRoiWidget largestRoi={new Decimal(performance.largestRoi)} />,
    'max-drawdown': <MaxDDWidget maxDrawdown={new Decimal(performance.maxDrawdown)} />,
    'average-trades-per-day': (
      <AverageTradesDaysWidget averageTradesPerDay={performance.averageTradesPerDay} />
    ),
  };
};

export const getWidgetById = (id: UniqueIdentifier, performance: PerformanceData) => {
  const widgets = getWidgets(performance);
  return id in widgets && widgets[id];
};
