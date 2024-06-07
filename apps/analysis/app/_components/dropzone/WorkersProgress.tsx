import { useEffect } from 'react';

import ProgressBar from '@app/_components/progress-bar';
import { useBacktestAPI, useBacktestData } from '@app/_providers/backtest';
import { IFileDataState } from '@app/_providers/file';

type TWorkersProgressProps = {
  fileData: IFileDataState['data'];
  onProgressComplete: () => void;
};

const WorkersProgress = ({ fileData, onProgressComplete }: TWorkersProgressProps) => {
  const { progress } = useBacktestData();
  const { onPermutationSelect, computeAllPermutations } = useBacktestAPI();
  useEffect(() => {
    if (!fileData) throw new Error('No File Data');

    computeAllPermutations();
    onPermutationSelect(fileData.permutations.keys().next().value);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      onProgressComplete();
    }
  }, [progress]);
  return (
    <div className="border border-primary min-h-full rounded-md flex flex-col justify-end p-7 bg-gradient-to-r from-[#FFEFDC] to-white dark:bg-gradient-to-r dark:from-[#2E1C05] dark:to-[#73501A] gap-2">
      <p className="text-xl max-w-[190px]">Please do not close the window</p>
      <div className="text-xs text-brand-gray">
        Calculating {progress}%{/* | Second remaining */}
      </div>
      <ProgressBar percent={`${progress}%`} />
    </div>
  );
};

export default WorkersProgress;
