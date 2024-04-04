'use client';

import { PropsWithChildren, createContext, useContext, useReducer } from 'react';

import { IClosedTrade, ITrade } from '@app/(routes)/(route)/type';
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
  trades: Map<string, ITrade[]>;
  closedTrades: Map<string, IClosedTrade[]>;
  performance: Map<string, PerformanceData>;
}

export interface IBacktestState {
  topics: ITopic[];
  initialCapital: number;
  backtests: Map<string, IBacktest>;
  startTime: number;
  endTime: number;
}

const BacktestDataContext = createContext<IBacktestState | null>(null);
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
  const { processing } = useBacktestWorker(fileData, dispatch);
  return (
    <BacktestDataContext.Provider value={state}>
      {processing ? (
        <div className="flex justify-center items-center h-full">
          <Loading description="Loading ..." />
        </div>
      ) : (
        children
      )}
    </BacktestDataContext.Provider>
  );
};

export const useBacktestData = () => {
  const context = useContext(BacktestDataContext);
  if (!context) {
    throw new Error('useBacktestData must be used inside the BacktestDataProvider');
  }
  return context;
};
