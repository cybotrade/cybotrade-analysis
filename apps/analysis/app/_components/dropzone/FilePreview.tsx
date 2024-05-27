import { filesize } from 'filesize';

import { Attachment } from '@app/_assets/icons';
import { Button } from '@app/_ui/Button';

type TFilePreviewProps = {
  file: File;
  onShowResult: () => void;
};

const FilePreview = ({ file, onShowResult }: TFilePreviewProps) => {
  return (
    <div className="border border-primary min-h-full rounded-md flex flex-col justify-center items-center px-7 bg-[#FFEFDC] dark:bg-[#73501A] gap-4">
      <div className="flex items-center gap-3">
        <Attachment />
        <div>
          <p className="text-xl">{file?.name}</p>
          <p className="text-xs text-brand-gray">{filesize(file?.size)}</p>
        </div>
      </div>
      <Button onClick={onShowResult} className="w-full">
        Show Result
      </Button>
      <Button
        onClick={() => {
          window.location.href = '/';
        }}
        variant={'outline'}
        className="w-full"
      >
        Upload New File
      </Button>
    </div>
  );
};

export default FilePreview;
