import React, { useState, useEffect } from 'react';
import './App.css';
import Button from 'react-bootstrap/Button';
import { Link } from "react-scroll";
import prettier from "prettier";
import parserBabel from "prettier/parser-babel";

function App() {
  const [fileList, setFileList] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);
  const apiURL = "https://api.tajimahalsitdu.it";


  useEffect(() => {
    fetchFileList();
  }, [selectedFile]);
  
  useEffect(() => {
    fetchRandomImage(); 
  }, []); 
  

  const fetchFileList = async () => {
    try {
      const response = await fetch(`${apiURL}/files`);
      if (!response.ok) {
        throw new Error('File list fetch failed');
      }
      const files = await response.json();

      const filteredFiles = files
        .filter(file => file !== 'upload/')
        .map(file => file.replace('upload/', ''));


      setFileList(filteredFiles);
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
    fetch(`${apiURL}/random-image`) 
     .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (data && data.urls && data.urls.regular) {
          const imageUrl = data.urls.regular;
  
          document.body.style.backgroundImage = `url('${imageUrl}')`;
          document.body.style.backgroundPosition = 'center center';
          document.body.style.backgroundRepeat = 'no-repeat';
          document.body.style.backgroundAttachment = 'fixed';
          document.body.style.backgroundSize = 'cover'; 
        } else {
          throw new Error('Invalid data structure from Unsplash API');
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };
  
  const CodeFormatter = () => {
    const [code, setCode] = useState("");
  
    const handleFormatClick = async () => {
      try {
        const response = await fetch('https://api.tajimahalsitdu.it/format-sql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sql: code }),
        });
        const data = await response.json();
        if (response.ok) {
          setCode(data.formattedSQL);
        } else {
          throw new Error(data.error);
        }
      } catch (error) {
        console.error('Formatting failed:', error);
      }
    };
  
    return (
      <div id="code-formatter">
        <textarea value={code} onChange={(e) => setCode(e.target.value)} />
        <button onClick={handleFormatClick}>Format Code</button>
      </div>
    );
  };


  return (
    <div className="App">
    <div id="home"></div>
      <header className="App-header">
        <h1>Tajimahal Sitdu</h1>
      </header>
      <div className="nav-links">
      <Link to="home" smooth={true} duration={500}>Home</Link><br></br>
      <Link to="File-list" smooth={true} duration={500}>Download</Link><br></br>
      <Link to="code-formatter" smooth={true} duration={500}>Code Formatter</Link>
      </div>
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
        <CodeFormatter />
      </main>
      <footer className="App-footer">
        <p></p>
      </footer>
    </div>
  );
}

export default App;
