'use client';

import { useState } from 'react';

import { cn } from '@app/_lib/utils';
import { useBacktestAPI, useBacktestData } from '@app/_providers/backtest';

export const ToggleSwitch = () => {
  const { mode } = useBacktestData();
  const { onArithmeticToggle } = useBacktestAPI();

  return (
    <div className={cn('font-sora relative w-60 h-10 min-h-min rounded-full', 'md:w-52 2xl:w-60')}>
      <input
        type="checkbox"
        defaultChecked={mode === 'GEOMETRIC'}
        className={cn('relative w-full h-full p-0 m-0 opacity-0 z-[3] cursor-pointer', 'peer')}
        onClick={(e) => onArithmeticToggle(!e.currentTarget.defaultChecked)}
      />
      <div
        className={cn(
          'absolute inset-0 z-[2]',
          'before:absolute before:top-0 before:w-1/2 before:h-full before:text-sm before:text-center before:rounded-full before:transition-all before:duration-300 before:ease-in-out',
          'after:absolute after:top-0 after:w-1/2 after:h-full after:text-sm after:text-center after:rounded-full after:transition-all after:duration-300 after:ease-in-out',
          `before:content-[""] before:left-0 before:bg-primary`,
          `after:flex after:justify-center after:items-center after:content-["Geometric"] after:right-0`,
          'before:peer-checked:left-1/2',
          'md:text-xs 2xl:text-sm',
        )}
      >
        <span
          className={cn(
            'absolute top-0 w-1/2 h-full text-sm text-center rounded-full transition-all duration-300 ease-in-out',
            'flex justify-center items-center left-0 z-[1]',
            'md:text-xs 2xl:text-sm',
          )}
        >
          Arithmetic
        </span>
      </div>
      <div className={cn(`absolute inset-0 w-full bg-[#F0F0F0] z-[1] rounded-full`)}></div>
    </div>
  );
};
