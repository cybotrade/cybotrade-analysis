import DashboardContentWrapper from '@app/_features/dashboard/DashboardContentWrapper';
import { NewMonteCarlo } from '@app/_features/dashboard/left/content/monte-carlo';

const MonteCarloPage = () => {
  return (
    <DashboardContentWrapper>
      <NewMonteCarlo />
    </DashboardContentWrapper>
  );
};

export default MonteCarloPage;
