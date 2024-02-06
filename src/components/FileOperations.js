import React from 'react';
import Button from 'react-bootstrap/Button';
import { uploadFile, downloadFile, deleteFile, verifyPassword } from '../services/fileService';
import useApi from '../hooks/useApi';

const FileOperations = ({ selectedFile, onFileListUpdate }) => {
  const apiURL = "https://api.tajimahalsitdu.it";
  const { request: uploadRequest, error: uploadError } = useApi(uploadFile);
  const { request: downloadRequest, error: downloadError } = useApi(downloadFile);
  const { request: deleteRequest, error: deleteError } = useApi(deleteFile);

  const handleUpload = async () => {
    const password = prompt("Please enter the password for upload:");
    if (!password) return;

    const isPasswordValid = await verifyPassword(password, 'upload');
    if (!isPasswordValid) {
      alert('Invalid password');
      return;
    }

    document.getElementById('file-upload').click();
  };

  const handleFileChange = async (event) => {
    const files = event.target.files;
    if (files.length === 0) return;
  
    const formData = new FormData();
    formData.append('file', files[0]);
  
    await uploadRequest(formData, apiURL);

    if (!uploadError) {
      await onFileListUpdate();
    } else {
      alert(`Upload failed: ${uploadError}`);
    }
  };

  const handleDownload = async () => {
    if (!selectedFile) {
      alert('Please select a file to download.');
      return;
    }
  
    const password = prompt("Please enter the password for download:");
    if (!password) return;

    await downloadRequest(selectedFile, password);

    if (!downloadError) {
      console.log('File download initiated for:', selectedFile);
    } else {
      alert(`Download failed: ${downloadError}`);
    }
  };

  const handleDelete = async () => {
    if (!selectedFile) {
      alert('Please select a file to delete.');
      return;
    }
  
    const password = prompt("Please enter the password for deletion:");
    if (!password) return;

    await deleteRequest(selectedFile, password);

    if (!deleteError) {
      onFileListUpdate();
    } else {
      alert(`Deletion failed: ${deleteError}`);
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
      <Button onClick={handleUpload} className="button-style">Upload File</Button>
      <div className="button-container">
        <Button onClick={handleDownload} className="button-style">Download Selected File</Button>
        <Button onClick={handleDelete} className="button-style">Delete Selected File</Button>
      </div>
    </div>
  );
};

export default FileOperations;
