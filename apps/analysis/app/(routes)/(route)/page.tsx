'use client';

import { filesize } from 'filesize';
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import Dropzone, { DropEvent, ErrorCode, FileRejection } from 'react-dropzone';

import { Attachment } from '@app/_assets/icons';
import FileViewier from '@app/_components/dropzone/FileViewier';
import Header from '@app/_components/header';
import { useFileAPI, useFileData } from '@app/_providers/file';
import { convertBytes } from '@app/_utils/helper';

const FloatCard = ({ text, className }: { text: string; className: string }) => (
  <div
    className={`py-5 px-10 w-[200px] border flex justify-center items-center text-clip text-center overflow-wrap-break-word bg-white/40 rounded-lg ${className}`}
  >
    {text}
  </div>
);
const HomePage = () => {
  const { mode } = useFileData();

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
      multiple={false}
      maxSize={convertBytes(5000)}
      accept={{ 'application/json': ['.json'] }}
      onDropAccepted={handleDropAccepted}
      onDropRejected={handleDropRejected}
      disabled={mode !== 'PRE_UPLOAD'}
    >
      {(props) => (
        <div {...props.getRootProps({ className: 'dropzone w-full h-full' })}>
          {props.isDragActive &&
            createPortal(
              <div className="fixed inset-0 bg-[#714614]/60 backdrop-blur-lg z-50 pointer-events-none flex flex-col justify-center items-center select-none">
                <Attachment className="w-40 h-40" />
                <p className="text-white text-2xl mt-4">Drop it for analysis backtest.</p>
              </div>,
              document.body,
            )}
          <Header />
          <div className="bg-gradient-to-b from-[#FFEFDC] to-white dark:bg-gradient-to-b dark:from-[#2E1C05] dark:to-[#73501A] text-black dark:text-white rounded-lg border border-primary-light flex flex-col justify-center items-center gap-6 relative p-8">
            <div className="max-w-lg text-center z-10 flex flex-col gap-5">
              <p className="text-6xl font-semibold">Drop your json file to start</p>
              <p className="text-xl">
                Your most comprehensive and professional backtest reporting system
              </p>
            </div>

            <FileViewier
              props={props}
              onModeChange={onModeChange}
              error={errorMessage}
              onError={(error) => setErrorMessage(error)}
            />
            {/* Background element */}
            <div className="pointer-events-none rounded-full h-[815px] min-w-[815px] border border-primary-light2 absolute top-[-235px] left-[-216px]"></div>
            <div className="pointer-events-none rounded-full h-[815px] min-w-[815px] border border-primary-light2 absolute bottom-[-336px] right-[-175px]"></div>
            <FloatCard
              text="Comparing results"
              className="text-[#ADF79A] border-[#ADF79A] absolute top-[40%] left-[7%]"
            />
            <FloatCard
              text="Save your backtests"
              className="text-[#9ADBF7] border-[#9ADBF7] absolute top-[10%] right-[15%]"
            />
            <FloatCard
              text="Find optimal results"
              className="text-[#F79A9A] border-[#F79A9A] absolute bottom-[15%] right-[7%]"
            />
          </div>
        </div>
      )}
    </Dropzone>
  );
};

export default HomePage;
