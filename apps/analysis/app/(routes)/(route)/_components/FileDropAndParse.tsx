'use client';

import { useRouter } from 'next/navigation';
import { DragEvent, useEffect, useReducer, useState } from 'react';

import { Attachment, CrossSolid, Upload } from '@app/_assets/icons';
import ProgressBar from '@app/_components/progressBar';
import { Button } from '@app/_ui/Button';

interface State {
  inDropZone: boolean;
  fileList: File[];
}

interface SetInDropZoneAction {
  type: 'SET_IN_DROP_ZONE';
  inDropZone: boolean;
}

interface AddFileToListAction {
  type: 'ADD_FILE_TO_LIST';
  file: File;
}

interface ResetAction {
  type: 'RESET';
}

type Action = SetInDropZoneAction | AddFileToListAction | ResetAction;

interface FileDropZoneProps {
  className?: string;
  onChange: (file: File, result: object) => void;
  onShowResult: () => void;
}

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'SET_IN_DROP_ZONE':
      return { ...state, inDropZone: action.inDropZone };
    case 'ADD_FILE_TO_LIST':
      return {
        ...state,
        fileList: state.fileList.concat(action.file),
      };
    case 'RESET':
      return { inDropZone: false, fileList: [] };
    default:
      return state;
  }
};

