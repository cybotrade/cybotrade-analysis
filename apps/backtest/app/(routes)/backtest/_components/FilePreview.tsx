import React, { useState } from 'react';

const FilePreview = ({ fileData }) => {
    const [files, setFiles] = useState();

    return (
        <div>
            <div>
                {fileData.fileList.map((file: File) => {
                    return (
                        <>
                            <ol>
                                <li key={file.lastModified}>
                                    <div key={file.name}>{file.name}</div>
                                </li>
                            </ol>
                        </>
                    );
                })}
            </div>
        </div>
    );
};

export default FilePreview;
