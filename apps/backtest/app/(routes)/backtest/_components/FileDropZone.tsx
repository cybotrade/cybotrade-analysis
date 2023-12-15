import { DragEvent, useEffect, useReducer, useState } from 'react';
import { toast } from 'react-hot-toast';

import { Upload } from '@app/_assets/icons';
import { Attachment } from '@app/_assets/icons/attachment';
import ProgressLoader from '@app/_components/loadingIndicator';
import { Button } from '@app/_components/ui/button';

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

type Action = SetInDropZoneAction | AddFileToListAction;

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'SET_IN_DROP_ZONE':
      return { ...state, inDropZone: action.inDropZone };
    case 'ADD_FILE_TO_LIST':
      return {
        ...state,
        fileList: state.fileList.concat(action.file),
      };
    default:
      return state;
  }
};

const FileDropZone = ({ className }: { className?: string }) => {
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [analysingPercentage, setAnalysingPercentage] = useState(0);
  const [mode, setMode] = useState<'preUpload' | 'uploading' | 'postUpload' | 'analysing'>(
    'preUpload',
  );
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
    const maxFileSize = 5000000;
    const fileTypes = ['application/json', 'text/plain'];
    const existingFiles = data.fileList.map((f) => f.name);
    if (file && !existingFiles.includes(file.name)) {
      if (!fileTypes.includes(file.type)) {
        return toast.error('please upload the supported file type');
      }
      if (file.size > maxFileSize) {
        return toast.error('please upload a file less than 10GB');
      }
      setMode('uploading');
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

  const handleAnalysis = () => {
    setMode('analysing');
    if (file) {
      try {
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
          const content = e.target?.result;
          console.log('json', content);
        };

        fileReader.readAsText(file);
      } catch (error) {
        console.error('Error reading the file:', error);
      }
    }
  };

  // to remove, just a simulation
  useEffect(() => {
    if (mode === 'uploading' && uploadPercentage < 100) {
      setTimeout(() => {
        setUploadPercentage((prev) => prev + 1);
      }, 30);
    }
    if (mode === 'uploading' && uploadPercentage === 100) {
      setMode('postUpload');
    }
  }, [mode, uploadPercentage]);
  useEffect(() => {
    if (mode === 'analysing' && analysingPercentage < 100) {
      setTimeout(() => {
        setAnalysingPercentage((prev) => prev + 1);
      }, 40);
    }
  }, [mode, analysingPercentage]);
  // end remove

  const renderContent = () => {
    switch (mode) {
      case 'preUpload':
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
      case 'uploading':
        return (
          <div className="border border-primary min-h-full rounded-md flex flex-col justify-end p-7 bg-gradient-to-r from-[#FFEFDC] to-white dark:bg-gradient-to-r dark:from-[#2E1C05] dark:to-[#73501A] gap-2">
            <p>
              Uploading <span>{file?.name}</span>
            </p>
            <div className="text-xs text-brand-gray">{uploadPercentage}% | Second remaining</div>
            <ProgressLoader percent={`${uploadPercentage}%`} />
          </div>
        );
      case 'postUpload':
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
      case 'analysing':
        return (
          <div className="border border-primary min-h-full rounded-md flex flex-col justify-end p-7 bg-gradient-to-r from-[#FFEFDC] to-white dark:bg-gradient-to-r dark:from-[#2E1C05] dark:to-[#73501A] gap-2">
            <p className="text-xl max-w-[190px]">Please do not close the window</p>
            <div className="text-xs text-brand-gray">{analysingPercentage}% | Second remaining</div>
            <ProgressLoader percent={`${analysingPercentage}%`} />
          </div>
        );
    }
  };

  return (
    <div
      className={`h-64 w-[500px] bg-white rounded-md p-4 shadow-lg ${className} ${
        data.inDropZone ? 'opacity-70 bg-brand-gray/30' : 'opacity-100'
      }`}
    >
      {renderContent()}
    </div>
  );
};

export default FileDropZone;
