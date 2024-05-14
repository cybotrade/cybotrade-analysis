import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import Decimal from 'decimal.js';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';

import { IClosedTradeProfit } from '@app/(routes)/(route)/type';
import { SimulationsInput } from '@app/_features/dashboard/left/content/monte-carlo/SimulationsInput';
import { getPercentile, random_hex_color_code } from '@app/_utils/helper';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

type TSimulationData = {
  numberOfTrades: number[];
  simulations: number[][];
  monteCarloDrawdown: number;
  monteCarloProfit: number;
};

type TMonteCarloChartProps = {
  initialCapital: number;
  tradesWithProfit: IClosedTradeProfit[];
};

export const MonteCarloChart = ({ initialCapital, tradesWithProfit }: TMonteCarloChartProps) => {
  const chartOptions = useMemo<ChartOptions<'line'>>(
    () => ({
      scales: {
        y: {},
      },
      plugins: {
        legend: {
          display: false,
        },
      },
      animation: false,
      spanGaps: true,
    }),
    [],
  );
  const [meanDDResult, setMeanDDResult] = useState<number>(0);
  const [meanMaxProfit, setMeanMaxProfit] = useState<number>(0);

  const [simulationRuns, setSimulationRuns] = useState<TSimulationData[]>([]);
  const randomBorderColor = useRef(random_hex_color_code());
  const runSimulation = useCallback((numSimulations: number) => {
    if (tradesWithProfit.length === 0) return;

    const trades = tradesWithProfit;
    const result_index = Array.from({ length: trades.length }, (_, index) => index);
    const numberOfTrades = Array.from({ length: trades.length }, (_, index) => index);
    const sim_balance_graph: number[][] = [];
    const sim_max_dd: number[] = [];
    const sim_max_profit: number[] = [];

    for (let i = 0; i < numSimulations; i++) {
      const new_list = result_index.sort(() => Math.random() - 0.5);
      let new_max_dd = 0;
      let new_peak_balance = initialCapital;
      for (let n = 0; n < new_list.length; n++) {
        const trade_idx = new_list[n];
        const t_profit = trades[trade_idx].pnl;
        if (n == 0) {
          sim_balance_graph[i] = [initialCapital];
          const last_balance = sim_balance_graph[i][sim_balance_graph[i].length - 1];
          const new_balance = Decimal.add(last_balance, t_profit);
          sim_balance_graph[i].push(new_balance.toNumber());
        } else {
          const last_balance = sim_balance_graph[i][sim_balance_graph[i].length - 1];
          const new_balance = Decimal.add(last_balance, t_profit);
          sim_balance_graph[i].push(new_balance.toNumber());
          new_peak_balance = Math.max(new_peak_balance, new_balance.toNumber());
          new_max_dd = Math.max(new_max_dd, new_peak_balance - new_balance.toNumber());
        }
      }
      sim_max_dd.push(new_max_dd);
      sim_max_profit.push(new_peak_balance - initialCapital);
    }
    // UI is already toFixed(2) so no need to trunc here.
    const dd95 = (getPercentile(sim_max_dd, 95) / initialCapital) * 100;
    setMeanDDResult(dd95);

    const maxProfit95 = (getPercentile(sim_max_profit, 95) / initialCapital) * 100;
    setMeanMaxProfit(maxProfit95);

    const simulationRun: TSimulationData = {
      numberOfTrades: numberOfTrades,
      simulations: sim_balance_graph,
      monteCarloDrawdown: dd95,
      monteCarloProfit: maxProfit95,
    };
    // setSimulationRuns([...simulationRuns, simulationRun]);
    setSimulationRuns([simulationRun]);
    randomBorderColor.current = random_hex_color_code();
  }, []);

  const data = useMemo(() => {
    if (simulationRuns.length === 0) return null;

    const latestSimulationRun = simulationRuns[simulationRuns.length - 1];

    if (!latestSimulationRun) return null;

    return {
      labels: latestSimulationRun.simulations[0]?.map((_, i) => `${i + 1}`) ?? [],
      datasets: latestSimulationRun.simulations.map((data, i) => ({
        label: `Result ${i + 1}`,
        data,
        fill: false,
        spanGaps: true,
      })),
    };
  }, [simulationRuns]);

  useEffect(() => {
    runSimulation(10);
  }, [runSimulation]);

  return (
    <div className="relative">
      <SimulationsInput onSimulationsEnter={runSimulation} />

      <div className="relative">
        {data ? <Line data={data} options={chartOptions} /> : <div>Loading...</div>}
        <div className="bg-white/90 absolute  bottom-10 flex border p-3 right-0 w-auto justify-between space-x-4 dark:bg-[#392910]/90">
          <div className="">
            95 Percentile Max DD: <span className="text-xl">{meanDDResult.toFixed(2)} %</span>
          </div>
          <div className="">
            95 Percentile Profit: <span className="text-xl">{meanMaxProfit.toFixed(2)} %</span>
          </div>
        </div>
      </div>
    </div>
  );
};
