import { FileRejection } from 'react-dropzone';

import { CrossSolid } from '@app/_assets/icons';

type TFileError = {
  fileRejected: FileRejection;
  errorMessage: string;
  reset: () => void;
};

const FileError = ({ fileRejected, errorMessage, reset }: TFileError) => {
  return (
    <div className="border border-primary min-h-full rounded-md flex flex-col justify-end p-7 bg-gradient-to-r from-[#FFEFDC] to-white dark:bg-gradient-to-r dark:from-[#2E1C05] dark:to-[#73501A] gap-2">
      <p className="text-xl break-words">{fileRejected?.file.name}</p>
      <div className="flex justify-between">
        {errorMessage.startsWith('Error') ? (
          <p className="text-xs text-red-400 py-1 px-4 rounded-full border border-red-400 bg-white flex items-center">
            {errorMessage}
          </p>
        ) : (
          <p className="text-xs text-red-400 py-1 px-4 rounded-full border border-red-400 bg-white flex items-center">
            Error: {errorMessage}
          </p>
        )}
        <CrossSolid className="hover:opacity-70 cursor-pointer" onClick={reset} />
      </div>
    </div>
  );
};

export default FileError;
