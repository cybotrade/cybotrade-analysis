import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import Decimal from 'decimal.js';
import { FolderSearch } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Line } from 'react-chartjs-2';

import { Loading } from '@app/_components/loading';
import { pnl } from '@app/_lib/calculation';
import { Input } from '@app/_ui/Input';

import { IClosedTrade } from '../type';

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

// Declare the random_hex_color_code function before using it
const random_hex_color_code = () => {
  const n = (Math.random() * 0xfffff * 1000000).toString(16);
  return '#' + n.slice(0, 6);
};

export function getPercentile(series: number[] | undefined, percentile: number) {
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

type SimulationData = {
  numberOfTrades: number[];
  simulations: number[][];
  monteCarloDrawdown: number;
  monteCarloProfit: number;
};
type Trade = IClosedTrade & { pnl: Decimal };
export const MonteCarlo = ({ closedTrades }: { closedTrades: IClosedTrade[] }) => {
  const [meanDDResult, setMeanDDResult] = useState<number>(0);
  const [meanMaxProfit, setMeanMaxProfit] = useState<number>(0);

  const [numSimulations, setNumSimulations] = useState(10);
  const [initialCapital, setInitialCapital] = useState(10000); // TODO: use parameters
  const [numSuccesses, setNumSuccesses] = useState(0);

  const [simulationRuns, setSimulationRuns] = useState<SimulationData[]>([]);
  const [randomBorderColor, setRandomBorderColor] = useState(random_hex_color_code());

  const tradesWithProfit: Trade[] = useMemo(
    () =>
      closedTrades
        ? closedTrades.map((t: IClosedTrade) => ({
            ...t,
            pnl: pnl({
              comission: new Decimal(0),
              entryPrice: new Decimal(t.entryPrice),
              entryQuantity: new Decimal(t.quantity),
              exitPrice: new Decimal(t.exitPrice),
              exitQuantity: new Decimal(t.quantity),
              orderSide: t.side,
            }),
          }))
        : [],
    [closedTrades],
  );

  const runSimulation = useCallback(() => {
    if (tradesWithProfit.length === 0) return;

    const result_index = Array.from({ length: tradesWithProfit.length }, (_, index) => index);
    const numberOfTrades = Array.from({ length: tradesWithProfit.length + 1 }, (_, index) => index);
    const sim_balance_graph: number[][] = [];
    const sim_max_dd: number[] = [];
    const sim_max_profit: number[] = [];

    for (let i = 0; i < numSimulations; i++) {
      const new_list = result_index.sort(() => Math.random() - 0.5);
      let new_max_dd = 0;
      let new_peak_balance = initialCapital;
      for (let n = 0; n < new_list.length; n++) {
        const trade_idx = new_list[n] ?? 0;
        const t_profit = tradesWithProfit[trade_idx]?.pnl ?? 0;
        if (n == 0) {
          sim_balance_graph[i] = [initialCapital];
          const last_balance =
            (sim_balance_graph[i] ?? [])[(sim_balance_graph[i] ?? []).length - 1] ?? 0;
          const new_balance = Decimal.add(last_balance, t_profit);
          (sim_balance_graph[i] ?? []).push(new_balance.toNumber());
        } else {
          const last_balance =
            (sim_balance_graph[i] ?? [])[(sim_balance_graph[i] ?? []).length - 1] ?? 0;
          const new_balance = Decimal.add(last_balance, t_profit);
          (sim_balance_graph[i] ?? []).push(new_balance.toNumber());
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

    const simulationRun: SimulationData = {
      numberOfTrades: numberOfTrades,
      simulations: sim_balance_graph,
      monteCarloDrawdown: dd95,
      monteCarloProfit: maxProfit95,
    };
    // setSimulationRuns([...simulationRuns, simulationRun]);
    setSimulationRuns([simulationRun]);
    setRandomBorderColor(random_hex_color_code()); // Update random color
  }, [tradesWithProfit, numSimulations]);

  useEffect(() => runSimulation(), []);

  const data = useMemo(() => {
    if (simulationRuns.length === 0) return null;

    const latestSimulationRun = simulationRuns[simulationRuns.length - 1];

    if (!latestSimulationRun) return null;

    const colors = Array.from({ length: latestSimulationRun.simulations.length }, () =>
      random_hex_color_code(),
    );

    return {
      labels: latestSimulationRun.simulations[0]?.map((_, i) => `${i + 1}`) ?? [],
      datasets: latestSimulationRun.simulations.map((data, i) => ({
        label: `Result ${i + 1}`,
        data,
        borderColor: colors[i],
        borderWidth: 2,
        fill: false,
      })),
    };
  }, [simulationRuns]);

  const options = {
    scales: {
      y: {},
    },
    plugins: {
      legend: {
        display: false,
      },
    },
    animation: {
      duration: 0, //TODO: Disable animations avoid lagging
    },
  };

  if (!closedTrades)
    return (
      <div className="h-[600px] flex justify-center items-center">
        <Loading description="Loading..."></Loading>
      </div>
    );

  if (tradesWithProfit.length === 0)
    return (
      <div className="flex flex-col justify-center items-center w-full h-96 ">
        <div className="icon">
          <FolderSearch className="w-24 h-24" />
        </div>
        <span className="font-bold text-xl">No closed trades data available. </span>
      </div>
    );

  return (
    <div>
      <div className="">
        <form className="mb-4">
          <div className="w-[300px] border rounded-lg border-[#DFDFDF] p-4 flex justify-between left-[85px] top-[130px] items-center relative bg-white/90 dark:bg-[#392910]/90 text-black dark:text-white z-50">
            <div className="flex items-center">
              <label className="mr-2">Number of Simulations:</label>
              <Input
                type="number"
                value={numSimulations}
                onChange={(e) => setNumSimulations(parseInt(e.target.value))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    runSimulation();
                  }
                }}
                className="w-[85px] h-8 border-[#f0ece9] border bg-[#fffcf6]/90"
              />
            </div>
          </div>
        </form>
        {numSuccesses > 0 && <p>Successful simulations: {numSuccesses}</p>}

        <div className="relative">
          {data ? <Line data={data} options={options} className="p-10" /> : <div>Loading...</div>}
          <div className="bg-white/90 absolute  bottom-[75px] flex border p-3 right-[55px] w-auto justify-between space-x-4 dark:bg-[#392910]/90">
            <div className="">
              95 Percentile Max DD: <span className="text-xl">{meanDDResult.toFixed(2)} %</span>
            </div>
            <div className="">
              95 Percentile Profit: <span className="text-xl">{meanMaxProfit.toFixed(2)} %</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
