import DashboardContentWrapper from '@app/_features/dashboard/DashboardContentWrapper';
import NewCandleChart from '@app/_features/dashboard/left/content/NewCandleChart';

const CandleChartPage = () => {
  return (
    <DashboardContentWrapper>
      <NewCandleChart />
    </DashboardContentWrapper>
  );
};

export default CandleChartPage;
