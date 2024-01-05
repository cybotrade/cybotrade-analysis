import Histogram from '@app/_components/chart/Histogram';
import { cn } from '@app/_lib/utils';

type TrendChartCardProps = {
  label: string;
  data: [number, number][];
  month: string;
  year: string;
  type: string;
  profits: [number, number][];
  arrayType: 'maxDD' | 'Profit' | 'Trade';
  trades: [number, number][];
};

const TrendChartCard = ({
  label,
  data,
  month,
  year,
  type,
  profits,
  arrayType,
  trades,
}: TrendChartCardProps) => {
  return (
    <div className={cn('border rounded-xl bg-white dark:bg-[#473E2D] w-full max-h-[420px] py-6')}>
      <div className="text-xl text-black dark:text-white mb-3 px-6">{label}</div>
      <Histogram
        data={data}
        month={month}
        year={year}
        type={type}
        profits={profits}
        arrayType={arrayType}
        trades={trades}
        className="pr-4"
      />
    </div>
  );
};

export default TrendChartCard;
