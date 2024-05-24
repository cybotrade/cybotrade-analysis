import { filesize } from 'filesize';

import { Attachment } from '@app/_assets/icons';
import { Button } from '@app/_ui/Button';

type TFilePostUpload = {
  file: File;
  onAnalysis: () => void;
};

const FilePostUpload = ({ file, onAnalysis }: TFilePostUpload) => {
  return (
    <div className="border border-primary min-h-full rounded-md flex flex-col justify-center items-center p-7 bg-[#FFEFDC] dark:bg-[#73501A] gap-4">
      <div className="flex items-center gap-3">
        <Attachment />
        <div>
          <p className="text-xl">{file?.name}</p>
          <p className="text-xs text-brand-gray">{filesize(file.size)} kb</p>
        </div>
      </div>
      <Button size="xl" onClick={onAnalysis}>
        Start Analysis
      </Button>
    </div>
  );
};

export default FilePostUpload;
