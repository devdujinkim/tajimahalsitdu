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
    fetchRandomImage(); 
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
  const fetchRandomImage = () => {
    fetch('https://api.unsplash.com/photos/random?collections=70092728&client_id=pveOrULpT7d_nnbNnQy3Pzh9NPbCbchPVehYH06eoe8')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (data && data.urls && data.urls.regular) {
          // `regular` 대신 필요에 따라 `full` 또는 `raw`를 사용할 수 있습니다.
          const imageUrl = data.urls.regular;
  
          // 여기에서 배경 이미지를 동적으로 설정합니다.
          document.body.style.backgroundImage = `url('${imageUrl}')`;
          document.body.style.backgroundPosition = 'center center';
          document.body.style.backgroundRepeat = 'no-repeat';
          document.body.style.backgroundAttachment = 'fixed';
          document.body.style.backgroundSize = 'cover'; // 'contain'을 사용해도 됩니다.
        } else {
          throw new Error('Invalid data structure from Unsplash API');
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
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
