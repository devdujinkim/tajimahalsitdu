import React, { useState, useEffect } from 'react';
import './App.css';
import Button from 'react-bootstrap/Button';


function App() {
  //const [username, setUsername] = useState('');
  //const [password, setPassword] = useState('');
  //const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const apiURL = "https://www.tajimahalsitdu.it";
  
  
  useEffect(() => {
      fetchFileList();
    
  }, [selectedFile]);

  const fetchFileList = () => {
    const url = `${apiURL}/files`;
    console.log('Fetching files from:', url); // URL 확인을 위한 로그
    fetch(url)
      .then(response => response.json())
      .then(files => {
        setFileList(files);
      })
      .catch(error => {
        console.error('Error fetching file list:', error);
      });
  };

 // const apiURL = process.env.REACT_APP_API_URL;
  const handleFileSelect = (fileName) => {
    setSelectedFile(fileName);
  };
  const handleDownload = () => {
    if (!selectedFile) {
      alert('파일을 선택해주세요.');
      return;
    }

  const confirmDownload = window.confirm(`${selectedFile} Would you like to download the file?`);
  if (confirmDownload) {
    // 파일 다운로드 로직
    //const downloadUrl = `${apiURL}/download/${selectedFile}`;
    const fileName = selectedFile.replace('upload/', '');
    const downloadUrl = `${apiURL}/download/${fileName}`;

    window.open(downloadUrl, '_blank');
  }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const url = `${apiURL}/upload`;
    const formData = new FormData();
    formData.append('file', file);
  
    fetch(url, {
      method: 'POST',
      body: formData,
    })
    .then(response => response.json())
    .then(data => {
      console.log('File uploaded successfully', data);
      fetchFileList(); 
    })
    .catch(error => console.error('Error:', error));
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
            <input id="file-upload" type="file" onChange={handleFileUpload}  />
            {/* <button onClick={handleDownload}>Download Selected File</button> */}
            <button className="button-style" onClick={handleDownload}>
              Download Selected File</button>
          </div>
      </main>
      <footer className="App-footer">
        <p></p>
      </footer>
    </div>
  );
}

export default App;
