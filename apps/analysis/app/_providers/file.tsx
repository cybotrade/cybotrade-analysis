'use client';

import { PropsWithChildren, createContext, useContext, useMemo, useReducer } from 'react';

import { useNewKline } from '@app/_hooks/useNewKline';
import { replaceEmptyKeys } from '@app/_lib/utils';

export interface ITopic {
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
    trades: Record<string, string>;
    start_time: number;
    end_time: number;
    version: string;
  };
}

export interface IFileDataState {
  data: {
    file: File;
    topics: ITopic[];
    permutations: Map<string, string>;
    initialCapital: number;
    startTime: number;
    endTime: number;
  };
  fetchedPercentage: number;
  error: string;
  mode: 'PRE_UPLOAD' | 'UPLOADING' | 'POST_UPLOAD' | 'ANALYSING' | 'DONE_ANALYSING' | 'ERROR';
}

interface IFileAPI {
  onFileChange: (file: File, content: Object) => void;
  onModeChange: (mode: IFileDataState['mode']) => void;
}

export type TActions =
  | { type: 'SET_MODE'; payload: IFileDataState['mode'] }
  | {
      type: 'ADD_FILE';
      payload: {
        data: IFileContent;
      };
    };

const FileDataContext = createContext<IFileDataState | null>(null);
const FileAPIContext = createContext<IFileAPI>({
  onFileChange: () => {},
  onModeChange: () => {},
});
const FileReducer = (state: IFileDataState, action: TActions): IFileDataState => {
  switch (action.type) {
    case 'SET_MODE':
      return {
        ...state,
        mode: action.payload,
      };
    case 'ADD_FILE':
      const { file, content } = action.payload.data;
      const splitedStrings = content.candle_topics.map((t) => t.split('|'));
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

      return {
        ...state,
        data: {
          ...state.data,
          file,
          topics,
          initialCapital: content.initial_capital,
          permutations: new Map(replaceEmptyKeys(content.trades, 'default=0,default=0')),
          startTime: content.start_time,
          endTime: content.end_time,
        },
      };
  }
};
export const FileDataProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(FileReducer, {
    fetchedPercentage: 0,
    mode: 'PRE_UPLOAD',
  } as IFileDataState);

  const api = useMemo(() => {
    const onFileChange = (file: File, content: Object) => {
      dispatch({
        type: 'ADD_FILE',
        payload: {
          data: {
            file,
            content: content as IFileContent['content'],
          },
        },
      });
    };

    const onModeChange = (mode: IFileDataState['mode']) => {
      dispatch({
        type: 'SET_MODE',
        payload: mode,
      });
    };

    return { onFileChange, onModeChange };
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
