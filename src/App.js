import React, { useState, useEffect } from 'react';
import './App.css';
import Button from 'react-bootstrap/Button';

function App() {
  const [fileList, setFileList] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);
  const apiURL = "https://www.tajimahalsitdu.it";

  useEffect(() => {
    fetchFileList();
  }, [selectedFile]);

  const fetchFileList = async () => {
    try {
      const response = await fetch(`${apiURL}/files`);
      if (!response.ok) {
        throw new Error('File list fetch failed');
      }
      const files = await response.json();
      setFileList(files);
      setError(null);
    } catch (error) {
      console.error('Error fetching file list:', error);
      setError(error.message);
    }
  };

  const handleFileSelect = (fileName) => {
    setSelectedFile(fileName);
  };

  const handleDownload = async () => {
    if (!selectedFile) {
      alert('파일을 선택해주세요.');
      return;
    }

    const confirmDownload = window.confirm(`${selectedFile} Would you like to download the file?`);
    if (confirmDownload) {
      const fileName = selectedFile.replace('upload/', '');
      const downloadUrl = `${apiURL}/download/${fileName}`;
      window.open(downloadUrl, '_blank');
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${apiURL}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('File upload failed');
      }

      await response.json();
      console.log('File uploaded successfully');
      fetchFileList();
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    }
  };  

  return (
    <div className="App">
      <header className="App-header">
        <h1>Tajimahal Sitdu</h1>
      </header>
      <main className="App-main">
        <div className="File-operations">
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
          <input id="file-upload" type="file" onChange={handleFileUpload} />
          <Button className="button-style" onClick={handleDownload}>
            Download Selected File
          </Button>
          {error && <div className="error">{error}</div>}
        </div>
      </main>
      <footer className="App-footer">
        <p></p>
      </footer>
    </div>
  );
}

export default App;
