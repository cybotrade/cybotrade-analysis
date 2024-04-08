'use client';

import { PropsWithChildren, createContext, useContext, useMemo, useReducer, useState } from 'react';

import { IClosedTrade, IClosedTradeProfit, ITrade } from '@app/(routes)/(route)/type';
import { Loading } from '@app/_components/loading';
import { useBacktestWorker } from '@app/_hooks/useBacktestWorker';
import { PerformanceData } from '@app/_lib/calculation';
import { useFileData } from '@app/_providers/file';

interface ITopic {
  category: string;
  exchange: string;
  interval: string;
  symbol: string;
  type: string;
}

export interface IBacktest {
  permutationId: string;
  trades: Map<string, ITrade[]>;
  closedTrades: Map<string, IClosedTrade[]>;
  tradesWithProfit: Map<string, IClosedTradeProfit[]>;
  performance: Map<string, PerformanceData>;
}

export interface IBacktestState {
  topics: ITopic[];
  initialCapital: number;
  backtests: Map<string, IBacktest>;
  startTime: number;
  endTime: number;
}

interface IBacktestAPI {
  onPermutationSelect: (id: string) => void;
}

const BacktestDataContext = createContext<
  (IBacktestState & { selectedPermutationId: string }) | null
>(null);
const BacktestAPIContext = createContext<IBacktestAPI>({
  onPermutationSelect: () => {},
});
export type TActions = { type: 'SET_DATA'; payload: IBacktestState };

const BacktestReducer = (state: IBacktestState, action: TActions): IBacktestState => {
  switch (action.type) {
    case 'SET_DATA':
      return {
        ...state,
        ...action.payload,
      };
  }
};
export const BacktestDataProvider = ({ children }: PropsWithChildren) => {
  const { data: fileData } = useFileData();
  const [state, dispatch] = useReducer(BacktestReducer, {} as IBacktestState);
  const [permutationId, setPermutationId] = useState<string>('');
  const { processing } = useBacktestWorker(fileData, {
    onProcessSuccess: (result) => {
      const parsedJson = JSON.parse(result);
      const backtestsMap = new Map(parsedJson.backtests as [string, IBacktest][]);

      for (const [id, { trades, closedTrades, tradesWithProfit, performance }] of backtestsMap) {
        backtestsMap.set(id, {
          permutationId: id,
          trades: new Map(trades),
          closedTrades: new Map(closedTrades),
          tradesWithProfit: new Map(tradesWithProfit),
          performance: new Map(performance),
        });
      }
      dispatch({
        type: 'SET_DATA',
        payload: {
          topics: parsedJson.topics,
          initialCapital: parsedJson.initial_capital,
          backtests: backtestsMap,
          startTime: parsedJson.start_time,
          endTime: parsedJson.end_time,
        },
      });
      setPermutationId(backtestsMap.keys().next().value);
    },
  });

  const api = useMemo(() => {
    const onPermutationSelect = (id: string) => {
      setPermutationId(id);
    };

    return { onPermutationSelect };
  }, []);
  return (
    <BacktestAPIContext.Provider value={api}>
      <BacktestDataContext.Provider value={{ ...state, selectedPermutationId: permutationId }}>
        {processing ? (
          <div className="flex justify-center items-center h-full">
            <Loading description="Loading ..." />
          </div>
        ) : (
          children
        )}
      </BacktestDataContext.Provider>
    </BacktestAPIContext.Provider>
  );
};

export const useBacktestData = () => {
  const context = useContext(BacktestDataContext);
  if (!context) {
    throw new Error('useBacktestData must be used inside the BacktestDataProvider');
  }
  return context;
};
export const useBacktestAPI = () => {
  const context = useContext(BacktestAPIContext);

  if (!context) {
    throw new Error('useBacktestAPI must be used inside the BacktestDataProvider');
  }

  return context;
};
