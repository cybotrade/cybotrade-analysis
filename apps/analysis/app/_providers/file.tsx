'use client';

import { useRouter } from 'next/navigation';
import { PropsWithChildren, createContext, useContext, useMemo, useReducer } from 'react';

import { useKlineInfiniteQuery } from '@app/_hooks/useKlineInfiniteQuery';
import { useNewKline } from '@app/_hooks/useNewKline';
import { Interval } from '@app/_lib/utils';

interface ITopic {
  category: string;
  exchange: string;
  interval: string;
  symbol: string;
  type: string;
}

export interface IFileContent {
  file: File;
  content: {
    candle_topics: string[];
    initial_capital: number;
    trades: {
      [permutations: string]: string;
    };
    start_time: number;
    end_time: number;
    version: string;
  };
}

interface IFileDataState {
  data: IFileContent | null;
  topics: ITopic[];
  fetchedPercentage: number;
  error: string;
}

interface IFileAPI {
  onFileChange: (file: File, content: Object) => void;
}

export type TActions =
  | { type: 'ADD_FILE'; payload: { data: IFileContent; topics: ITopic[] } }
  | { type: 'FETCHING_KLINE'; payload: number }
  | { type: 'FETCH_FAILED'; payload: string };

const FileDataContext = createContext<IFileDataState | null>(null);
const FileAPIContext = createContext<IFileAPI>({
  onFileChange: () => {},
});
const FileReducer = (state: IFileDataState, action: TActions): IFileDataState => {
  switch (action.type) {
    case 'ADD_FILE':
      return {
        ...state,
        data: action.payload.data,
        topics: action.payload.topics,
      };
    case 'FETCHING_KLINE':
      return {
        ...state,
        fetchedPercentage: action.payload,
      };
    case 'FETCH_FAILED':
      return {
        ...state,
        data: null,
        error: action.payload,
      };
  }
};
export const FileDataProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(FileReducer, { fetchedPercentage: 0 } as IFileDataState);
  const { setParams } = useNewKline(dispatch);

  const transformedTopics = (candle_topics: string[]) => {
    const splitedStrings = candle_topics.map((t) => t.split('|'));
    const topics: ITopic[] = splitedStrings.map((topic) => {
      const [category, interval, symbol, exchange] = topic[0].split('-');
      const newSymbol = symbol.split('/').join('');
      const type = topic[1];
      return {
        category,
        interval,
        symbol: newSymbol,
        type,
        exchange,
      };
    });
    return topics;
  };
  const api = useMemo(() => {
    const onFileChange = (file: File, content: Object) => {
      const { candle_topics, start_time, end_time } = content as IFileContent['content'];
      const topics = transformedTopics(candle_topics);
      dispatch({
        type: 'ADD_FILE',
        payload: {
          data: { file, content: content as IFileContent['content'] },
          topics,
        },
      });
      setParams({
        interval: topics[0].interval as Interval,
        symbol: topics[0].symbol,
        startTime: start_time,
        endTime: end_time,
      });
    };

    return { onFileChange };
  }, []);
  return (
    <FileAPIContext.Provider value={api}>
      <FileDataContext.Provider value={state}>{children}</FileDataContext.Provider>
    </FileAPIContext.Provider>
  );
};

export const useFileData = () => {
  const context = useContext(FileDataContext);

  if (!context) {
    throw new Error('useFileData must be used inside the FileDataProvider');
  }

  return context;
};
export const useFileAPI = () => {
  const context = useContext(FileAPIContext);

  if (!context) {
    throw new Error('useFileAPI must be used inside the FileDataProvider');
  }

  return context;
};
