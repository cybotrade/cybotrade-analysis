import { useState } from 'react';

import ProgressBar from '@app/_components/progress-bar';
import { useNewKline } from '@app/_hooks/useNewKline';
import { IFileDataState } from '@app/_providers/file';

type TKlineProgressProps = {
  fileData: IFileDataState['data'];
  onFetchComplete: () => void;
  onFetchFailed: (error: string) => void;
};

const KlineProgress = ({ fileData, onFetchComplete, onFetchFailed }: TKlineProgressProps) => {
  const [fetchProgress, setFetchProgress] = useState(0);
  useNewKline(fileData, {
    onFetchingKline: (progress) => {
      setFetchProgress(progress);
    },
    onFetchComplete,
    onFetchFailed,
  });
  return (
    <div className="border border-primary min-h-full rounded-md flex flex-col justify-end p-7 bg-gradient-to-r from-[#FFEFDC] to-white dark:bg-gradient-to-r dark:from-[#2E1C05] dark:to-[#73501A] gap-2">
      <p className="text-xl max-w-[190px]">Please do not close the window</p>
      <div className="text-xs text-brand-gray">
        Fetching kline {fetchProgress}%{/* | Second remaining */}
      </div>
      <ProgressBar percent={`${fetchProgress}%`} />
    </div>
  );
};

export default KlineProgress;
