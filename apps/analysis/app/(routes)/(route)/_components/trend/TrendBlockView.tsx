import TrendChartCard from '@app/(routes)/(route)/_components/trend/TrendChartCard';
import Histogram from '@app/_components/chart/Histogram';
import { cn } from '@app/lib/utils';

type TrendBlockViewProps = {
  selectedMonth: string;
  selectedYear: string;
  drawdownsWithPercentiles: [number, number][];
  profitArray: [number, number][];
  tradeArray: [number, number][];
};

const TrendBlockView = ({
  drawdownsWithPercentiles,
  selectedMonth,
  selectedYear,
  profitArray,
  tradeArray,
}: TrendBlockViewProps) => {
  return (
    <div className="grid grid-cols-trend-chart place-content-between gap-y-8">
      <TrendChartCard
        label="Month Max DD"
        data={drawdownsWithPercentiles}
        month={selectedMonth}
        year={selectedYear}
        type="Month"
        profits={[]}
        arrayType="maxDD"
        trades={[]}
      />
      <TrendChartCard
        label="Day of Week Max DD"
        data={drawdownsWithPercentiles}
        month={selectedMonth}
        year={selectedYear}
        type="Week"
        profits={[]}
        arrayType="maxDD"
        trades={[]}
      />
      <TrendChartCard
        label="Day of Month Max DD"
        data={drawdownsWithPercentiles}
        month={selectedMonth}
        year={selectedYear}
        type="Day"
        profits={[]}
        arrayType="maxDD"
        trades={[]}
      />
      {/* Second Row */}
      <TrendChartCard
        label="Month Float Profit"
        data={[]}
        month={selectedMonth}
        year={selectedYear}
        type="Month"
        profits={profitArray}
        arrayType="Profit"
        trades={[]}
      />
      <TrendChartCard
        label="Day of Week Float Profit"
        data={[]}
        month={selectedMonth}
        year={selectedYear}
        type="Week"
        profits={profitArray}
        arrayType="Profit"
        trades={[]}
      />
      <TrendChartCard
        label="Day of Month Float Profit"
        data={[]}
        month={selectedMonth}
        year={selectedYear}
        type="Day"
        profits={profitArray}
        arrayType="Profit"
        trades={[]}
      />
      {/* Third Row */}
      <TrendChartCard
        label="Month Trade Numbers"
        data={[]}
        month={selectedMonth}
        year={selectedYear}
        type="Month"
        profits={[]}
        arrayType="Trade"
        trades={tradeArray}
      />
      <TrendChartCard
        label="Day of Week Trade Numbers"
        data={[]}
        month={selectedMonth}
        year={selectedYear}
        type="Week"
        profits={[]}
        arrayType="Trade"
        trades={tradeArray}
      />
      <TrendChartCard
        label="Day of Month Trade Numbers"
        data={[]}
        month={selectedMonth}
        year={selectedYear}
        type="Day"
        profits={[]}
        arrayType="Trade"
        trades={tradeArray}
      />
    </div>
  );
};

export default TrendBlockView;
