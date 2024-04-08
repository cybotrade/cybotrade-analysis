'use client';

import { useMemo } from 'react';

import { CybotradeLogo, NotificationIcon, SettingsIcon } from '@app/_assets/icons';
import { OptionSelect } from '@app/_components/dashboard/left/OptionSelect';
import { PermutationSelect } from '@app/_components/dashboard/left/PermutationSelect';
import { Text } from '@app/_components/shared/Text';
import { useBacktestAPI, useBacktestData } from '@app/_providers/backtest';
import { useFileData } from '@app/_providers/file';

export const DashboardHeader = () => {
  const { data } = useFileData();
  const { backtests } = useBacktestData();
  const { onPermutationSelect } = useBacktestAPI();
  const permutationOptions = useMemo(
    () =>
      Array.from(backtests.keys()).map((key) => ({
        label: key,
        value: key,
      })),
    [],
  );

  if (permutationOptions.length === 0) throw new Error('No Permutation');
  return (
    <div className="font-sora flex w-full h-16 min-h-16 relative gap-2">
      <div className="relative rounded-xl w-full h-full bg-[#FFFFFF] border border-[#E1D9D6] p-4 flex justify-between items-center">
        <CybotradeLogo className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <div className="flex items-center gap-5 z-10">
          <Text content={data?.file.name || ''} className="text-md underline font-bold" />
          <PermutationSelect options={permutationOptions} onOptionSelected={onPermutationSelect} />
        </div>
        <div className="flex justify-end items-center gap-5 z-10">
          <SettingsIcon className="w-5 h-auto text-[#7B7878] cursor-pointer" />
          <NotificationIcon className="w-5 h-auto text-[#7B7878] cursor-pointer" />
        </div>
      </div>
    </div>
  );
};
