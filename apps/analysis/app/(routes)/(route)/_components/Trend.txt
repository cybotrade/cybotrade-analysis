import Decimal from 'decimal.js';
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';
import { FolderSearch } from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import { Grid as GridIcon, Horizontal as HorizontalIcon } from '@app/_assets/icons';
import TrendChartCard from '@app/_components/trend/TrendChartCard';
import { calculatePerformance } from '@app/_lib/calculation';
import { cn } from '@app/_lib/utils';
import { CarouselContainer, CarouselContent, CarouselItem } from '@app/_ui/Carousel';
import { type CarouselApi } from '@app/_ui/Carousel';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@app/_ui/Select';

import { IClosedTrade } from '../type';

interface TrendProps {
  closedTrades: IClosedTrade[];
  initialCapital?: number;
}

export const Trend: React.FC<TrendProps> = ({ closedTrades, initialCapital = 100000 }) => {
  const [view, setView] = useState<'block' | 'scroll'>('block');
  const drawdowns = useMemo(
    () =>
      closedTrades
        ? closedTrades.map(({ exitTime, entryPrice, exitPrice }, i) => ({
          timestamp: exitTime,
          value: new Decimal(exitPrice).sub(entryPrice),
        }))
        : [],
    [closedTrades],
  );

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.toLocaleString('default', { month: 'short' }); // Get the current month as a short string (like "Jan")

  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  const dotsRef = useRef<HTMLDivElement>(null);
  const [embla, setEmbla] = useState<CarouselApi>();
  const [currentSlideIndex, setCurrentSlideIndex] = React.useState(0);

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

      const dd95 =
        (getPercentile(sim_max_dd, 95) /
          (performance.all?.initialCapital ? +performance.all?.initialCapital : 0)) *
        100;

      return [timestamp, dd95];
    });
  }, [drawdowns, maxDDArray, performance, initialCapital]);

  const profitArray = useMemo(() => {
    return closedTrades.map((trade) => {
      const entryPrice = trade.entryPrice;
      const exitPrice = trade.exitPrice;
      const exitTime = new Date(trade.exitTime);
      const quantity = trade.quantity;

      const pnl = new Decimal(exitPrice).sub(entryPrice).mul(quantity);

      // Return an array with timestamp and pnl
      return [exitTime.getTime(), pnl.toNumber()] as [number, number];
    });
  }, [closedTrades]);

  const tradeArray = useMemo(() => {
    return closedTrades.map((trade) => [new Date(trade.exitTime).getTime()] as [number]);
  }, [closedTrades]);

  const reset = () => {
    setCurrentSlideIndex(1);
    updateDots(0);
  };

  const updateDots = (scrollProgress: number) => {
    const dotsContainer = dotsRef.current;

    if (dotsContainer) {
      const dotsArray = Array.from(dotsContainer.children) as HTMLDivElement[];
      const numberOfDots = dotsArray.length;
      const activeDotIndex = Math.floor(scrollProgress * (numberOfDots - 1));

      dotsArray.forEach((dot) => {
        if (dot.textContent) dot.style.color = 'black'; // inactive color for labels
        else dot.style.backgroundColor = '#D9D9D9'; // inactive color for dots
      });

      dotsArray.forEach((dot, index) => {
        if (index <= activeDotIndex) {
          if (dot.textContent) dot.style.color = '#E59E2E'; // active label color
          else dot.style.backgroundColor = '#E59E2E'; // active dot color
        }
      });
    }
  };

  const onScroll = (emblaApi: CarouselApi) => {
    updateDots(emblaApi.scrollProgress());
  };

  useEffect(() => {
    if (!embla) {
      return;
    }

    reset();

    embla.on('scroll', onScroll);
    embla.on('select', () => {
      setCurrentSlideIndex(embla.selectedScrollSnap() + 1);
    });
  }, [embla]);

  return (
    <div
      className={cn(
        {
          'bg-gradient-to-b from-[#D9D9D900] to-[#FFF4E7] dark:bg-[#37332A]': view === 'block',
        },
        view === 'scroll' &&
        currentSlideIndex > 0 &&
        'bg-gradient-to-b from-[#D9D9D900] to-[#FFEBEB] dark:bg-[#37332A]',
        view === 'scroll' &&
        currentSlideIndex > 3 &&
        'bg-gradient-to-b from-[#D9D9D900] to-[#E0F2E2] dark:bg-[#37332A]',
        view === 'scroll' &&
        currentSlideIndex > 6 &&
        'bg-gradient-to-b from-[#D9D9D900] to-[#DBE8EC] dark:bg-[#37332A]',
      )}
    >
      <div className="px-8 py-8 w-full flex flex-col gap-10">
        <div className="flex items-center justify-end gap-4">
          <div>Sort By</div>
          <Select
            value={selectedYear}
            onValueChange={(selectedYearValue) => setSelectedYear(selectedYearValue)}
          >
            <SelectTrigger className="w-[120px] rounded-full dark:bg-[#392910]">
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
            <SelectTrigger className="w-[120px] rounded-full dark:bg-[#392910]">
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
          <div className="h-[40px] border border-[#DFDFDF] flex items-center p-3 gap-2">
            <HorizontalIcon
              className={cn(
                'w-5 h-5 text-[#8A8A8A] cursor-pointer',
                view === 'scroll' && 'text-[#B28249]',
              )}
              onClick={() => {
                reset();
                setView('scroll');
              }}
            />
            <div className="h-[15px] border border-r-0 border-[#DFDFDF]"></div>
            <GridIcon
              className={cn(
                'w-5 h-5 text-[#8A8A8A] cursor-pointer',
                view === 'block' && 'text-[#B28249]',
              )}
              onClick={() => {
                reset();
                setView('block');
              }}
            />
          </div>
        </div>

        <CarouselContainer
          opts={{
            align: 'start',
            loop: false,
            skipSnaps: true,
            active: view === 'scroll',
          }}
          plugins={[
            WheelGesturesPlugin({
              forceWheelAxis: 'y',
            }),
          ]}
          setApi={setEmbla}
        >
          <CarouselContent
            className={cn(
              view === 'block' ? 'grid grid-cols-3 place-content-between' : 'flex',
              'ml-0 gap-6',
            )}
          >
            <CarouselItem
              className={cn(
                view === 'scroll' &&
                'transition ease-in-out delay-150 hover:-translate-y-5 hover:scale-140 hover:border-primary duration-300 max-w-[400px] mt-8',
              )}
            >
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
            </CarouselItem>
            <CarouselItem
              className={cn(
                view === 'scroll' &&
                'transition ease-in-out delay-150 hover:-translate-y-5 hover:scale-140 hover:border-primary duration-300 max-w-[400px] mt-8',
              )}
            >
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
            </CarouselItem>
            <CarouselItem
              className={cn(
                view === 'scroll' &&
                'transition ease-in-out delay-150 hover:-translate-y-5 hover:scale-140 hover:border-primary duration-300 max-w-[400px] mt-8',
              )}
            >
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
            </CarouselItem>
            <CarouselItem
              className={cn(
                view === 'scroll' &&
                'transition ease-in-out delay-150 hover:-translate-y-5 hover:scale-140 hover:border-primary duration-300 max-w-[400px] mt-8',
              )}
            >
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
            </CarouselItem>
            <CarouselItem
              className={cn(
                view === 'scroll' &&
                'transition ease-in-out delay-150 hover:-translate-y-5 hover:scale-140 hover:border-primary duration-300 max-w-[400px] mt-8',
              )}
            >
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
            </CarouselItem>
            <CarouselItem
              className={cn(
                view === 'scroll' &&
                'transition ease-in-out delay-150 hover:-translate-y-5 hover:scale-140 hover:border-primary duration-300 max-w-[400px] mt-8',
              )}
            >
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
            </CarouselItem>
            <CarouselItem
              className={cn(
                view === 'scroll' &&
                'transition ease-in-out delay-150 hover:-translate-y-5 hover:scale-140 hover:border-primary duration-300 max-w-[400px] mt-8',
              )}
            >
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
            </CarouselItem>
            <CarouselItem
              className={cn(
                view === 'scroll' &&
                'transition ease-in-out delay-150 hover:-translate-y-5 hover:scale-140 hover:border-primary duration-300 max-w-[400px] mt-8',
              )}
            >
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
            </CarouselItem>
            <CarouselItem
              className={cn(
                view === 'scroll' &&
                'transition ease-in-out delay-150 hover:-translate-y-5 hover:scale-140 hover:border-primary duration-300 max-w-[400px] mt-8',
              )}
            >
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
            </CarouselItem>
          </CarouselContent>
          {view === 'scroll' && (
            <div className="mt-12 px-16">
              <div className="w-full rounded-full bg-white px-4 py-2">
                <div className="scrollbar-area relative h-5">
                  <div ref={dotsRef} className="flex h-full items-center justify-between">
                    <div className="block font-sans">Max Drawdown</div>
                    {Array.from({ length: 14 }).map((_, i) => (
                      <div key={i} className="h-2 w-2 rounded-full bg-[#D9D9D9]"></div>
                    ))}
                    <div className="block font-sans">Float Profit</div>
                    {/* {Array.from({ length: 24 }).map((_, i) => (
                      <div key={i} className="h-2 w-2 rounded-full bg-[#D9D9D9]"></div>
                    ))}
                    <div className="block font-sans">Closed Profit</div> */}
                    {Array.from({ length: 14 }).map((_, i) => (
                      <div key={i} className="h-2 w-2 rounded-full bg-[#D9D9D9]"></div>
                    ))}
                    <div className="block font-sans">Trade Numbers</div>
                  </div>
                </div>
              </div>
            </div>
          )}{' '}
        </CarouselContainer>
      </div>
    </div>
  );
};
