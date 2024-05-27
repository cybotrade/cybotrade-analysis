import { DropzoneState } from 'react-dropzone';

import { Upload } from '@app/_assets/icons';

const FilePreUpload = ({ getRootProps, getInputProps }: DropzoneState) => {
  return (
    <div
      {...getRootProps({ className: 'dropzone' })}
      className="border border-primary border-dashed min-h-full flex justify-center items-center flex-col gap-4 p-7 rounded-md"
    >
      <Upload />
      <div className="flex flex-col text-center gap-1">
        <p className="text-lg text-black">
          Drop your files here or{' '}
          <label
            htmlFor="fileSelect"
            className="text-primary underline cursor-pointer duration-200 hover:text-primary-light"
          >
            browse
          </label>
          <input {...getInputProps()} id="fileSelect" className="hidden" />
        </p>
        <p className="text-xs text-brand-gray">Max. File Size 5GB</p>
      </div>
    </div>
  );
};

export default FilePreUpload;
