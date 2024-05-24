import { useEffect, useState } from 'react';

import ProgressBar from '@app/_components/progress-bar';

type TFileProgressProps = {
  file: File;
  onProgressComplete: () => void;
};

const FileProgress = ({ file, onProgressComplete }: TFileProgressProps) => {
  const [progress, setPrgress] = useState(0);

  useEffect(() => {
    if (progress === 100) {
      onProgressComplete();
    }
    setTimeout(() => {
      setPrgress((prev) => prev + 1);
    }, 10);
  }, [progress]);

  return (
    <div className="border border-primary min-h-full rounded-md flex flex-col justify-end p-7 bg-gradient-to-r from-[#FFEFDC] to-white dark:bg-gradient-to-r dark:from-[#2E1C05] dark:to-[#73501A] gap-2">
      <p>
        Uploading <span>{file?.name}</span>
      </p>
      <div className="text-xs text-brand-gray">{progress}% | Second remaining</div>
      <ProgressBar percent={`${progress}%`} />
    </div>
  );
};

export default FileProgress;
