'use client';

import { filesize } from 'filesize';
import { useRouter } from 'next/navigation';
import { PropsWithChildren, ReactNode, isValidElement, useEffect, useState } from 'react';
import Dropzone, { DropEvent, ErrorCode, FileRejection } from 'react-dropzone';

import FileError from '@app/_components/dropzone/FileError';
import FilePostUpload from '@app/_components/dropzone/FilePostUpload';
import FilePreUpload from '@app/_components/dropzone/FilePreUpload';
import FilePreview from '@app/_components/dropzone/FilePreview';
import FileProgress from '@app/_components/dropzone/FileProgress';
import KlineProgress from '@app/_components/dropzone/KlineProgress';
import WorkersProgress from '@app/_components/dropzone/WorkersProgress';
import { cn } from '@app/_lib/utils';
import { IFileDataState, useFileAPI, useFileData } from '@app/_providers/file';
import { convertBytes } from '@app/_utils/helper';

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

const FileDropzone = () => {
  const router = useRouter();
  const { mode, data } = useFileData();
  const { onModeChange, onFileChange } = useFileAPI();
  const [errorMessage, setErrorMessage] = useState('Failed');

  const handleDropAccepted = (files: File[], event: DropEvent) => {
    try {
      onModeChange('UPLOADING');

      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        try {
          const content = e.target?.result;
          const jsonObject = JSON.parse(content as string);
          onFileChange(files[0], jsonObject);
        } catch (jsonParseError) {
          onModeChange('ERROR');
          setErrorMessage('Error parsing JSON');
        }
      };
      fileReader.onerror = (error) => {
        throw error;
      };
      fileReader.readAsText(files[0]);
    } catch (error) {
      onModeChange('ERROR');
      setErrorMessage('fail reading the file');
    }
  };

  const handleDropRejected = (filesRejected: FileRejection[]) => {
    if (filesRejected.length === 0) return;
    const { file, errors } = filesRejected[0];
    if (errors[0].code === ErrorCode.FileInvalidType) {
      setErrorMessage('please upload the supported file type');
    }
    if (errors[0].code === ErrorCode.FileTooLarge) {
      setErrorMessage(`file is too big (max ${filesize(convertBytes(5000))}GB)`);
    }
    onModeChange('ERROR');
  };

  return (
    <Dropzone
      noClick
      noKeyboard
      noDragEventsBubbling
      multiple={false}
      maxSize={convertBytes(5000)}
      accept={{ 'application/json': ['.json'] }}
      onDropAccepted={handleDropAccepted}
      onDropRejected={handleDropRejected}
    >
      {(props) => (
        <div
          className={cn(
            'relative h-64 w-[500px] bg-white rounded-md p-4 shadow-lg',
            props.isDragActive ? 'opacity-70' : 'opacity-100',
          )}
        >
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
                  setErrorMessage(error);
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
                errorMessage={errorMessage}
                reset={() => onModeChange('PRE_UPLOAD')}
              />
            </Case>
          </Switch>
        </div>
      )}
    </Dropzone>
  );
};

export default FileDropzone;
