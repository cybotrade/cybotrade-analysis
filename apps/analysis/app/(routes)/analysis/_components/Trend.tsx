import clsx from 'clsx';
import { isAfter, isBefore, sub } from 'date-fns';
import Decimal from 'decimal.js';
import { FolderSearch } from 'lucide-react';
import React, { useMemo, useState } from 'react';

import Histogram from '@app/_components/chart/Histogram';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@app/_components/ui/Select';
import { calculatePerformance } from '@app/_lib/calculation';

import { IClosedTrade } from '../type';

interface TrendProps {
  closedTrades: IClosedTrade[];
}

export const Trend: React.FC<TrendProps> = ({ closedTrades }) => {
  const drawdowns = useMemo(
    () =>
      closedTrades
        ? closedTrades.map(({ exitTime, entryPrice, exitPrice }, i) => ({
            timestamp: exitTime,
            value: new Decimal(entryPrice).sub(exitPrice),
          }))
        : [],
    [closedTrades],
  );

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.toLocaleString('default', { month: 'short' }); // Get the current month as a short string (like "Jan")

  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  if (!closedTrades) {
    return (
      <div className="flex flex-col justify-center items-center w-full h-96 ">
        <div className="icon">
          <FolderSearch className="w-24 h-24" />
        </div>
        <span className="font-bold text-xl">No data available</span>
      </div>
    );
  }

  const performance = useMemo(() => {
    if (!closedTrades) return null;

    const calculatePerformanceForTimeframe = (timeframe: {
      days?: number | undefined;
      months?: number | undefined;
      years?: number | undefined;
    }) => {
      let startDate: Date;
      const endDate = closedTrades[closedTrades.length - 1]?.exitTime;
      if (!endDate) return;
      if (timeframe.days) {
        startDate = sub(endDate, { days: timeframe.days });
      } else if (timeframe.months) {
        startDate = sub(endDate, { months: timeframe.months });
      } else if (timeframe.years) {
        startDate = sub(endDate, { years: timeframe.years });
      } else {
        startDate = new Date(0);
      }

      const filteredClosedTrades = closedTrades.filter(
        (t) => isAfter(new Date(t.exitTime), startDate) && isBefore(new Date(t.exitTime), endDate),
      );

      return calculatePerformance({
        history: {
          closedTrades: filteredClosedTrades,
          openedTrades: [],
        },
        parameters: {
          comission: 0,
          initialCapital: 0,
          riskFreeRate: 0.02,
        },
      });
    };

    return {
      all: calculatePerformanceForTimeframe({}),
    };
  }, [closedTrades]);

  const maxDDArray = useMemo(
    () =>
      drawdowns.map(
        (drawdown) =>
          [new Date(drawdown.timestamp).getTime(), drawdown.value.toNumber()] as [number, number],
      ),
    [closedTrades],
  );

  function getPercentile(series: number[] | undefined, percentile: number) {
    if (!series) return 0;

    series.sort(function (a, b) {
      return a - b;
    });

    const index = (percentile / 100) * series.length ?? 0;
    let result;

    if (Math.floor(index) == index) {
      result = ((series[index - 1] ?? 0) + (series[index] ?? 0)) / 2;
    } else {
      result = series[Math.floor(index)] ?? 0;
    }

    return result;
  }

  const drawdownsWithPercentiles: [number, number][] = useMemo(() => {
    if (!performance || !performance.all) {
      return [];
    }

    return drawdowns.map((drawdown) => {
      const timestamp = new Date(drawdown.timestamp).getTime();
      const sim_max_dd = maxDDArray
        .filter((entry) => entry[0] <= timestamp)
        .map((entry) => entry[1]);

      const dd95 = (getPercentile(sim_max_dd, 95) / (performance.all?.initialCapital ?? 0)) * 100;

      return [timestamp, dd95];
    });
  }, [drawdowns, maxDDArray, performance]);

  const profitArray = useMemo(() => {
    return closedTrades.map((trade) => {
      const entryPrice = trade.entryPrice;
      const exitPrice = trade.exitPrice;
      const entryTime = new Date(trade.entryTime);
      const quantity = trade.quantity;

      const pnl = new Decimal(entryPrice).sub(exitPrice).mul(quantity);

      // Return an array with timestamp and pnl
      return [entryTime.getTime(), pnl.toNumber()] as [number, number];
    });
  }, [closedTrades]);

  const tradeArray = useMemo(() => {
    return closedTrades.map(
      (trade) =>
        [new Date(trade.entryTime).getTime(), new Date(trade.exitTime).getTime()] as [
          number,
          number,
        ],
    );
  }, [closedTrades]);

  return (
    <div className="py-8  h-auto max-w-[1060px] mx-auto">
      <div className="flex justify-end items-center pb-10">
        <div className="mr-6">Sort By</div>

        <Select onValueChange={(selectedYearValue) => setSelectedYear(selectedYearValue)}>
          <SelectTrigger className="w-[130px] mr-5 rounded-[40px] dark:bg-[#392910]">
            <SelectValue placeholder="Year" defaultValue={selectedYear} />
          </SelectTrigger>
          <SelectContent className="h-[130px] overflow-auto dark:bg-[#392910]">
            {(() => {
              function generateYears() {
                const currentYear = new Date().getFullYear();
                const years = [];
                for (let year = currentYear; year >= 2015; year--) {
                  years.push(year.toString());
                }
                return years;
              }

              return generateYears().map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ));
            })()}
          </SelectContent>
        </Select>

        <Select onValueChange={(selectedMonthValue) => setSelectedMonth(selectedMonthValue)}>
          <SelectTrigger className="w-[120px] rounded-[40px] mr-10 dark:bg-[#392910]">
            <SelectValue placeholder="Month" defaultValue={selectedMonth} />
          </SelectTrigger>
          <SelectContent
            className="h-[130px] overflow-auto dark:bg-[#392910] !z-50 hello
          "
          >
            {(() => {
              const months = [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec',
              ];

              return months.map((month) => (
                <SelectItem key={month} value={month}>
                  {month}
                </SelectItem>
              ));
            })()}
          </SelectContent>
        </Select>
      </div>
      {/* First Row */}
      <div className="w-full">
        <div className="flex pb-9 justify-center">
          <div
            className={clsx(
              ' border mr-9 rounded-xl bg-white dark:bg-[#473E2D]',
              'w-1/3 h-[452px]',
            )}
          >
            <div className="text-xl p-9 text-black dark:text-white">Month Max DD</div>
            <Histogram
              data={drawdownsWithPercentiles}
              month={selectedMonth}
              year={selectedYear}
              type="Month"
              profits={[]}
              arrayType="maxDD"
              trades={[]}
            />
          </div>
          <div
            className={clsx(
              ' border mr-9 rounded-xl bg-white dark:bg-[#473E2D]',
              'w-1/3 h-[452px]',
            )}
          >
            <div className="text-xl p-9 text-black dark:text-white">Day of Week Max DD</div>
            <Histogram
              data={drawdownsWithPercentiles}
              month={selectedMonth}
              year={selectedYear}
              type="Week"
              profits={[]}
              arrayType="maxDD"
              trades={[]}
            />
          </div>
          <div
            className={clsx(' border  rounded-xl bg-white dark:bg-[#473E2D]', 'w-1/3 h-[452px]')}
          >
            <div className="text-xl p-9 text-black dark:text-white">Day of Month Max DD</div>
            <Histogram
              data={drawdownsWithPercentiles}
              month={selectedMonth}
              year={selectedYear}
              type="Day"
              profits={[]}
              arrayType="maxDD"
              trades={[]}
            />
          </div>
        </div>
        {/* Second Row */}
        <div className="flex pb-9 justify-center">
          <div
            className={clsx(
              ' border mr-9 rounded-xl bg-white dark:bg-[#473E2D]',
              'w-1/3 h-[452px]',
            )}
          >
            <div className="text-xl p-9 text-black dark:text-white">Month Float Profit</div>
            <Histogram
              profits={profitArray}
              month={selectedMonth}
              year={selectedYear}
              type="Month"
              data={[]}
              arrayType="Profit"
              trades={[]}
            />
          </div>
          <div
            className={clsx(
              ' border mr-9 rounded-xl bg-white dark:bg-[#473E2D]',
              'w-1/3 h-[452px]',
            )}
          >
            <div className="text-xl p-9 text-black dark:text-white">Day of Week Float Profit</div>
            <Histogram
              profits={profitArray}
              month={selectedMonth}
              year={selectedYear}
              type="Week"
              data={[]}
              arrayType="Profit"
              trades={[]}
            />
          </div>
          <div
            className={clsx(' border  rounded-xl bg-white dark:bg-[#473E2D]', 'w-1/3 h-[452px]')}
          >
            <div className="text-xl p-9 text-black dark:text-white">Day of Month Float Profit</div>
            <Histogram
              profits={profitArray}
              month={selectedMonth}
              year={selectedYear}
              type="Day"
              data={[]}
              arrayType="Profit"
              trades={[]}
            />
          </div>
        </div>
        {/* Third Row */}
        <div className="flex pb-9 justify-center">
          <div
            className={clsx(
              ' border mr-9 rounded-xl bg-white dark:bg-[#473E2D]',
              'w-1/3 h-[452px]',
            )}
          >
            <div className="text-xl p-9 text-black dark:text-white">Month Trade Numbers</div>
            <Histogram
              trades={tradeArray}
              month={selectedMonth}
              year={selectedYear}
              type="Month"
              data={[]}
              arrayType="Trade"
              profits={[]}
            />
          </div>
          <div
            className={clsx(
              ' border mr-9 rounded-xl bg-white dark:bg-[#473E2D]',
              'w-1/3 h-[452px]',
            )}
          >
            <div className="text-xl p-9 text-black dark:text-white">Day of Week Trade Numbers</div>
            <Histogram
              trades={tradeArray}
              month={selectedMonth}
              year={selectedYear}
              type="Week"
              data={[]}
              profits={[]}
              arrayType="Trade"
            />
          </div>
          <div className={clsx(' border rounded-xl bg-white dark:bg-[#473E2D]', 'w-1/3 h-[452px]')}>
            <div className="text-xl p-9 text-black dark:text-white">Day of Month Trade Numbers</div>
            <Histogram
              trades={tradeArray}
              month={selectedMonth}
              year={selectedYear}
              type="Day"
              data={[]}
              profits={[]}
              arrayType="Trade"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
