import React from 'react';
import Button from 'react-bootstrap/Button';
import { uploadFile, downloadFile, deleteFile } from '../services/fileService';

const FileOperations = ({ selectedFile, onFileListUpdate }) => {
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        await uploadFile(formData);
        onFileListUpdate();
      } catch (error) {
        alert(error.message);
      }
    }
  };

  const handleDownload = () => {
    if (!selectedFile) {
      alert('Please select a file to download.');
      return;
    }
    downloadFile(selectedFile);
  };

  const handleDelete = async () => {
    if (!selectedFile) {
      alert('Please select a file to delete.');
      return;
    }
    try {
      await deleteFile(selectedFile);
      onFileListUpdate();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="File-operations">
      <input
        id="file-upload"
        type="file"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <label htmlFor="file-upload" className="button-style">
        Upload File
      </label>
      <Button onClick={handleDownload}>Download Selected File</Button>
      <Button onClick={handleDelete}>Delete Selected File</Button>
    </div>
  );
};

export default FileOperations;
