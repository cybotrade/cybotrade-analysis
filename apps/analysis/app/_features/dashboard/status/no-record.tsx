import { FolderSearch } from 'lucide-react';

export const NoRecord = () => {
  return (
    <div className="row-[2] flex flex-col justify-center items-center w-full h-full">
      <div className="icon">
        <FolderSearch className="w-24 h-24" />
      </div>
      <span className="font-bold text-xl">There are no results.</span>
    </div>
  );
};
