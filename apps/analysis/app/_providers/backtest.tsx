'use client';

import { data } from 'autoprefixer';
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';

import { IClosedTrade, IClosedTradeProfit, ITrade } from '@app/(routes)/(route)/type';
import { Loading } from '@app/_components/loading';
import { useBacktestWorker } from '@app/_hooks/useBacktestWorker';
import { usePlotWorker } from '@app/_hooks/usePlotWorker';
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
  trades: ITrade[];
  closedTrades: IClosedTrade[];
  tradesWithProfit: IClosedTradeProfit[];
  performance: PerformanceData;
}

export interface IPlot {
  id: string;
  sharpeRatio: number;
}

export interface IBacktestState {
  topics: ITopic[];
  initialCapital: number;
  permutationId: string;
  backtests: Map<string, IBacktest>;
  plot?: IPlot[];
  startTime: number;
  endTime: number;
}

interface IBacktestAPI {
  onPermutationSelect: (id: string) => void;
}

const BacktestDataContext = createContext<
  | (IBacktestState & {
      processing: boolean;
    })
  | null
>(null);
const BacktestAPIContext = createContext<IBacktestAPI>({
  onPermutationSelect: () => {},
});
export type TActions =
  | { type: 'SET_DATA'; payload: IBacktestState }
  | { type: 'SET_PLOT'; payload: IPlot[] };

const BacktestReducer = (state: IBacktestState, action: TActions): IBacktestState => {
  switch (action.type) {
    case 'SET_DATA':
      return {
        ...state,
        ...action.payload,
      };
    case 'SET_PLOT':
      return {
        ...state,
        plot: action.payload,
      };
  }
};
export const BacktestDataProvider = ({ children }: PropsWithChildren) => {
  const {
    data: { permutations, initialCapital, topics, startTime, endTime },
  } = useFileData();
  const [state, dispatch] = useReducer(BacktestReducer, {} as IBacktestState);
  const [permutationId, setPermutationId] = useState<string>(permutations.keys().next().value);
  const workerMessage = useMemo(
    () => ({
      topics,
      initialCapital,
      permutation: [...permutations.entries()]
        .filter(([key, value]) => key === permutationId)
        .flat(),
      startTime,
      endTime,
    }),
    [permutationId],
  );
  usePlotWorker(topics, permutations, {
    onProcessSuccess: (data) => {
      dispatch({ type: 'SET_PLOT', payload: data });
    },
  });
  const { processing } = useBacktestWorker(workerMessage, {
    onProcessSuccess: (data) => {
      let backtests = new Map<string, IBacktest>(JSON.parse(data.result));

      dispatch({
        type: 'SET_DATA',
        payload: {
          topics,
          initialCapital,
          permutationId,
          backtests,
          startTime: startTime,
          endTime: endTime,
        },
      });
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
      <BacktestDataContext.Provider value={{ ...state, processing }}>
        {children}
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
