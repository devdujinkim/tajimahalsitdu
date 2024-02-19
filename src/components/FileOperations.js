import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { uploadFile, downloadFile, deleteFile, verifyPassword } from '../services/fileService';
import useApi from '../hooks/useApi';

const FileOperations = ({ selectedFile, onFileListUpdate }) => {
  const apiURL = "https://api.tajimahalsitdu.it";
  const { request: uploadRequest, error: uploadError } = useApi(uploadFile);
  const { request: downloadRequest, error: downloadError } = useApi(downloadFile);
  const { request: deleteRequest, error: deleteError } = useApi(deleteFile);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const handleUpload = () => {
    setIsPasswordModalOpen(true);
  };

  const PasswordModal = ({ onPasswordSubmit, onClose }) => {
    const [password, setPassword] = useState('');

    return (
      <div className="password-modal">
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
        <button onClick={() => onPasswordSubmit(password)}>Submit</button>
        <button onClick={onClose}>Close</button>
      </div>
    );
  };
  
  const handlePasswordSubmit = async (password) => {
    const isPasswordValid = await verifyPassword(password, 'upload');
    if (!isPasswordValid) {
      alert('Invalid password for upload.');
      return;
    }

    setIsPasswordModalOpen(false);
    document.getElementById('file-upload').click();
  };

  const handleCloseModal = () => {
    setIsPasswordModalOpen(false);
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

    const isPasswordValid = await verifyPassword(password, 'download');
    if (!isPasswordValid) {
      alert('Invalid password for download.');
      return;
    }

    await downloadRequest(selectedFile, password, apiURL);

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

const isPasswordValid = await verifyPassword(password, 'delete');
if (!isPasswordValid) {
  alert('Invalid password for deletion.');
  return;
}

await deleteRequest(selectedFile, password, apiURL);

if (!deleteError) {
  await onFileListUpdate();
} else {
  alert(`Deletion failed: ${deleteError}`);
}
};

return (
<div className="File-operations">
{isPasswordModalOpen && (
<PasswordModal 
       onClose={handleCloseModal} 
       onPasswordSubmit={handlePasswordSubmit} 
     />
)}
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
