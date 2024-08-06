'use client';

import { useRouter } from 'next/navigation';
import { PropsWithChildren, ReactNode, isValidElement } from 'react';
import { DropzoneState } from 'react-dropzone';

import FileError from '@app/_components/dropzone/FileError';
import FilePostUpload from '@app/_components/dropzone/FilePostUpload';
import FilePreUpload from '@app/_components/dropzone/FilePreUpload';
import FilePreview from '@app/_components/dropzone/FilePreview';
import FileProgress from '@app/_components/dropzone/FileProgress';
import KlineProgress from '@app/_components/dropzone/KlineProgress';
import WorkersProgress from '@app/_components/dropzone/WorkersProgress';
import { cn } from '@app/_lib/utils';
import { IFileDataState, useFileData } from '@app/_providers/file';

type TSwitchProps = {
  mode: IFileDataState['mode'];
  children: ReactNode[];
};

const Switch = ({ mode, children }: TSwitchProps) => {
  const result = children.find((child) => isValidElement(child) && child.props.value === mode);

  return <>{result}</>;
};
const Case = ({ children }: PropsWithChildren<{ value: IFileDataState['mode'] }>) => (
  <>{children}</>
);

type TFileViewierProps = {
  props: DropzoneState;
  onModeChange: (mode: IFileDataState['mode']) => void;
  error: string;
  onError: (error: string) => void;
};

const FileViewier = ({ props, onModeChange, error, onError }: TFileViewierProps) => {
  const router = useRouter();
  const { mode, data } = useFileData();

  return (
    <div className={cn('relative h-64 w-[500px] bg-white rounded-md p-4 shadow-lg')}>
      <Switch mode={mode}>
        <Case value="PRE_UPLOAD">
          <FilePreUpload {...props} />
        </Case>
        <Case value="UPLOADING">
          {data && (
            <FileProgress
              file={data?.file}
              onProgressComplete={() => onModeChange('POST_UPLOAD')}
            />
          )}
        </Case>
        <Case value="POST_UPLOAD">
          {data && (
            <FilePostUpload file={data?.file} onAnalysis={() => onModeChange('ANALYSING')} />
          )}
        </Case>
        <Case value="ANALYSING">
          <KlineProgress
            fileData={data}
            onFetchComplete={() => setTimeout(() => onModeChange('PROCESSING'), 1000)}
            onFetchFailed={(error) => {
              onError(error);
              onModeChange('ERROR');
            }}
          />
        </Case>
        <Case value="PROCESSING">
          <WorkersProgress
            fileData={data}
            onProgressComplete={() =>
              setTimeout(() => {
                onModeChange('DONE_ANALYSING');
                router.push('/overview/result-breakdown');
              }, 1000)
            }
          />
        </Case>
        <Case value="DONE_ANALYSING">
          {data && <FilePreview file={data?.file} onShowResult={() => router.forward()} />}{' '}
        </Case>
        <Case value="ERROR">
          <FileError
            fileRejected={props.fileRejections[0]}
            errorMessage={error}
            reset={() => onModeChange('PRE_UPLOAD')}
          />
        </Case>
      </Switch>
    </div>
  );
};

export default FileViewier;
