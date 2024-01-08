import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from 'chart.js';
import { useTheme } from 'next-themes';
import React, { useRef } from 'react';
import { Bar } from 'react-chartjs-2';

import { cn } from '@app/_lib/utils';

interface HistogramProps {
  data: [number, number][];
  profits: [number, number][];
  trades: [number][];
  year: string;
  month: string;
  type: string;
  arrayType: 'maxDD' | 'Profit' | 'Trade';
  className: string;
}
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const Histogram: React.FC<HistogramProps> = ({
  data,
  profits,
  trades,
  year,
  month,
  type,
  arrayType,
  className,
}) => {
  // const { asPath } = useRouter();
  // const isArenaPath = asPath.includes('/arena/');

  // const chartSize = isArenaPath ? { width: 100, height: 100 } : { width: 300, height: 300 };
  const chartSize = { width: 300, height: 300 };

  const filteredDataByYear = data.filter((entry) => {
    const entryYear = new Date(entry[0]).getFullYear();
    return entryYear.toString() === year;
  });

  const filteredDataByYearforProfit = profits.filter((entry) => {
    const entryYear = new Date(entry[0]).getFullYear();
    return entryYear.toString() === year;
  });

  const filteredDataByYearforTrade = trades.filter((entry) => {
    const entryYear = new Date(entry[0]).getFullYear();
    return entryYear.toString() === year;
  });

  const calculateTotalTradeForYear = (data: [number][], year: string) => {
    // Yearly trade
    const totalTradeByMonth: { [month: string]: number } = {};

    data.forEach((entry) => {
      const entryDate = new Date(entry[0]);
      const entryYear = entryDate.getFullYear();
      const entryMonth = entryDate.getMonth() + 1;

      if (entryYear.toString() === year) {
        const formattedMonth = entryDate.toLocaleString('default', { month: 'short' });

        if (!totalTradeByMonth[formattedMonth]) {
          totalTradeByMonth[formattedMonth] = 1;
        } else {
          totalTradeByMonth[formattedMonth]++;
        }
      }
    });

    // Create an array of month names for labels
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

    const result = months.map((month) => [month, totalTradeByMonth[month] || 0]);

    return result;
  };

  const totalTradeByMonth = calculateTotalTradeForYear(filteredDataByYearforTrade, year);

  const calculateTotalTradeForDay = (data: [number][], year: string, month: string) => {
    // day trade
    const totalTradeByDay: [string, number][] = [];

    const targetYear = parseInt(year, 10);
    const targetMonth = new Date(`${year}-${month}-01`).getMonth() + 1;

    const currentDayData: [string, number][] = [];
    let currentDate = 1;
    let dayTotal = 0;

    data.forEach((trade) => {
      const entryYear = new Date(trade[0]).getFullYear();
      const entryMonth = new Date(trade[0]).getMonth() + 1;

      if (entryYear === targetYear && entryMonth === targetMonth) {
        const entryDate = new Date(trade[0]).getDate();

        if (entryDate === currentDate) {
          dayTotal += 1;
        } else {
          const formattedDate = `${year}-${month}-${currentDate.toString().padStart(2, '0')}`;
          currentDayData.push([formattedDate, dayTotal]);
          dayTotal = 1;
          currentDate = entryDate;
        }
      }
    });

    const formattedDate = `${year}-${month}-${currentDate.toString().padStart(2, '0')}`;
    currentDayData.push([formattedDate, dayTotal]);

    totalTradeByDay.push(...currentDayData);

    return totalTradeByDay;
  };

  const totalTradeByDay = calculateTotalTradeForDay(filteredDataByYearforTrade, year, month);

  const calculateTotalTradeForMonthByWeekly = (data: [number][], year: string, month: string) => {
    // Initialize an array to store total trade for each day of the week (Mon to Sun)
    const totalTradeByDay: { dayOfWeek: string; total: number }[] = [
      { dayOfWeek: 'Mon', total: 0 },
      { dayOfWeek: 'Tue', total: 0 },
      { dayOfWeek: 'Wed', total: 0 },
      { dayOfWeek: 'Thu', total: 0 },
      { dayOfWeek: 'Fri', total: 0 },
      { dayOfWeek: 'Sat', total: 0 },
      { dayOfWeek: 'Sun', total: 0 },
    ];

    const targetYear = parseInt(year, 10);
    const targetMonth = new Date(`${year}-${month}-01`).getMonth() + 1;

    data.forEach((trade) => {
      const entryYear = new Date(trade[0]).getFullYear();
      const entryMonth = new Date(trade[0]).getMonth() + 1;

      if (entryYear === targetYear && entryMonth === targetMonth) {
        const entryDate = new Date(trade[0]);
        const dayOfWeek = entryDate.toLocaleDateString('en-US', { weekday: 'short' });

        // Update the total trade for the corresponding day of the week
        const dayEntry = totalTradeByDay.find((entry) => entry.dayOfWeek === dayOfWeek);
        if (dayEntry) {
          dayEntry.total += 1;
        }
      }
    });

    return totalTradeByDay;
  };

  const totalTradeByDayForMonth = calculateTotalTradeForMonthByWeekly(
    filteredDataByYearforTrade,
    year,
    month,
  );

  const calculateMaxValuesByMonthInYear = (data: [number, number][], year: string) => {
    // MaxDD monthly
    const maxValuesByMonth: { month: string; maxDD: number }[] = [];

    // Initialize the month names
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

    // Initialize maxDD for each month
    const maxDDByMonth: { [month: string]: { max: number; timestamp: number } } = {};

    data.forEach((entry) => {
      const entryDate = new Date(entry[0]);
      const entryYear = entryDate.getFullYear();
      const entryMonth = entryDate.getMonth();

      if (entryYear.toString() === year) {
        const formattedMonth = months[entryMonth];
        if (
          !maxDDByMonth[formattedMonth as keyof typeof maxDDByMonth] ||
          entry[1] > maxDDByMonth[formattedMonth as keyof typeof maxDDByMonth].max
        ) {
          maxDDByMonth[formattedMonth as keyof typeof maxDDByMonth] = {
            max: entry[1],
            timestamp: entry[0],
          };
        }
      }
    });

    // Push maxDD values for each month into the result array
    for (const month of months) {
      maxValuesByMonth.push({
        month: month,
        maxDD: maxDDByMonth[month] ? maxDDByMonth[month].max : 0,
      });
    }

    return maxValuesByMonth;
  };

  const maxValuesByMonth = calculateMaxValuesByMonthInYear(filteredDataByYear, year);

  const calculateTotalProfitByMonthInYear = (data: [number, number][], year: string) => {
    //profit monthly
    const totalProfitByMonth: { month: string; total: number }[] = [
      { month: 'Jan', total: 0 },
      { month: 'Feb', total: 0 },
      { month: 'Mar', total: 0 },
      { month: 'Apr', total: 0 },
      { month: 'May', total: 0 },
      { month: 'Jun', total: 0 },
      { month: 'Jul', total: 0 },
      { month: 'Aug', total: 0 },
      { month: 'Sep', total: 0 },
      { month: 'Oct', total: 0 },
      { month: 'Nov', total: 0 },
      { month: 'Dec', total: 0 },
    ];

    data.forEach((entry) => {
      const entryDate = new Date(entry[0]);
      const entryYear = entryDate.getFullYear();
      const entryMonth = entryDate.getMonth();

      if (entryYear.toString() === year) {
        totalProfitByMonth[entryMonth].total += entry[1];
      }
    });
    return totalProfitByMonth;
  };

  const totalProfitByMonthForYear = calculateTotalProfitByMonthInYear(
    filteredDataByYearforProfit,
    year,
  );

  const filterDataAndFindMaxForMonth = (data: [number, number][], month: string) => {
    //Day maxDD
    const monthNumber = new Date(Date.parse(month + ' 1, 2000')).getMonth();

    const filteredDataForMonth = data.filter((entry) => {
      const entryDate = new Date(entry[0]);
      const entryMonth = entryDate.getMonth();
      return entryMonth === monthNumber;
    });

    if (filteredDataForMonth.length === 0) {
      return [];
    }

    const maxValuesByDay: { [key: number]: { max: number; timestamp: number } } = {};

    filteredDataForMonth.forEach((entry) => {
      const entryDate = new Date(entry[0]);
      const entryDay = entryDate.getDate();
      const entryValue = entry[1];

      if (!maxValuesByDay[entryDay] || entryValue > maxValuesByDay[entryDay].max) {
        maxValuesByDay[entryDay] = { max: entryValue, timestamp: entry[0] };
      }
    });

    const maxValuesArray = Object.values(maxValuesByDay);

    return maxValuesArray;
  };

  const maxValuesByDay = filterDataAndFindMaxForMonth(filteredDataByYear, month); //maxdrawdown day

  const calculateTotalProfitByDay = (data: [number, number][], month: string) => {
    //profit day
    const monthNumber = new Date(Date.parse(month + ' 1, 2000')).getMonth();

    const filteredDataForMonth = data.filter((entry) => {
      const entryDate = new Date(entry[0]);
      const entryMonth = entryDate.getMonth();
      return entryMonth === monthNumber;
    });

    if (filteredDataForMonth.length === 0) {
      return [];
    }

    const totalProfitByDay: { timestamp: number; total: number }[] = [];

    filteredDataForMonth.forEach((entry) => {
      const entryDate = new Date(entry[0]);
      const entryDay = entryDate.getDate();
      const entryValue = entry[1];

      // Accumulate profit for each day
      const existingDayEntry = totalProfitByDay.find(
        (dayEntry) => dayEntry.timestamp === entryDate.getTime(),
      );

      if (existingDayEntry) {
        existingDayEntry.total += entryValue;
      } else {
        totalProfitByDay.push({ timestamp: entryDate.getTime(), total: entryValue });
      }
    });

    return totalProfitByDay;
  };

  const totalProfitByDayForMonth = calculateTotalProfitByDay(filteredDataByYearforProfit, month);

  const calculateMaxValuesForDaysOfWeekInMonth = (data: [number, number][], month: string) => {
    //maxDD weekly
    const monthNumber = new Date(Date.parse(month + ' 1, 2000')).getMonth();

    const filteredDataForMonth = data.filter((entry) => {
      const entryDate = new Date(entry[0]);
      const entryMonth = entryDate.getMonth();
      return entryMonth === monthNumber;
    });

    if (filteredDataForMonth.length === 0) {
      return [];
    }

    const maxValuesForDaysOfWeek: { [key: number]: { max: number; timestamp: number } } = {};

    filteredDataForMonth.forEach((entry) => {
      const entryDate = new Date(entry[0]);
      const entryValue = entry[1];
      const dayOfWeek = entryDate.getDay();

      if (
        !maxValuesForDaysOfWeek[dayOfWeek] ||
        entryValue > maxValuesForDaysOfWeek[dayOfWeek].max
      ) {
        maxValuesForDaysOfWeek[dayOfWeek] = { max: entryValue, timestamp: entry[0] };
      }
    });

    const maxValuesArray = Object.values(maxValuesForDaysOfWeek);

    return maxValuesArray;
  };

  const maxWeeklyValuesByMonth = calculateMaxValuesForDaysOfWeekInMonth(filteredDataByYear, month);

  const calculateTotalProfitByDayForMonth = (data: [number, number][], month: string) => {
    //profit weekly
    const monthNumber = new Date(Date.parse(month + ' 1, 2000')).getMonth();
    const filteredDataForMonth = data.filter((entry) => {
      const entryDate = new Date(entry[0]);
      const entryMonth = entryDate.getMonth();
      return entryMonth === monthNumber;
    });

    if (filteredDataForMonth.length === 0) {
      return [];
    }

    const totalProfitByDay: { dayOfWeek: string; total: number }[] = [];
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const dailyTotals: { [dayOfWeek: string]: number } = {};
    daysOfWeek.forEach((day) => {
      dailyTotals[day] = 0;
    });

    filteredDataForMonth.forEach((entry) => {
      const entryDate = new Date(entry[0]);
      const entryValue = entry[1];

      const currentDayOfWeek = daysOfWeek[entryDate.getDay()];

      dailyTotals[currentDayOfWeek] += entryValue;
    });

    daysOfWeek.forEach((day) => {
      totalProfitByDay.push({ dayOfWeek: day, total: dailyTotals[day] });
    });

    return totalProfitByDay;
  };

  const totalProfitByWeekForMonth = calculateTotalProfitByDayForMonth(
    filteredDataByYearforProfit,
    month,
  );
  const { theme } = useTheme();
  const isDarkTheme = theme === 'dark';

  const chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          // text: 'X-Axis Label',
          color: isDarkTheme ? 'white' : 'black',
        },
        grid: {
          color: isDarkTheme ? '#706C6C' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: isDarkTheme ? 'white' : 'black',
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          // text: 'Y-Axis Label',
          color: isDarkTheme ? 'white' : 'black',
        },
        grid: {
          color: isDarkTheme ? '#706C6C' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: isDarkTheme ? 'white' : 'black',
        },
      },
    },
  };
  const containerRef = useRef(null);
  const barBorderRadius = 5;

  return (
    <div ref={containerRef} className={cn('h-[300px]', className)}>
      {chartSize.width && chartSize.height && (
        <>
          {arrayType === 'maxDD' && (
            <Bar
              data={{
                labels:
                  type === 'Month'
                    ? maxValuesByMonth.map((item) => item.month)
                    : type === 'Week'
                      ? maxWeeklyValuesByMonth.map((item) =>
                          new Date(item.timestamp).toLocaleDateString(),
                        )
                      : type === 'Day'
                        ? maxValuesByDay.map((item) =>
                            new Date(item.timestamp).toLocaleDateString(),
                          )
                        : [],
                datasets: [
                  {
                    label: 'Max Drawdown',
                    data:
                      type === 'Month'
                        ? maxValuesByMonth.map((item) => item.maxDD)
                        : type === 'Week'
                          ? maxWeeklyValuesByMonth.map((item) => item.max)
                          : type === 'Day'
                            ? maxValuesByDay.map((item) => item.max)
                            : [],
                    backgroundColor: isDarkTheme ? '#D98080' : '#F0CFD3',
                    borderRadius: barBorderRadius,
                  },
                ],
              }}
              options={{ ...chartOptions, ...chartSize }}
            />
          )}

          {arrayType === 'Profit' && (
            <Bar
              data={{
                labels:
                  type === 'Month'
                    ? totalProfitByMonthForYear.map((item) => item.month)
                    : type === 'Week'
                      ? totalProfitByWeekForMonth.map((item) => item.dayOfWeek)
                      : type === 'Day'
                        ? totalProfitByDayForMonth.map((item) =>
                            new Date(item.timestamp).toLocaleDateString(),
                          )
                        : [],
                datasets: [
                  {
                    label: 'Profit',
                    data:
                      type === 'Month'
                        ? totalProfitByMonthForYear.map((item) => item.total)
                        : type === 'Week'
                          ? totalProfitByWeekForMonth.map((item) => item.total)
                          : type === 'Day'
                            ? totalProfitByDayForMonth.map((item) => item.total)
                            : [],
                    backgroundColor: (context) => {
                      const max = context.dataset.data[context.dataIndex];

                      if (typeof max === 'number') {
                        if (max < 0) {
                          return isDarkTheme ? '#D98080' : 'rgba(240, 207, 211, 1)';
                        }
                      } else if (Array.isArray(max) && max.length > 0) {
                        const maxValue = Math.max(...max);
                        if (maxValue < 0) {
                          return isDarkTheme ? '#5E7965' : 'rgba(255, 0, 0, 1)';
                        }
                      }
                      return '#5E7965';
                    },
                    borderRadius: barBorderRadius,
                  },
                ],
              }}
              options={{ ...chartOptions, ...chartSize }}
            />
          )}

          {arrayType === 'Trade' && (
            <Bar
              data={{
                labels:
                  type === 'Month'
                    ? totalTradeByMonth.map((item) => item[0])
                    : type === 'Week'
                      ? totalTradeByDayForMonth.map((item) => item.dayOfWeek)
                      : type === 'Day'
                        ? totalTradeByDay.map((item) => new Date(item[0]).toLocaleDateString())
                        : [],
                datasets: [
                  {
                    label: 'Total Trade',
                    data:
                      type === 'Month'
                        ? totalTradeByMonth.map((item) => item[1])
                        : type === 'Week'
                          ? totalTradeByDayForMonth.map((item) => item.total)
                          : type === 'Day'
                            ? totalTradeByDay.map((item) => item[1])
                            : [],
                    backgroundColor: isDarkTheme ? '#6A9FC5' : 'rgba(190, 218, 238, 1)',
                    borderRadius: barBorderRadius,
                  },
                ],
              }}
              options={{ ...chartOptions, ...chartSize }}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Histogram;
