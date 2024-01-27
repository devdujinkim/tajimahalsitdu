import React from 'react';

const FileList = ({ fileList, selectedFile, handleFileSelect }) => {
  return (
    <div className="File-list">
      {fileList.map((file, index) => (
        <div
          key={index}
          className={`File-item ${file === selectedFile ? 'selected' : ''}`}
          onClick={() => handleFileSelect(file)}
        >
          {file}
        </div>
      ))}
    </div>
  );
};

export default FileList;