const FileDropAndParse: React.FC<FileDropZoneProps> = ({ className, onChange, onShowResult }) => {
  const router = useRouter();
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [analysingPercentage, setAnalysingPercentage] = useState(0);
  const [errorMessage, setErrorMessage] = useState('Failed');
  const [mode, setMode] = useState<
    'PRE_UPLOAD' | 'UPLOADING' | 'POST_UPLOAD' | 'ANALYSING' | 'DONE_ANALYSING' | 'ERROR'
  >('PRE_UPLOAD');
  const [file, setFile] = useState<File>();
  const [data, dispatch] = useReducer(reducer, {
    inDropZone: false,
    fileList: [],
  });

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch({ type: 'SET_IN_DROP_ZONE', inDropZone: true });
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch({ type: 'SET_IN_DROP_ZONE', inDropZone: false });
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
    dispatch({ type: 'SET_IN_DROP_ZONE', inDropZone: true });
  };

  const handleUpload = (file: File) => {
    const maxFileSize = 5000000000; // 5GB
    const fileTypes = ['application/json', 'text/plain'];
    const existingFiles = data.fileList.map((f) => f.name);
    if (file && !existingFiles.includes(file.name)) {
      if (!fileTypes.includes(file.type)) {
        const errorMessage = 'please upload the supported file type';
        setMode('ERROR');
        setErrorMessage(errorMessage);
        // return toast.error(errorMessage);
        return;
      }
      if (file.size > maxFileSize) {
        const errorMessage = `file is too big (max ${maxFileSize / 1000000000}GB)`;
        setMode('ERROR');
        setErrorMessage(errorMessage);
        return;
        // return toast.error(errorMessage);
      }
      setMode('UPLOADING');
      dispatch({ type: 'ADD_FILE_TO_LIST', file });
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files[0];
    setFile(droppedFile);
    handleUpload(droppedFile as File);
    dispatch({ type: 'SET_IN_DROP_ZONE', inDropZone: false });
  };
  const handleBrowse = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    let browsedFile;
    if (files && files?.length > 0) {
      setFile(files[0]);
      browsedFile = files[0];
      handleUpload(browsedFile as File);
    }
    dispatch({ type: 'SET_IN_DROP_ZONE', inDropZone: false });
  };

  const handleAnalysis = async () => {
    setMode('ANALYSING');
    if (file) {
      try {
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
          const content = e.target?.result;
          const jsonObject = JSON.parse(content as string);
          onChange(file, jsonObject);
        };
        fileReader.onerror = (error) => {
          throw error;
        };
        fileReader.readAsText(file);
      } catch (error) {
        console.error('Error reading the file:', error);
        setMode('ERROR');
        setErrorMessage('fail reading the file');
      }
    }
  };

  // to remove, just a simulation
  useEffect(() => {
    if (mode === 'UPLOADING' && uploadPercentage < 100) {
      setTimeout(() => {
        setUploadPercentage((prev) => prev + 1);
      }, 20);
    }
    if (mode === 'UPLOADING' && uploadPercentage === 100) {
      setMode('POST_UPLOAD');
    }
  }, [mode, uploadPercentage]);
  useEffect(() => {
    if (mode === 'ANALYSING' && analysingPercentage < 100) {
      setTimeout(() => {
        setAnalysingPercentage((prev) => prev + 1);
      }, 20);
    }
    if (mode === 'ANALYSING' && analysingPercentage === 100) {
      setMode('DONE_ANALYSING');
    }
  }, [mode, analysingPercentage]);
  // end remove

  const reset = () => {
    setMode('PRE_UPLOAD');
    dispatch({ type: 'RESET' });
    setErrorMessage('');
    setUploadPercentage(0);
    setAnalysingPercentage(0);
  };

  const renderContent = () => {
    switch (mode) {
      case 'PRE_UPLOAD':
        return (
          <div
            className="border border-primary border-dashed min-h-full flex justify-center items-center flex-col gap-4 p-7 rounded-md"
            onDragEnter={(e) => handleDragEnter(e)}
            onDragOver={(e) => handleDragOver(e)}
            onDragLeave={(e) => handleDragLeave(e)}
            onDrop={(e) => handleDrop(e)}
          >
            <Upload />
            <div className="flex flex-col text-center gap-1 ">
              <p className="text-lg text-black">
                Drop your files here or{' '}
                <label
                  htmlFor="fileSelect"
                  className="text-primary underline cursor-pointer duration-200 hover:text-primary-light"
                >
                  browse
                </label>
                <input
                  id="fileSelect"
                  type="file"
                  multiple={false}
                  onChange={handleBrowse}
                  className="hidden"
                />
              </p>
              <p className="text-xs text-brand-gray">Max. File Size 5GB</p>
            </div>
          </div>
        );
      case 'UPLOADING':
        return (
          <div className="border border-primary min-h-full rounded-md flex flex-col justify-end p-7 bg-gradient-to-r from-[#FFEFDC] to-white dark:bg-gradient-to-r dark:from-[#2E1C05] dark:to-[#73501A] gap-2">
            <p>
              Uploading <span>{file?.name}</span>
            </p>
            <div className="text-xs text-brand-gray">{uploadPercentage}% | Second remaining</div>
            <ProgressBar percent={`${uploadPercentage}%`} />
          </div>
        );
      case 'POST_UPLOAD':
        return (
          <div className="border border-primary min-h-full rounded-md flex flex-col justify-center items-center p-7 bg-[#FFEFDC] dark:bg-[#73501A] gap-4">
            <div className="flex items-center gap-3">
              <Attachment />
              <div>
                <p className="text-xl">{file?.name}</p>
                <p className="text-xs text-brand-gray">{file?.size && file.size / 1000} kb</p>
              </div>
            </div>
            <Button size="xl" onClick={handleAnalysis}>
              Start Analysis
            </Button>
          </div>
        );
      case 'ANALYSING':
        return (
          <div className="border border-primary min-h-full rounded-md flex flex-col justify-end p-7 bg-gradient-to-r from-[#FFEFDC] to-white dark:bg-gradient-to-r dark:from-[#2E1C05] dark:to-[#73501A] gap-2">
            <p className="text-xl max-w-[190px]">Please do not close the window</p>
            <div className="text-xs text-brand-gray">{analysingPercentage}% | Second remaining</div>
            <ProgressBar percent={`${analysingPercentage}%`} />
          </div>
        );
      case 'DONE_ANALYSING':
        return (
          <div className="border border-primary min-h-full rounded-md flex flex-col justify-center items-center p-7 bg-[#FFEFDC] dark:bg-[#73501A] gap-4">
            <div className="flex items-center gap-3">
              <Attachment />
              <div>
                <p className="text-xl">{file?.name}</p>
                <p className="text-xs text-brand-gray">{file?.size && file.size / 1000} kb</p>
              </div>
            </div>
            <Button onClick={onShowResult} className="w-full">
              Show Result
            </Button>
            <Button
              onClick={() => {
                // setMode('PRE_UPLOAD');
                router.refresh();
                reset();
              }}
              variant={'outline'}
              className="w-full"
            >
              Upload New File
            </Button>
          </div>
        );
      case 'ERROR':
        return (
          <div className="border border-primary min-h-full rounded-md flex flex-col justify-end p-7 bg-gradient-to-r from-[#FFEFDC] to-white dark:bg-gradient-to-r dark:from-[#2E1C05] dark:to-[#73501A] gap-2">
            <p className="text-xl">{file?.name}</p>
            <div className="flex justify-between">
              <p className="text-xs text-red-400 py-1 px-4 rounded-full border border-red-400 bg-white flex items-center">
                Error: {errorMessage}
              </p>
              <CrossSolid className="hover:opacity-70 cursor-pointer" onClick={reset} />
            </div>
          </div>
        );
    }
  };

  return (
    <div
      className={`relative h-64 w-[500px] bg-white rounded-md p-4 shadow-lg ${className} ${
        data.inDropZone ? 'opacity-70 bg-brand-gray/30' : 'opacity-100'
      }`}
    >
      {renderContent()}
    </div>
  );
};

export default FileDropAndParse;
