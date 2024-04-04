import DashboardContentWrapper from '@app/_features/dashboard/DashboardContentWrapper';
import NewCandleChart from '@app/_features/dashboard/left/content/candle-chart';

const CandleChartPage = () => {
  return (
    <DashboardContentWrapper>
      <NewCandleChart />
    </DashboardContentWrapper>
  );
};

export default CandleChartPage;
