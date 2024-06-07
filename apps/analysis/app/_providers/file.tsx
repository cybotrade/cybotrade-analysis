'use client';

import { UniqueIdentifier } from '@dnd-kit/core';
import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';

import { replaceEmptyKeys } from '@app/_lib/utils';
import { createRange } from '@app/_utils/helper';

export interface ITopic {
  category: string;
  exchange: string;
  interval: string;
  symbol: string;
  type: string;
}

export type TCell = {
  id: UniqueIdentifier;
  children: {
    type: UniqueIdentifier;
  } | null;
};

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
  } | null;
  mode:
    | 'PRE_UPLOAD'
    | 'UPLOADING'
    | 'POST_UPLOAD'
    | 'ANALYSING'
    | 'PROCESSING'
    | 'DONE_ANALYSING'
    | 'ERROR';
  widgets: Record<string, TCell[]>;
}

interface IFileAPI {
  onFileChange: (file: File, content: Object) => void;
  onModeChange: (mode: IFileDataState['mode']) => void;
  onWidgetsChange: (widgets: Record<string, TCell[]>) => void;
}

export type TActions =
  | { type: 'SET_MODE'; payload: IFileDataState['mode'] }
  | {
      type: 'ADD_FILE';
      payload: {
        data: IFileContent;
      };
    }
  | {
      type: 'SET_WIDGETS';
      payload: IFileDataState['widgets'];
    };

const FileDataContext = createContext<IFileDataState | null>(null);
const FileAPIContext = createContext<IFileAPI>({
  onFileChange: () => {},
  onModeChange: () => {},
  onWidgetsChange: () => {},
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
    case 'SET_WIDGETS':
      return {
        ...state,
        widgets: action.payload,
      };
  }
};
const defaultWidgets = [
  'win-rate',
  'best-trade',
  'largest-roi',
  'max-drawdown',
  'average-trades-per-day',
];
export const FileDataProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(FileReducer, {
    data: null,
    mode: 'PRE_UPLOAD',
    widgets: {
      A: createRange(6, (index) => ({
        id: `A${index + 1}`,
        children: defaultWidgets[index] ? { type: defaultWidgets[index] } : null,
      })),
    },
  } as IFileDataState);

  useEffect(() => {
    const storedWidgets = localStorage.getItem('widgets');

    if (storedWidgets) {
      dispatch({
        type: 'SET_WIDGETS',
        payload: JSON.parse(storedWidgets),
      });
    }
  }, []);

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

    const onWidgetsChange = (widgets: Record<string, TCell[]>) => {
      localStorage.setItem('widgets', JSON.stringify(widgets));

      dispatch({
        type: 'SET_WIDGETS',
        payload: widgets,
      });
    };

    return { onFileChange, onModeChange, onWidgetsChange };
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
