'use client';

import { RightColumnContent } from '@app/_features/dashboard/right/RightColumnContent';
import { useBacktestData } from '@app/_providers/backtest';

const DashboardRightSide = () => {
  const { backtests, selectedPermutationId } = useBacktestData();
  const performance = backtests.get(selectedPermutationId)?.performance.values().next().value;

  if (backtests.size === 0) throw new Error('Invalid Visit');

  return <RightColumnContent key={selectedPermutationId} performance={performance} />;
};

export default DashboardRightSide;
