import React from 'react';
import Button from 'react-bootstrap/Button';
import { uploadFile, downloadFile, deleteFile, verifyPassword } from '../services/fileService';

const FileOperations = ({ selectedFile, onFileListUpdate }) => {
  const apiURL = "https://api.tajimahalsitdu.it";

  const handleUpload = async () => {
    const password = prompt("Please enter the password for upload:");
    if (!password) return;

    const isPasswordValid = await verifyPassword(password, 'upload');
    if (!isPasswordValid) {
      alert('Invalid password');
      return;
    }

    // Password is valid, open the file selector
    document.getElementById('file-upload').click();
  };

  const handleFileChange = async (event) => {
    const files = event.target.files;
    if (files.length === 0) return;
  
    const formData = new FormData();
    formData.append('file', files[0]);
  
    try {
      const response = await uploadFile(formData, apiURL);
      if (response.data.originalname === files[0].name) {
        await onFileListUpdate(); // 파일 목록 업데이트
      } else {
        alert(`Upload failed`);
      }
    } catch (error) {
      alert(`Upload failed`);
    }
  };
  
  
  

  const handleDownload = async () => {
    if (!selectedFile) {
      alert('Please select a file to download.');
      return;
    }
    
    const passwordInput = prompt("Please enter the password for download:");
    if (passwordInput) {
      const isPasswordValid = await verifyPassword(passwordInput, 'download'); // 'download' 대신에 passwordInput을 전달
      if (isPasswordValid) {
        downloadFile(selectedFile, apiURL, passwordInput); // passwordInput을 downloadFile 함수에 전달
      } else {
        alert('Invalid password');
      }
    }
  };
  
  
  

  const handleDelete = async () => {
    if (!selectedFile) {
      alert('Please select a file to delete.');
      return;
    }
  
    const passwordInput = prompt("Please enter the password for deletion:");
    if (passwordInput) {
      const deleteResponse = await deleteFile(selectedFile, passwordInput);
      if (deleteResponse.success) {
        onFileListUpdate();
      } else {
        alert(deleteResponse.error || 'File deletion failed');
      }
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
      <Button onClick={handleUpload} className="button-style">
        Upload File
      </Button>
      <div className="button-container">
        <Button onClick={handleDownload} className="button-style">
          Download Selected File
        </Button>
        <Button onClick={handleDelete} className="button-style">
          Delete Selected File
        </Button>
      </div>
    </div>
  );
};

export default FileOperations;
