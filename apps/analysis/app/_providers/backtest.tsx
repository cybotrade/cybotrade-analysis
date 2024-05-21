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
import { usePermutationsWorker } from '@app/_hooks/usePermutationsWorker';
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

export interface IBacktestState {
  processing: boolean;
  topics: ITopic[];
  initialCapital: number;
  permutations: Map<string, Map<string, IBacktest>> | null;
  selectedBacktest: {
    id: string;
    data: Map<string, IBacktest>;
  };
  startTime: number;
  endTime: number;
  mode: 'ARITHMETIC' | 'GEOMETRIC';
}

interface IBacktestAPI {
  onPermutationSelect: (id: string) => void;
  onArithmeticToggle: (isToggle: boolean) => void;
}

const BacktestDataContext = createContext<IBacktestState | null>(null);
const BacktestAPIContext = createContext<IBacktestAPI>({
  onPermutationSelect: () => {},
  onArithmeticToggle: () => {},
});
export type TActions =
  | {
      type: 'SET_DATA';
      payload: Omit<IBacktestState, 'selectedBacktest' | 'processing' | 'mode'>;
    }
  | {
      type: 'SET_BACKTEST';
      payload: Pick<IBacktestState, 'selectedBacktest'>;
    }
  | {
      type: 'SET_MODE';
      payload: IBacktestState['mode'];
    };

const BacktestReducer = (state: IBacktestState, action: TActions): IBacktestState => {
  switch (action.type) {
    case 'SET_DATA':
      return {
        ...state,
        ...action.payload,
      };
    case 'SET_BACKTEST':
      return {
        ...state,
        ...action.payload,
      };
    case 'SET_MODE':
      return {
        ...state,
        mode: action.payload,
      };
  }
};

export const BacktestDataProvider = ({ children }: PropsWithChildren) => {
  const { data: fileData } = useFileData();
  const [state, dispatch] = useReducer(BacktestReducer, { mode: 'ARITHMETIC' } as IBacktestState);
  const [permutationId, setPermutationId] = useState(fileData.permutations.keys().next().value);

  const { processing } = useBacktestWorker(
    permutationId,
    fileData,
    state.permutations?.get(permutationId),
    {
      onProcessSuccess: ({ id, backtest }) => {
        dispatch({
          type: 'SET_BACKTEST',
          payload: {
            selectedBacktest: {
              id,
              data: backtest,
            },
          },
        });
      },
    },
  );

  usePermutationsWorker(fileData, {
    onProcessSuccess: (data) => {
      const permutations = new Map<string, Map<string, IBacktest>>(JSON.parse(data.result));

      permutations.forEach((value, id) => {
        permutations.set(id, new Map(value));
      });

      dispatch({
        type: 'SET_DATA',
        payload: {
          ...fileData,
          permutations,
        },
      });
    },
  });
  const api = useMemo(() => {
    const onPermutationSelect = (id: string) => {
      setPermutationId(id);
    };

    const onArithmeticToggle = (isTgggle: boolean) => {
      dispatch({
        type: 'SET_MODE',
        payload: isTgggle ? 'GEOMETRIC' : 'ARITHMETIC',
      });
    };

    return { onPermutationSelect, onArithmeticToggle };
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
