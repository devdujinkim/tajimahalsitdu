import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { uploadFile, downloadFile, deleteFile, verifyPassword } from '../services/fileService';

const FileOperations = ({ selectedFile, onFileListUpdate }) => {
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const passwordInput = prompt("Please enter the password for upload:"); // Request password input
      if (passwordInput) {
        try {
          const isPasswordValid = await verifyPassword(passwordInput, 'upload'); // Verify the password for upload
          if (isPasswordValid) {
            const formData = new FormData();
            formData.append('file', file);
            try {
              await uploadFile(formData); // Proceed with the file upload
              onFileListUpdate();
              alert('File uploaded successfully');
            } catch (error) {
              alert(error.message);
            }
          } else {
            alert('Invalid password');
          }
        } catch (error) {
          console.error('Error verifying password:', error);
        }
      }
    }
  };
  

  // 파일 다운로드 처리 함수
  const handleDownload = async () => {
    if (!selectedFile) {
      alert('Please select a file to download.');
      return;
    }
    
    const passwordInput = prompt("Please enter the password for download:");
    if (passwordInput) {
      const isPasswordValid = await verifyPassword(passwordInput, 'download');
      if (isPasswordValid) {
        downloadFile(selectedFile);
      } else {
        alert('Invalid password');
      }
    }
  };

  // 파일 삭제 처리 함수
  const handleDelete = async () => {
    if (!selectedFile) {
      alert('Please select a file to delete.');
      return;
    }
    
    const passwordInput = prompt("Please enter the password for deletion:");
    if (passwordInput) {
      const isPasswordValid = await verifyPassword(passwordInput, 'delete');
      if (isPasswordValid) {
        await deleteFile(selectedFile);
        onFileListUpdate();
        alert('File deleted successfully');
      } else {
        alert('Invalid password');
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
      <label htmlFor="file-upload" className="button-style">
        Upload File
      </label>
      <div className="button-container">
        <Button onClick={handleDownload} className="button-style">Download Selected File</Button>
        <Button onClick={handleDelete} className="button-style">Delete Selected File</Button>
      </div>
    </div>
  );
};

export default FileOperations;
